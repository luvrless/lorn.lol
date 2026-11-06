import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const isAdmin = ['ADMIN', 'OWNER', 'MODERATOR'].includes(session.user.role)
    const { id: badgeId } = await params

    const badge = await prisma.badge.findUnique({
      where: { id: badgeId },
    })

    if (!badge) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!isAdmin && targetUser.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    if (!isAdmin && (badge.category === 'STAFF' || badge.category === 'DEVELOPER' || badge.category === 'FOUNDER' || badge.category === 'VERIFIED')) {
      return NextResponse.json(
        { error: 'Cannot award restricted badges' },
        { status: 403 }
      )
    }

    if (badge.maxOwners) {
      const currentOwners = await prisma.userBadge.count({
        where: { badgeId },
      })
      if (currentOwners >= badge.maxOwners) {
        return NextResponse.json(
          { error: 'Badge has reached maximum owners' },
          { status: 400 }
        )
      }
    }

    const existingBadge = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } },
    })

    if (existingBadge) {
      return NextResponse.json(
        { error: 'User already has this badge' },
        { status: 400 }
      )
    }

    const maxOrder = await prisma.userBadge.aggregate({
      where: { userId },
      _max: { order: true },
    })

    const userBadge = await prisma.userBadge.create({
      data: {
        userId,
        badgeId,
        awardedBy: session.user.id,
        order: (maxOrder._max.order ?? -1) + 1,
      },
      include: { badge: true },
    })

    return NextResponse.json({ userBadge }, { status: 201 })
  } catch (error) {
    console.error('Award badge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}