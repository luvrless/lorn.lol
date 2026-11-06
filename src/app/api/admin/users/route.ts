import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const authResult = await verifyAdminSession()
  if (!authResult.authorized) return authResult.response!

  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const role = searchParams.get('role') || undefined

    const users = await prisma.user.findMany({
      where: {
        AND: [
          query
            ? {
                OR: [
                  { username: { contains: query, mode: 'insensitive' } },
                  { email: { contains: query, mode: 'insensitive' } },
                  { displayName: { contains: query, mode: 'insensitive' } },
                ],
              }
            : {},
          role ? { role: role as any } : {},
        ],
      },
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        role: true,
        isBanned: true,
        banReason: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            badges: true,
            links: true,
          },
        },
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Admin users GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await verifyAdminSession()
  if (!authResult.authorized) return authResult.response!

  try {
    const body = await request.json()
    const { userId, role, isBanned, banReason } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    if (role !== undefined) updateData.role = role
    if (isBanned !== undefined) {
      updateData.isBanned = isBanned
      updateData.banReason = isBanned ? banReason || 'Banned by administrator' : null
      updateData.bannedAt = isBanned ? new Date() : null
      updateData.bannedBy = isBanned ? authResult.user?.id : null
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        isBanned: true,
        banReason: true,
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Admin users PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
