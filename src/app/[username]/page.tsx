import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProfileRenderer } from '@/components/profile/ProfileRenderer'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  return {
    title: username,
    description: `Check out ${username}'s profile on LORN.LOL`,
    openGraph: {
      title: `${username} on LORN.LOL`,
      description: `Check out ${username}'s profile on LORN.LOL`,
      type: 'profile',
    },
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params

  const profile = await fetchProfile(username)

  if (!profile) {
    notFound()
  }

  return <ProfileRenderer profile={profile} username={username} />
}

async function fetchProfile(username: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/profile/${username}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) return null
    const data = await response.json()
    return data.profile
  } catch {
    return null
  }
}