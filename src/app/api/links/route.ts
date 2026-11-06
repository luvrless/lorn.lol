import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { socialLinkSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const links = await prisma.socialLink.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }],
    })

    return NextResponse.json({ links })
  } catch (error) {
    console.error('Get links error:', error)
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
    const parsed = socialLinkSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const maxOrder = await prisma.socialLink.aggregate({
      where: { userId: session.user.id },
      _max: { order: true },
    })

    const link = await prisma.socialLink.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    })

    return NextResponse.json({ link }, { status: 201 })
  } catch (error) {
    console.error('Create link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}