import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { badgeSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const isAdmin = ['ADMIN', 'OWNER', 'MODERATOR'].includes(session.user.role)

    const badges = await prisma.badge.findMany({
      where: isAdmin ? {} : { isHidden: false },
      orderBy: [{ category: 'asc' }, { rarity: 'desc' }, { sortOrder: 'asc' }],
    })

    const userBadges = await prisma.userBadge.findMany({
      where: { userId: session.user.id, isVisible: true },
      include: { badge: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ badges, userBadges })
  } catch (error) {
    console.error('Get badges error:', error)
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

    const isAdmin = ['ADMIN', 'OWNER'].includes(session.user.role)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = badgeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existingSlug = await prisma.badge.findUnique({
      where: { slug: parsed.data.slug },
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'A badge with this slug already exists' },
        { status: 400 }
      )
    }

    const badge = await prisma.badge.create({
      data: parsed.data,
    })

    return NextResponse.json({ badge }, { status: 201 })
  } catch (error) {
    console.error('Create badge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}