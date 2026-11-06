import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateBot } from '@/lib/bot-auth'
import { socialLinkSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateBot(request, 'links:read')
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const links = await prisma.socialLink.findMany({
      where: { userId: auth.user.id },
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }],
    })

    return NextResponse.json({ links })
  } catch (error) {
    console.error('Bot get links error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateBot(request, 'links:write')
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
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
      where: { userId: auth.user.id },
      _max: { order: true },
    })

    const link = await prisma.socialLink.create({
      data: {
        userId: auth.user.id,
        ...parsed.data,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    })

    return NextResponse.json({ link }, { status: 201 })
  } catch (error) {
    console.error('Bot create link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
