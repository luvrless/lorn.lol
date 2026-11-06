import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIp } from '@/lib/rate-limit'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const link = await prisma.socialLink.findUnique({
      where: { id },
      select: { id: true, userId: true, url: true },
    })

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    const ip = getClientIp(request)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingClick = await prisma.analyticsEvent.findFirst({
      where: {
        userId: link.userId,
        eventType: 'LINK_CLICK',
        eventData: { path: ['linkId'], equals: id },
        createdAt: { gte: today },
        ipAddress: ip,
      },
    })

    await prisma.socialLink.update({
      where: { id },
      data: {
        clickCount: { increment: 1 },
        uniqueClicks: existingClick ? undefined : { increment: 1 },
      },
    })

    await prisma.analyticsEvent.create({
      data: {
        userId: link.userId,
        eventType: 'LINK_CLICK',
        eventData: { linkId: id, url: link.url },
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined,
        referrer: request.headers.get('referer') || undefined,
      },
    })

    return NextResponse.json({ url: link.url })
  } catch (error) {
    console.error('Track link click error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}