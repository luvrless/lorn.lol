import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
    const period = searchParams.get('period') || '30d'
    const profileId = searchParams.get('profileId')

    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const where: any = {
      userId: session.user.id,
      createdAt: { gte: startDate },
    }

    if (profileId) where.profileId = profileId

    const [views, uniqueVisitors, linkClicks, musicPlays, topLinks, topReferrers, topCountries, topDevices, topBrowsers, dailyStats] = await Promise.all([
      prisma.analyticsEvent.count({ where: { ...where, eventType: 'PROFILE_VIEW' } }),
      prisma.analyticsEvent.groupBy({
        by: ['ipAddress'],
        where: { ...where, eventType: 'PROFILE_VIEW' },
        _count: { ipAddress: true },
      }),
      prisma.analyticsEvent.count({ where: { ...where, eventType: 'LINK_CLICK' } }),
      prisma.analyticsEvent.count({ where: { ...where, eventType: 'MUSIC_PLAY' } }),
      prisma.analyticsEvent.groupBy({
        by: ['eventData'],
        where: { ...where, eventType: 'LINK_CLICK' },
        _count: { eventData: true },
        orderBy: { _count: { eventData: 'desc' } },
        take: 10,
      }),
      prisma.analyticsEvent.groupBy({
        by: ['referrer'],
        where: { ...where, eventType: 'PROFILE_VIEW', referrer: { not: null } },
        _count: { referrer: true },
        orderBy: { _count: { referrer: 'desc' } },
        take: 10,
      }),
      prisma.analyticsEvent.groupBy({
        by: ['country'],
        where: { ...where, eventType: 'PROFILE_VIEW', country: { not: null } },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
        take: 10,
      }),
      prisma.analyticsEvent.groupBy({
        by: ['deviceType'],
        where: { ...where, eventType: 'PROFILE_VIEW', deviceType: { not: null } },
        _count: { deviceType: true },
        orderBy: { _count: { deviceType: 'desc' } },
        take: 10,
      }),
      prisma.analyticsEvent.groupBy({
        by: ['browser'],
        where: { ...where, eventType: 'PROFILE_VIEW', browser: { not: null } },
        _count: { browser: true },
        orderBy: { _count: { browser: 'desc' } },
        take: 10,
      }),
      prisma.analyticsEvent.groupBy({
        by: ['createdAt'],
        where: { ...where, eventType: 'PROFILE_VIEW' },
        _count: { createdAt: true },
      }),
    ])

    const uniqueVisitorCount = uniqueVisitors.length

    const dailyViews = dailyStats.reduce((acc: any, stat) => {
      const date = stat.createdAt.toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + stat._count.createdAt
      return acc
    }, {})

    const chartData = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      chartData.push({
        date: dateStr,
        views: dailyViews[dateStr] || 0,
      })
    }

    return NextResponse.json({
      overview: {
        views,
        uniqueVisitors: uniqueVisitorCount,
        linkClicks,
        musicPlays,
        ctr: views > 0 ? (linkClicks / views * 100).toFixed(2) : 0,
      },
      topLinks: topLinks.map((t) => {
        const eventData = t.eventData as { linkId?: string } | undefined;
        return {
          linkId: eventData?.linkId,
          count: t._count.eventData,
        };
      }),
      topReferrers: topReferrers.map(t => ({ referrer: t.referrer, count: t._count.referrer })),
      topCountries: topCountries.map(t => ({ country: t.country, count: t._count.country })),
      topDevices: topDevices.map(t => ({ device: t.deviceType, count: t._count.deviceType })),
      topBrowsers: topBrowsers.map(t => ({ browser: t.browser, count: t._count.browser })),
      chartData,
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}