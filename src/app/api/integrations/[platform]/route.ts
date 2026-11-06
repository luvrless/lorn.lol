import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { integrationSchema } from '@/lib/validations'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { platform } = await params

    const integration = await prisma.userIntegration.findUnique({
      where: { userId_platform: { userId: session.user.id, platform: platform.toUpperCase() } },
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = integrationSchema.partial().safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const updatedIntegration = await prisma.userIntegration.update({
      where: { id: integration.id },
      data: parsed.data,
    })

    return NextResponse.json({ integration: updatedIntegration })
  } catch (error) {
    console.error('Update integration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { platform } = await params

    const integration = await prisma.userIntegration.findUnique({
      where: { userId_platform: { userId: session.user.id, platform: platform.toUpperCase() } },
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    await prisma.userIntegration.delete({
      where: { id: integration.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete integration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}