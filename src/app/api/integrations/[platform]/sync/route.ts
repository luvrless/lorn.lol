import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function syncDiscord(accessToken: string) {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('Failed to fetch Discord user')
  const user = await response.json()

  const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const guilds = guildsResponse.ok ? await guildsResponse.json() : []

  return {
    user: {
      id: user.id,
      username: user.username,
      globalName: user.global_name,
      avatar: user.avatar,
      discriminator: user.discriminator,
    },
    guilds: guilds.map((g: any) => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      owner: g.owner,
      permissions: g.permissions,
    })),
  }
}

async function syncRoblox(accessToken: string) {
  const response = await fetch('https://users.roblox.com/v1/users/authenticated', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('Failed to fetch Roblox user')
  return await response.json()
}

async function syncSteam(accessToken: string) {
  const response = await fetch('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=' + process.env.STEAM_API_KEY + '&steamids=' + accessToken)
  if (!response.ok) throw new Error('Failed to fetch Steam user')
  const data = await response.json()
  return data.response?.players?.[0]
}

async function syncGitHub(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('Failed to fetch GitHub user')
  return await response.json()
}

async function syncSpotify(accessToken: string) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('Failed to fetch Spotify user')
  return await response.json()
}

export async function POST(
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

    if (!integration || !integration.accessToken) {
      return NextResponse.json(
        { error: 'Integration not connected' },
        { status: 404 }
      )
    }

    let profileData: any = null

    try {
      switch (platform.toUpperCase()) {
        case 'DISCORD':
          profileData = await syncDiscord(integration.accessToken)
          break
        case 'ROBLOX':
          profileData = await syncRoblox(integration.accessToken)
          break
        case 'STEAM':
          profileData = await syncSteam(integration.accessToken)
          break
        case 'GITHUB':
          profileData = await syncGitHub(integration.accessToken)
          break
        case 'SPOTIFY':
          profileData = await syncSpotify(integration.accessToken)
          break
        default:
          return NextResponse.json(
            { error: 'Sync not supported for this platform' },
            { status: 400 }
          )
      }

      await prisma.userIntegration.update({
        where: { id: integration.id },
        data: {
          profileData,
          lastSyncAt: new Date(),
          errorMessage: null,
        },
      })

      return NextResponse.json({ profileData })
    } catch (syncError) {
      await prisma.userIntegration.update({
        where: { id: integration.id },
        data: {
          errorMessage: syncError instanceof Error ? syncError.message : 'Sync failed',
        },
      })
      throw syncError
    }
  } catch (error) {
    console.error('Sync integration error:', error)
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    )
  }
}