import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { widgetSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const widgets = await prisma.widget.findMany({
      where: { userId: session.user.id },
      orderBy: [{ pageId: 'asc' }, { y: 'asc' }, { x: 'asc' }, { order: 'asc' }],
    })

    return NextResponse.json({ widgets })
  } catch (error) {
    console.error('Get widgets error:', error)
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
    const parsed = widgetSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    if (parsed.data.pageId) {
      const page = await prisma.page.findFirst({
        where: { id: parsed.data.pageId, userId: session.user.id },
      })
      if (!page) {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        )
      }
    }

    const maxOrder = await prisma.widget.aggregate({
      where: { userId: session.user.id, pageId: parsed.data.pageId ?? null },
      _max: { order: true },
    })

    const widget = await prisma.widget.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    })

    return NextResponse.json({ widget }, { status: 201 })
  } catch (error) {
    console.error('Create widget error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}