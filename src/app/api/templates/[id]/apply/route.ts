import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const applySchema = z.object({
  applyBackground: z.boolean().default(true),
  applyCard: z.boolean().default(true),
  applyText: z.boolean().default(true),
  applyCursor: z.boolean().default(true),
  applyOverlay: z.boolean().default(true),
  applyAnimation: z.boolean().default(true),
  applyEnterScreen: z.boolean().default(true),
  applySeo: z.boolean().default(false),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const template = await prisma.template.findFirst({
      where: {
        id,
        OR: [
          { visibility: 'PUBLIC' },
          { userId: session.user.id },
        ],
      },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = applySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const config = template.config as any
    const updateData: any = {}

    if (parsed.data.applyBackground && config.background) {
      updateData.backgroundConfig = config.background
    }
    if (parsed.data.applyCard && config.card) {
      updateData.cardConfig = config.card
    }
    if (parsed.data.applyText && config.text) {
      updateData.textConfig = config.text
    }
    if (parsed.data.applyCursor && config.cursor) {
      updateData.cursorConfig = config.cursor
    }
    if (parsed.data.applyOverlay && config.overlay) {
      updateData.overlayConfig = config.overlay
    }
    if (parsed.data.applyAnimation && config.animation) {
      updateData.animationConfig = config.animation
    }
    if (parsed.data.applyEnterScreen && config.enterScreen) {
      updateData.enterScreenConfig = config.enterScreen
    }
    if (parsed.data.applySeo && config.seo) {
      updateData.seoConfig = config.seo
    }

    await prisma.draftProfile.upsert({
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

    await prisma.template.update({
      where: { id },
      data: { useCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true, applied: Object.keys(updateData) })
  } catch (error) {
    console.error('Apply template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}