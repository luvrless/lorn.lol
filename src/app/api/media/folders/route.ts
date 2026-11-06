import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const folderSchema = z.object({
  name: z.string().min(1).max(100),
  parentId: z.string().cuid().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const folders = await prisma.assetFolder.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' },
      include: {
        children: {
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { assets: true },
        },
      },
    })

    return NextResponse.json({ folders })
  } catch (error) {
    console.error('Get folders error:', error)
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
    const parsed = folderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    if (parsed.data.parentId) {
      const parent = await prisma.assetFolder.findFirst({
        where: { id: parsed.data.parentId, userId: session.user.id },
      })
      if (!parent) {
        return NextResponse.json(
          { error: 'Parent folder not found' },
          { status: 404 }
        )
      }
    }

    const folder = await prisma.assetFolder.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
      },
    })

    return NextResponse.json({ folder }, { status: 201 })
  } catch (error) {
    console.error('Create folder error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}