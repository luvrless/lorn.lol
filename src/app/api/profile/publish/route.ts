import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const draftProfile = await prisma.draftProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!draftProfile) {
      return NextResponse.json(
        { error: 'No draft profile to publish' },
        { status: 400 }
      )
    }

    const publishedProfile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        username: draftProfile.username || session.user.username || `user_${session.user.id.slice(0, 8)}`,
        displayName: draftProfile.displayName,
        bio: draftProfile.bio,
        avatarUrl: draftProfile.avatarUrl,
        bannerUrl: draftProfile.bannerUrl,
        location: draftProfile.location,
        languages: draftProfile.languages,
        showJoinedDate: draftProfile.showJoinedDate,
        profileStatus: draftProfile.profileStatus,
        visibility: draftProfile.visibility,
        allowIndexing: draftProfile.allowIndexing,
        description: draftProfile.description,
        backgroundConfig: draftProfile.backgroundConfig as any,
        cardConfig: draftProfile.cardConfig as any,
        textConfig: draftProfile.textConfig as any,
        cursorConfig: draftProfile.cursorConfig as any,
        overlayConfig: draftProfile.overlayConfig as any,
        animationConfig: draftProfile.animationConfig as any,
        enterScreenConfig: draftProfile.enterScreenConfig as any,
        seoConfig: draftProfile.seoConfig as any,
        version: 1,
        publishedAt: new Date(),
      },
      update: {
        username: draftProfile.username || session.user.username,
        displayName: draftProfile.displayName,
        bio: draftProfile.bio,
        avatarUrl: draftProfile.avatarUrl,
        bannerUrl: draftProfile.bannerUrl,
        location: draftProfile.location,
        languages: draftProfile.languages,
        showJoinedDate: draftProfile.showJoinedDate,
        profileStatus: draftProfile.profileStatus,
        visibility: draftProfile.visibility,
        allowIndexing: draftProfile.allowIndexing,
        description: draftProfile.description,
        backgroundConfig: draftProfile.backgroundConfig as any,
        cardConfig: draftProfile.cardConfig as any,
        textConfig: draftProfile.textConfig as any,
        cursorConfig: draftProfile.cursorConfig as any,
        overlayConfig: draftProfile.overlayConfig as any,
        animationConfig: draftProfile.animationConfig as any,
        enterScreenConfig: draftProfile.enterScreenConfig as any,
        seoConfig: draftProfile.seoConfig as any,
        version: { increment: 1 },
        publishedAt: new Date(),
      },
    })

    return NextResponse.json({
      profile: {
        ...publishedProfile,
        viewCount: publishedProfile.viewCount.toString(),
        uniqueVisitors: publishedProfile.uniqueVisitors.toString(),
        linkClicks: publishedProfile.linkClicks.toString(),
      },
    })
  } catch (error) {
    console.error('Publish profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
