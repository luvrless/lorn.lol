import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateBot } from '@/lib/bot-auth'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/mp4']
const ALLOWED_FONT_TYPES = ['font/ttf', 'font/otf', 'font/woff', 'font/woff2', 'application/font-woff', 'application/font-woff2']
const ALLOWED_CURSOR_TYPES = ['image/png', 'image/gif', 'image/x-icon', 'application/octet-stream']

const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_IMAGE_SIZE = 20 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024
const MAX_AUDIO_SIZE = 50 * 1024 * 1024
const MAX_FONT_SIZE = 5 * 1024 * 1024

function getCategory(mimeType: string): string {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'image'
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return 'video'
  if (ALLOWED_AUDIO_TYPES.includes(mimeType)) return 'audio'
  if (ALLOWED_FONT_TYPES.includes(mimeType)) return 'font'
  if (ALLOWED_CURSOR_TYPES.includes(mimeType)) return 'cursor'
  return 'other'
}

function getMaxSize(category: string): number {
  switch (category) {
    case 'image': return MAX_IMAGE_SIZE
    case 'video': return MAX_VIDEO_SIZE
    case 'audio': return MAX_AUDIO_SIZE
    case 'font': return MAX_FONT_SIZE
    default: return MAX_FILE_SIZE
  }
}

async function uploadToUploadThing(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  userId: string
): Promise<{ key: string; url: string; thumbnailUrl?: string }> {
  const uploadThingSecret = process.env.UPLOADTHING_SECRET
  const uploadThingAppId = process.env.UPLOADTHING_APP_ID

  if (!uploadThingSecret || !uploadThingAppId) {
    // Local / fallback handling
    return {
      key: `local_${Date.now()}_${filename}`,
      url: `/uploads/${filename}`,
    }
  }

  const formData = new FormData()
  formData.append('file', new Blob([new Uint8Array(buffer)], { type: mimeType }), filename)
  formData.append('metadata', JSON.stringify({ userId }))

  const response = await fetch(`https://api.uploadthing.com/v6/uploadFiles/${uploadThingAppId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${uploadThingSecret}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`UploadThing upload failed: ${error}`)
  }

  const data = await response.json()
  return {
    key: data.files[0].key,
    url: data.files[0].url,
    thumbnailUrl: data.files[0].thumbnails?.[0]?.url,
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateBot(request, 'media:read')
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const folderId = searchParams.get('folderId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')

    const where: any = { userId: auth.user.id, deletedAt: null }
    if (category) where.category = category
    if (folderId) where.folderId = folderId
    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.asset.count({ where }),
    ])

    return NextResponse.json({
      assets: assets.map(a => ({
        ...a,
        size: a.size.toString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Bot get media error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateBot(request, 'media:write')
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folderId = formData.get('folderId') as string | null
    const tags = formData.get('tags') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const category = getCategory(file.type)
    const maxSize = getMaxSize(category)

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size for ${category} is ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    if (folderId) {
      const folder = await prisma.assetFolder.findFirst({
        where: { id: folderId, userId: auth.user.id },
      })
      if (!folder) {
        return NextResponse.json(
          { error: 'Folder not found' },
          { status: 404 }
        )
      }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadThingUrl = await uploadToUploadThing(buffer, file.name, file.type, auth.user.id)

    const asset = await prisma.asset.create({
      data: {
        userId: auth.user.id,
        folderId,
        filename: uploadThingUrl.key,
        originalName: file.name,
        mimeType: file.type,
        size: BigInt(file.size),
        url: uploadThingUrl.url,
        thumbnailUrl: uploadThingUrl.thumbnailUrl,
        category,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
      },
    })

    return NextResponse.json({ asset: { ...asset, size: asset.size.toString() } }, { status: 201 })
  } catch (error) {
    console.error('Bot upload media error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
