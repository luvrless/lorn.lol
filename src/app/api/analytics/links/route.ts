import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const linkId = searchParams.get('linkId')

    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const where: any = {
      userId: session.user.id,
      eventType: 'LINK_CLICK',
      createdAt: { gte: startDate },
    }

    if (linkId) where.eventData = { path: ['linkId'], equals: linkId }

    const [totalClicks, uniqueClicks, clicksByLink, dailyClicks, topReferrers, topCountries] = await Promise.all([
      prisma.analyticsEvent.count({ where }),
      prisma.analyticsEvent.groupBy({
        by: ['ipAddress'],
        where,
        _count: { ipAddress: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ['eventData'],
        where,
        _count: { eventData: true },
        orderBy: { _count: { eventData: 'desc' } },
      }),
      prisma.analyticsEvent.groupBy({
        by: ['createdAt'],
        where,
        _count: { createdAt: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ['referrer'],
        where: { ...where, referrer: { not: null } },
        _count: { referrer: true },
        orderBy: { _count: { referrer: 'desc' } },
        take: 10,
      }),
      prisma.analyticsEvent.groupBy({
        by: ['country'],
        where: { ...where, country: { not: null } },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
        take: 10,
      }),
    ])

    const linkStats = await prisma.socialLink.findMany({
      where: { userId: session.user.id },
      select: { id: true, label: true, url: true, clickCount: true, uniqueClicks: true },
    })

    const clicksByLinkMap = clicksByLink.reduce((acc: any, item) => {
      const eventData = item.eventData as { linkId?: string } | undefined
      const linkId = eventData?.linkId
      if (linkId) acc[linkId] = item._count.eventData
      return acc
    }, {})

    const dailyClicksMap = dailyClicks.reduce((acc: any, stat) => {
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
        clicks: dailyClicksMap[dateStr] || 0,
      })
    }

    return NextResponse.json({
      overview: {
        totalClicks,
        uniqueClicks: uniqueClicks.length,
      },
      links: linkStats.map(link => ({
        ...link,
        periodClicks: clicksByLinkMap[link.id] || 0,
      })),
      topReferrers: topReferrers.map(t => ({ referrer: t.referrer, count: t._count.referrer })),
      topCountries: topCountries.map(t => ({ country: t.country, count: t._count.country })),
      chartData,
    })
  } catch (error) {
    console.error('Get link analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}