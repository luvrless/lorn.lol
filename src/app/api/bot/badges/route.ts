import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateBot } from '@/lib/bot-auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateBot(request, 'badges:read')
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const userBadges = await prisma.userBadge.findMany({
      where: { userId: auth.user.id, isVisible: true },
      include: {
        badge: {
          select: {
            id: true,
            name: true,
            slug: true,
            iconUrl: true,
            color: true,
            glowColor: true,
            rarity: true,
            isAnimated: true,
            animationConfig: true,
            category: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ badges: userBadges.map(ub => ub.badge) })
  } catch (error) {
    console.error('Bot get badges error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateBot(request, 'badges:write')
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const { badges } = body

    if (!Array.isArray(badges)) {
      return NextResponse.json(
        { error: 'Badges must be an array' },
        { status: 400 }
      )
    }

    await prisma.$transaction(
      badges.map(({ badgeId, order, isVisible }: { badgeId: string; order: number; isVisible?: boolean }) =>
        prisma.userBadge.update({
          where: { userId_badgeId: { userId: auth.user.id, badgeId } },
          data: { order, isVisible },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Bot update badges error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
