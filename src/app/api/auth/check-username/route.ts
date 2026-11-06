import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isValidUsername } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'system', 'api', 'www', 'mail', 'ftp',
  'blog', 'shop', 'store', 'app', 'dev', 'test', 'staging', 'prod',
  'lorn', 'lol', 'lornlol', 'support', 'help', 'contact', 'about',
  'privacy', 'terms', 'legal', 'security', 'status', 'docs', 'guide',
  'dashboard', 'profile', 'settings', 'account', 'login', 'signup',
  'register', 'signin', 'signout', 'auth', 'oauth', 'discord', 'google',
  'premium', 'pro', 'vip', 'mod', 'moderator', 'staff', 'owner',
  'founder', 'developer', 'bot', 'webhook', 'webhooks', 'cdn', 'static',
  'assets', 'media', 'images', 'img', 'css', 'js', 'javascript', 'api',
  'v1', 'v2', 'v3', 'beta', 'alpha', 'demo', 'example', 'sample',
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      )
    }

    const normalized = username.toLowerCase().trim()

    if (!isValidUsername(normalized)) {
      return NextResponse.json({
        available: false,
        reason: 'Invalid username format. Use 3-30 characters: lowercase letters, numbers, underscores, hyphens.',
        suggestions: [],
      })
    }

    if (RESERVED_USERNAMES.includes(normalized)) {
      return NextResponse.json({
        available: false,
        reason: 'This username is reserved',
        suggestions: [
          `${normalized}_${Math.random().toString(36).substring(2, 6)}`,
          `${normalized}${Math.floor(Math.random() * 1000)}`,
        ],
      })
    }

    const existing = await prisma.user.findUnique({
      where: { username: normalized },
      select: { id: true },
    })

    if (existing) {
      const suggestions = []
      for (let i = 0; i < 3; i++) {
        const suffix = Math.random().toString(36).substring(2, 6)
        const suggestion = `${normalized}_${suffix}`
        const exists = await prisma.user.findUnique({
          where: { username: suggestion },
          select: { id: true },
        })
        if (!exists) suggestions.push(suggestion)
      }

      return NextResponse.json({
        available: false,
        reason: 'This username is already taken',
        suggestions,
      })
    }

    return NextResponse.json({
      available: true,
      reason: 'Username is available',
      suggestions: [],
    })
  } catch (error) {
    console.error('Username check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}