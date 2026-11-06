import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Discord from 'next-auth/providers/discord'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const OWNER_DISCORD_ID = process.env.LORN_OWNER_DISCORD_ID || '409564774444171265'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/dashboard/overview',
  },
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'identify email guilds guilds.members.read',
        },
      },
      profile(profile) {
        const isOwner = profile.id === OWNER_DISCORD_ID
        return {
          id: profile.id,
          name: profile.global_name || profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${profile.avatar?.startsWith('a_') ? 'gif' : 'png'}`,
          username: profile.username.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
          role: isOwner ? 'OWNER' : 'USER',
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'user',
          role: 'USER',
        }
      },
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorCode: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(8),
            twoFactorCode: z.string().optional(),
          })
          .safeParse(credentials)

        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        })

        if (!user || !user.passwordHash) return null
        if (user.isBanned) return null
        if (user.lockedUntil && user.lockedUntil > new Date()) return null

        const isValid = await bcrypt.compare(password, user.passwordHash)

        if (!isValid) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: { increment: 1 },
              lockedUntil: user.failedLoginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null,
            },
          })
          return null
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        })

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord') {
        const discordId = profile?.id || account.providerAccountId
        const isOwner = discordId === OWNER_DISCORD_ID

        if (user.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (existingUser) {
            if (isOwner && existingUser.role !== 'OWNER') {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { role: 'OWNER' },
              })
            }

            await prisma.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              create: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at ? Number(account.expires_at) : null,
                token_type: account.token_type,
                scope: account.scope,
                id_token: (account.id_token as string) || null,
                session_state: (account.session_state as string) || null,
              },
              update: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at ? Number(account.expires_at) : null,
                token_type: account.token_type,
                scope: account.scope,
                id_token: (account.id_token as string) || null,
                session_state: (account.session_state as string) || null,
              },
            })
          }
        }
      }
      return true
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'USER'
        token.username = (user as any).username || ''
        token.twoFactorRequired = (user as any).twoFactorRequired
      }
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
        if (account.provider === 'discord') {
          token.discordId = account.providerAccountId
          if (account.providerAccountId === OWNER_DISCORD_ID) {
            token.role = 'OWNER'
          }
        }
      }
      if (trigger === 'update' && session) {
        token.username = session.username
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as string) || 'USER'
        session.user.username = (token.username as string) || ''
        ;(session.user as any).discordId = (token as any).discordId
        ;(session as any).twoFactorRequired = token.twoFactorRequired
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      if (user?.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            username: user.username || `user_${user.id.slice(0, 8)}`,
          },
        })
      }
    },
  },
  debug: false,
})

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role: string
      username: string
      discordId?: string
    }
    twoFactorRequired?: boolean
  }

  interface User {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    role: string
    username: string
    discordId?: string
    twoFactorRequired?: boolean
  }
}
