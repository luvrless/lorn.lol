import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signUpSchema } from '@/lib/validations'
import { authRateLimiter } from '@/lib/rate-limit'
import { generateUsername, isValidUsername } from '@/lib/utils'
import { getClientIp } from '@/lib/rate-limit'

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

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateLimit = await authRateLimiter(ip)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = signUpSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password, username } = parsed.data

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    let finalUsername = username
    if (!finalUsername) {
      finalUsername = generateUsername(email.split('@')[0])
    }

    if (!isValidUsername(finalUsername)) {
      return NextResponse.json(
        { error: 'Invalid username format' },
        { status: 400 }
      )
    }

    if (RESERVED_USERNAMES.includes(finalUsername.toLowerCase())) {
      return NextResponse.json(
        { error: 'This username is reserved' },
        { status: 400 }
      )
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: finalUsername },
    })

    if (existingUsername) {
      let attempts = 0
      while (attempts < 10) {
        const suffix = Math.random().toString(36).substring(2, 6)
        const newUsername = `${finalUsername}_${suffix}`
        const exists = await prisma.user.findUnique({
          where: { username: newUsername },
        })
        if (!exists) {
          finalUsername = newUsername
          break
        }
        attempts++
      }
      if (attempts >= 10) {
        return NextResponse.json(
          { error: 'Unable to generate unique username' },
          { status: 400 }
        )
      }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username: finalUsername,
        displayName: finalUsername,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        createdAt: true,
      },
    })

    await prisma.assetFolder.create({
      data: {
        userId: user.id,
        name: 'Root',
      },
    })

    await prisma.profile.create({
      data: {
        userId: user.id,
        username: finalUsername,
        visibility: 'PUBLIC',
      },
    })

    return NextResponse.json(
      { user, message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}