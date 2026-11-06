import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { integrationSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const integrations = await prisma.userIntegration.findMany({
      where: { userId: session.user.id },
      orderBy: { platform: 'asc' },
    })

    return NextResponse.json({ integrations })
  } catch (error) {
    console.error('Get integrations error:', error)
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
    const parsed = integrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const integration = await prisma.userIntegration.upsert({
      where: { userId_platform: { userId: session.user.id, platform: parsed.data.platform } },
      create: {
        userId: session.user.id,
        ...parsed.data,
        isConnected: true,
        lastSyncAt: new Date(),
      },
      update: {
        ...parsed.data,
        isConnected: true,
        lastSyncAt: new Date(),
      },
    })

    return NextResponse.json({ integration })
  } catch (error) {
    console.error('Create integration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}