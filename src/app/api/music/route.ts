import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { musicTrackSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const tracks = await prisma.musicTrack.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ tracks })
  } catch (error) {
    console.error('Get music tracks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = musicTrackSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const maxOrder = await prisma.musicTrack.aggregate({
      where: { userId: session.user.id },
      _max: { order: true },
    })

    const track = await prisma.musicTrack.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    })

    return NextResponse.json({ track }, { status: 201 })
  } catch (error) {
    console.error('Create music track error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}