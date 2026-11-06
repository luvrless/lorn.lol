import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const template = await prisma.template.findUnique({
      where: { id },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    const existing = await prisma.favoriteTemplate.findUnique({
      where: { userId_templateId: { userId: session.user.id, templateId: id } },
    })

    if (existing) {
      await prisma.favoriteTemplate.delete({
        where: { userId_templateId: { userId: session.user.id, templateId: id } },
      })

      await prisma.template.update({
        where: { id },
        data: { favoriteCount: { decrement: 1 } },
      })

      return NextResponse.json({ favorited: false })
    }

    await prisma.favoriteTemplate.create({
      data: { userId: session.user.id, templateId: id },
    })

    await prisma.template.update({
      where: { id },
      data: { favoriteCount: { increment: 1 } },
    })

    return NextResponse.json({ favorited: true }, { status: 201 })
  } catch (error) {
    console.error('Favorite template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}