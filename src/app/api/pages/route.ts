import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { pageSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pages = await prisma.page.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' },
      include: {
        widgets: {
          where: { isVisible: true, isEnabled: true },
          orderBy: [{ y: 'asc' }, { x: 'asc' }, { order: 'asc' }],
        },
      },
    })

    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Get pages error:', error)
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
    const parsed = pageSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existingSlug = await prisma.page.findFirst({
      where: { userId: session.user.id, slug: parsed.data.slug },
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      )
    }

    const maxOrder = await prisma.page.aggregate({
      where: { userId: session.user.id },
      _max: { order: true },
    })

    const page = await prisma.page.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
        order: (maxOrder._max.order ?? -1) + 1,
      },
      include: { widgets: true },
    })

    return NextResponse.json({ page }, { status: 201 })
  } catch (error) {
    console.error('Create page error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}