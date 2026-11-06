import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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

export async function GET() {
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

    const publishedProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        backgroundConfig: true,
        cardConfig: true,
        textConfig: true,
        cursorConfig: true,
        overlayConfig: true,
        animationConfig: true,
        enterScreenConfig: true,
        seoConfig: true,
        version: true,
        publishedAt: true,
      },
    })

    return NextResponse.json({
      draft: draftProfile,
      published: publishedProfile,
    })
  } catch (error) {
    console.error('Get profile config error:', error)
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

    const body = await request.json()
    const {
      background,
      card,
      text,
      cursor,
      overlay,
      animation,
      enterScreen,
      seo,
      ...profileData
    } = body

    const updateData: any = { ...profileData }

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
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
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
    console.error('Update profile config error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}