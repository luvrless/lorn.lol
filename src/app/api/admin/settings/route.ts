import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET() {
  const authResult = await verifyAdminSession()
  if (!authResult.authorized) return authResult.response!

  try {
    const configs = await prisma.systemConfig.findMany()
    const configMap: Record<string, any> = {}
    for (const c of configs) {
      configMap[c.key] = c.value
    }

    return NextResponse.json({ configs: configMap })
  } catch (error) {
    console.error('Admin settings GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await verifyAdminSession()
  if (!authResult.authorized) return authResult.response!

  try {
    const body = await request.json()
    const { key, value, description } = body

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    const updated = await prisma.systemConfig.upsert({
      where: { key },
      update: { value, ...(description ? { description } : {}) },
      create: { key, value, description: description || '' },
    })

    return NextResponse.json({ success: true, config: updated })
  } catch (error) {
    console.error('Admin settings PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
