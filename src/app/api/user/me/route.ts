import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateProfileSchema } from '@/lib/validations'
import { authRateLimiter, getClientIp } from '@/lib/rate-limit'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bannerUrl: true,
        bio: true,
        location: true,
        languages: true,
        showJoinedDate: true,
        role: true,
        isActive: true,
        isBanned: true,
        twoFactorEnabled: true,
        premiumExpiresAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            assets: true,
            links: true,
            pages: true,
            widgets: true,
            music: true,
            badges: true,
            templates: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        visibility: true,
        allowIndexing: true,
        viewCount: true,
        uniqueVisitors: true,
        linkClicks: true,
        completionScore: true,
        publishedAt: true,
        backgroundConfig: true,
        cardConfig: true,
        textConfig: true,
        cursorConfig: true,
        overlayConfig: true,
        animationConfig: true,
        enterScreenConfig: true,
        seoConfig: true,
      },
    })

    const serializedProfile = profile ? {
      ...profile,
      viewCount: profile.viewCount.toString(),
      uniqueVisitors: profile.uniqueVisitors.toString(),
      linkClicks: profile.linkClicks.toString(),
    } : null

    return NextResponse.json({ user, profile: serializedProfile })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const ip = getClientIp(request)
    const rateLimit = await authRateLimiter(ip)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { username, ...rest } = body

    const parsed = updateProfileSchema.safeParse(rest)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const updateData: Record<string, any> = { ...parsed.data }

    if (username && typeof username === 'string' && username !== session.user.username) {
      const normalized = username.toLowerCase().trim()
      if (!/^[a-z0-9_-]+$/.test(normalized) || normalized.length < 3 || normalized.length > 30) {
        return NextResponse.json(
          { error: 'Invalid username format' },
          { status: 400 }
        )
      }
      const existing = await prisma.user.findUnique({
        where: { username: normalized },
      })
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
      updateData.username = normalized
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bannerUrl: true,
        bio: true,
        location: true,
        languages: true,
        showJoinedDate: true,
        role: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
