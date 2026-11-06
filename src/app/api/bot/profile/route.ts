import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateBot } from '@/lib/bot-auth'
import {
  backgroundConfigSchema,
  cardConfigSchema,
  textConfigSchema,
  cursorConfigSchema,
  overlayConfigSchema,
  animationConfigSchema,
  enterScreenConfigSchema,
  seoConfigSchema,
} from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateBot(request, 'profile:read')
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const [published, draft] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId: auth.user.id },
      }),
      prisma.draftProfile.findUnique({
        where: { userId: auth.user.id },
      }),
    ])

    return NextResponse.json({
      published: published ? {
        ...published,
        viewCount: published.viewCount.toString(),
        uniqueVisitors: published.uniqueVisitors.toString(),
        linkClicks: published.linkClicks.toString(),
      } : null,
      draft,
    })
  } catch (error) {
    console.error('Bot get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateBot(request, 'profile:write')
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const {
      displayName,
      bio,
      avatarUrl,
      bannerUrl,
      location,
      languages,
      showJoinedDate,
      profileStatus,
      visibility,
      allowIndexing,
      description,
      background,
      card,
      text,
      cursor,
      overlay,
      animation,
      enterScreen,
      seo,
    } = body

    const updateData: any = {}

    if (displayName !== undefined) updateData.displayName = displayName
    if (bio !== undefined) updateData.bio = bio
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl
    if (location !== undefined) updateData.location = location
    if (languages !== undefined) updateData.languages = languages
    if (showJoinedDate !== undefined) updateData.showJoinedDate = showJoinedDate
    if (profileStatus !== undefined) updateData.profileStatus = profileStatus
    if (visibility !== undefined) updateData.visibility = visibility
    if (allowIndexing !== undefined) updateData.allowIndexing = allowIndexing
    if (description !== undefined) updateData.description = description

    if (background) {
      const parsed = backgroundConfigSchema.safeParse(background)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid background config', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      updateData.backgroundConfig = parsed.data
    }

    if (card) {
      const parsed = cardConfigSchema.safeParse(card)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid card config', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      updateData.cardConfig = parsed.data
    }

    if (text) {
      const parsed = textConfigSchema.safeParse(text)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid text config', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      updateData.textConfig = parsed.data
    }

    if (cursor) {
      const parsed = cursorConfigSchema.safeParse(cursor)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid cursor config', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      updateData.cursorConfig = parsed.data
    }

    if (overlay) {
      const parsed = overlayConfigSchema.safeParse(overlay)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid overlay config', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      updateData.overlayConfig = parsed.data
    }

    if (animation) {
      const parsed = animationConfigSchema.safeParse(animation)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid animation config', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      updateData.animationConfig = parsed.data
    }

    if (enterScreen) {
      const parsed = enterScreenConfigSchema.safeParse(enterScreen)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid enter screen config', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      updateData.enterScreenConfig = parsed.data
    }

    if (seo) {
      const parsed = seoConfigSchema.safeParse(seo)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid SEO config', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      updateData.seoConfig = parsed.data
    }

    const draftProfile = await prisma.draftProfile.upsert({
      where: { userId: auth.user.id },
      create: {
        userId: auth.user.id,
        ...updateData,
        version: 1,
      },
      update: {
        ...updateData,
        version: { increment: 1 },
      },
    })

    return NextResponse.json({ draft: draftProfile })
  } catch (error) {
    console.error('Bot update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateBot(request, 'profile:write')
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { action } = await request.json()

    if (action === 'publish') {
      const draftProfile = await prisma.draftProfile.findUnique({
        where: { userId: auth.user.id },
      })

      if (!draftProfile) {
        return NextResponse.json(
          { error: 'No draft profile to publish' },
          { status: 400 }
        )
      }

      const publishedProfile = await prisma.profile.upsert({
        where: { userId: auth.user.id },
        create: {
          userId: auth.user.id,
          username: draftProfile.username || auth.user.username,
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
          username: draftProfile.username || auth.user.username,
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
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Bot publish profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
