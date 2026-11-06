import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET() {
  const authResult = await verifyAdminSession()
  if (!authResult.authorized) return authResult.response!

  try {
    const badges = await prisma.badge.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { owners: true },
        },
      },
    })

    return NextResponse.json({ badges })
  } catch (error) {
    console.error('Admin badges GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authResult = await verifyAdminSession()
  if (!authResult.authorized) return authResult.response!

  try {
    const body = await request.json()
    const { action, badgeId, userId } = body

    if (!badgeId || !userId) {
      return NextResponse.json({ error: 'badgeId and userId are required' }, { status: 400 })
    }

    if (action === 'revoke') {
      await prisma.userBadge.deleteMany({
        where: {
          badgeId,
          userId,
        },
      })
      return NextResponse.json({ success: true, message: 'Badge revoked' })
    }

    // Award badge
    const awarded = await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId,
          badgeId,
        },
      },
      update: {
        awardedBy: authResult.user?.id || 'staff',
      },
      create: {
        userId,
        badgeId,
        awardedBy: authResult.user?.id || 'staff',
      },
    })

    return NextResponse.json({ success: true, userBadge: awarded })
  } catch (error) {
    console.error('Admin badges POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
