import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reorderSchema = z.object({
  badges: z.array(z.object({
    badgeId: z.string().cuid(),
    order: z.number().int().min(0),
  })),
})

const updateUserBadgeSchema = z.object({
  isVisible: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
})

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

    if (body.badges) {
      const parsed = reorderSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }

      await prisma.$transaction(
        parsed.data.badges.map(({ badgeId, order }) =>
          prisma.userBadge.update({
            where: { userId_badgeId: { userId: session.user.id, badgeId } },
            data: { order },
          })
        )
      )

      return NextResponse.json({ success: true })
    }

    const parsed = updateUserBadgeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { badgeId } = body
    if (!badgeId) {
      return NextResponse.json(
        { error: 'Badge ID is required' },
        { status: 400 }
      )
    }

    const userBadge = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId: session.user.id, badgeId } },
    })

    if (!userBadge) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.userBadge.update({
      where: { userId_badgeId: { userId: session.user.id, badgeId } },
      data: parsed.data,
    })

    return NextResponse.json({ userBadge: updated })
  } catch (error) {
    console.error('Update user badge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const badgeId = searchParams.get('badgeId')

    if (!badgeId) {
      return NextResponse.json(
        { error: 'Badge ID is required' },
        { status: 400 }
      )
    }

    const userBadge = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId: session.user.id, badgeId } },
    })

    if (!userBadge) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      )
    }

    const badge = await prisma.badge.findUnique({
      where: { id: badgeId },
    })

    if (badge && ['STAFF', 'DEVELOPER', 'FOUNDER', 'VERIFIED'].includes(badge.category)) {
      return NextResponse.json(
        { error: 'Cannot remove restricted badges' },
        { status: 403 }
      )
    }

    await prisma.userBadge.delete({
      where: { userId_badgeId: { userId: session.user.id, badgeId } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove user badge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}