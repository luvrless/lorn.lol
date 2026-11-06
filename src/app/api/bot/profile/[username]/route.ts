import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateBot } from '@/lib/bot-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const auth = await authenticateBot(request, 'profiles:read')
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { username } = params
    const normalizedUsername = username.toLowerCase()

    const user = await prisma.user.findUnique({
      where: { username: normalizedUsername },
      include: {
        profile: true,
        badges: {
          where: { isVisible: true },
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
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        links: {
          where: { visibility: { not: 'HIDDEN' }, isArchived: false },
          orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }],
        },
        pages: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          include: {
            widgets: {
              where: { isVisible: true, isEnabled: true },
              orderBy: [{ y: 'asc' }, { x: 'asc' }, { order: 'asc' }],
            },
          },
        },
        widgets: {
          where: { pageId: null, isVisible: true, isEnabled: true },
          orderBy: [{ y: 'asc' }, { x: 'asc' }, { order: 'asc' }],
        },
        music: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    if (user.profile.visibility === 'PRIVATE') {
      return NextResponse.json(
        { error: 'Profile is private' },
        { status: 403 }
      )
    }

    const { profile, ...userData } = user
    return NextResponse.json({
      profile: {
        ...profile,
        viewCount: profile.viewCount.toString(),
        uniqueVisitors: profile.uniqueVisitors.toString(),
        linkClicks: profile.linkClicks.toString(),
      },
      user: {
        id: userData.id,
        username: userData.username,
        displayName: userData.displayName,
        avatarUrl: userData.avatarUrl,
        bannerUrl: userData.bannerUrl,
        bio: userData.bio,
        location: userData.location,
        languages: userData.languages,
        showJoinedDate: userData.showJoinedDate,
        createdAt: userData.createdAt,
        role: userData.role,
        badges: userData.badges,
        links: userData.links.map(l => ({
          ...l,
          clickCount: l.clickCount.toString(),
          uniqueClicks: l.uniqueClicks.toString(),
        })),
        pages: userData.pages.map(p => ({
          ...p,
          viewCount: p.viewCount.toString(),
        })),
        widgets: userData.widgets,
        music: userData.music.map(m => ({
          ...m,
          playCount: m.playCount.toString(),
        })),
      },
    })
  } catch (error) {
    console.error('Bot get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
