import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET() {
  const authResult = await verifyAdminSession()
  if (!authResult.authorized) return authResult.response!

  try {
    const [
      totalUsers,
      totalLinks,
      totalBadges,
      totalAwardedBadges,
      recentUsers,
      premiumModeConfig,
      pendingReportsCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.socialLink.count(),
      prisma.badge.count(),
      prisma.userBadge.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
        },
      }),
      prisma.systemConfig.findUnique({
        where: { key: 'premium_mode_free' },
      }),
      prisma.report.count({
        where: { status: 'PENDING' },
      }),
    ])

    return NextResponse.json({
      totalUsers,
      totalLinks,
      totalBadges,
      totalAwardedBadges,
      recentUsers,
      premiumModeFree: premiumModeConfig?.value ?? true,
      pendingReports: pendingReportsCount,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
