import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username } = body

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true, userId: true },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const ip = getClientIp(request)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingView = await prisma.analyticsEvent.findFirst({
      where: {
        userId: profile.userId,
        eventType: 'PROFILE_VIEW',
        createdAt: { gte: today },
        ipAddress: ip,
      },
    })

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        viewCount: { increment: 1 },
        uniqueVisitors: existingView ? undefined : { increment: 1 },
      },
    })

    await prisma.analyticsEvent.create({
      data: {
        userId: profile.userId,
        profileId: profile.id,
        eventType: 'PROFILE_VIEW',
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined,
        referrer: request.headers.get('referer') || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track profile view error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}