import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { templateSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const visibility = searchParams.get('visibility')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'newest'

    const where: any = {
      OR: [
        { visibility: 'PUBLIC' },
        { userId: session.user.id },
      ],
    }

    if (category) where.category = category
    if (visibility) where.visibility = visibility
    if (search) {
      where.AND = [
        where,
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { tags: { has: search } },
          ],
        },
      ]
    }

    const orderBy: any = {}
    switch (sort) {
      case 'newest': orderBy.createdAt = 'desc'; break
      case 'oldest': orderBy.createdAt = 'asc'; break
      case 'popular': orderBy.useCount = 'desc'; break
      case 'favorites': orderBy.favoriteCount = 'desc'; break
      default: orderBy.createdAt = 'desc'
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
          _count: {
            select: { favorites: true },
          },
        },
      }),
      prisma.template.count({ where }),
    ])

    const favoriteIds = await prisma.favoriteTemplate.findMany({
      where: { userId: session.user.id, templateId: { in: templates.map(t => t.id) } },
      select: { templateId: true },
    })

    const favoritedSet = new Set(favoriteIds.map(f => f.templateId))

    return NextResponse.json({
      templates: templates.map(t => ({ ...t, isFavorited: favoritedSet.has(t.id) })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get templates error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = templateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const template = await prisma.template.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
      },
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Create template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}