import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateAssetSchema = z.object({
  folderId: z.string().cuid().nullable().optional(),
  tags: z.array(z.string().max(30)).max(20).optional(),
  isPublic: z.boolean().optional(),
})

export async function PATCH(
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

    const asset = await prisma.asset.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = updateAssetSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    if (parsed.data.folderId) {
      const folder = await prisma.assetFolder.findFirst({
        where: { id: parsed.data.folderId, userId: session.user.id },
      })
      if (!folder) {
        return NextResponse.json(
          { error: 'Folder not found' },
          { status: 404 }
        )
      }
    }

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ asset: updatedAsset })
  } catch (error) {
    console.error('Update asset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const asset = await prisma.asset.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    const inUse = await prisma.$transaction(async (tx) => {
      const profile = await tx.profile.findFirst({
        where: {
          OR: [
            { avatarUrl: asset.url },
            { bannerUrl: asset.url },
            { backgroundConfig: { path: ['imageUrl'], equals: asset.url } },
            { backgroundConfig: { path: ['videoUrl'], equals: asset.url } },
          ],
        },
        select: { id: true },
      })
      if (profile) return true

      const draftProfile = await tx.draftProfile.findFirst({
        where: {
          OR: [
            { avatarUrl: asset.url },
            { bannerUrl: asset.url },
            { backgroundConfig: { path: ['imageUrl'], equals: asset.url } },
            { backgroundConfig: { path: ['videoUrl'], equals: asset.url } },
          ],
        },
        select: { id: true },
      })
      if (draftProfile) return true

      const link = await tx.socialLink.findFirst({
        where: { iconUrl: asset.url },
        select: { id: true },
      })
      if (link) return true

      const page = await tx.page.findFirst({
        where: { backgroundConfig: { path: ['imageUrl'], equals: asset.url } },
        select: { id: true },
      })
      if (page) return true

      const widget = await tx.widget.findFirst({
        where: { config: { path: ['imageUrl'], equals: asset.url } },
        select: { id: true },
      })
      if (widget) return true

      const music = await tx.musicTrack.findFirst({
        where: { OR: [{ audioUrl: asset.url }, { coverUrl: asset.url }] },
        select: { id: true },
      })
      if (music) return true

      const template = await tx.template.findFirst({
        where: { previewImageUrl: asset.url },
        select: { id: true },
      })
      if (template) return true

      const badge = await tx.badge.findFirst({
        where: { iconUrl: asset.url },
        select: { id: true },
      })
      if (badge) return true

      return false
    })

    if (inUse) {
      await prisma.asset.update({
        where: { id },
        data: { deletedAt: new Date() },
      })
      return NextResponse.json({ success: true, softDeleted: true })
    }

    await prisma.asset.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete asset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}