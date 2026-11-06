'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BackgroundRenderer } from './BackgroundRenderer'
import { ProfileCard } from './ProfileCard'
import { SocialLinks } from './SocialLinks'
import { Badges } from './Badges'
import { MusicPlayer } from './MusicPlayer'
import { EnterScreen } from './EnterScreen'
import { PagesRenderer } from './PagesRenderer'
import { WidgetsRenderer } from './WidgetsRenderer'
import { CursorEffects } from './CursorEffects'
import { OverlayEffects } from './OverlayEffects'
import { trackProfileView } from '@/lib/analytics'

interface ProfileRendererProps {
  profile: any
  username: string
}

export function ProfileRenderer({ profile, username }: ProfileRendererProps) {
  const [showEnterScreen, setShowEnterScreen] = useState(true)
  const [enterScreenExiting, setEnterScreenExiting] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    trackProfileView(username)

    const enterScreenConfig = profile?.enterScreenConfig
    if (!enterScreenConfig?.enabled) {
      setShowEnterScreen(false)
      setProfileLoaded(true)
      return
    }

    const timer = setTimeout(() => {
      setProfileLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [username, profile?.enterScreenConfig?.enabled])

  const handleEnterClick = () => {
    const enterScreenConfig = profile?.enterScreenConfig
    if (enterScreenConfig?.exitAnimation && enterScreenConfig.exitAnimation !== 'none') {
      setEnterScreenExiting(true)
      setTimeout(() => {
        setShowEnterScreen(false)
        setEnterScreenExiting(false)
      }, 800)
    } else {
      setShowEnterScreen(false)
    }
  }

  if (!profileLoaded) {
    return <ProfileSkeleton />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundRenderer config={profile?.backgroundConfig} username={username} />
      <OverlayEffects config={profile?.overlayConfig} />
      <CursorEffects config={profile?.cursorConfig} />

      <AnimatePresence mode="wait">
        {showEnterScreen && (
          <EnterScreen
            key="enter-screen"
            config={profile?.enterScreenConfig}
            onEnter={handleEnterClick}
            exiting={enterScreenExiting}
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={profileRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: showEnterScreen ? 0.8 : 0.2 }}
        className="relative z-10 min-h-screen"
      >
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
          <ProfileCard profile={profile} username={username} config={profile?.cardConfig} />
          <Badges badges={profile?.user?.badges || []} config={profile?.animationConfig} />
          <SocialLinks links={profile?.links || []} config={profile?.animationConfig} />
          <MusicPlayer tracks={profile?.music || []} config={profile?.cardConfig} />
          <WidgetsRenderer widgets={profile?.widgets || []} config={profile?.animationConfig} />
          <PagesRenderer pages={profile?.pages || []} config={profile?.animationConfig} />
        </div>
      </motion.div>

      <SEOHead profile={profile} username={username} />
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto px-4 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-2xl" />
          <div className="h-12 bg-muted rounded-xl" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-muted rounded-xl" />
            <div className="h-20 bg-muted rounded-xl" />
            <div className="h-20 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SEOHead({ profile, username }: { profile: any; username: string }) {
  const seoConfig = profile?.seoConfig || {}
  const title = seoConfig.title || `${username} on LORN.LOL`
  const description = seoConfig.description || `Check out ${username}'s profile on LORN.LOL`
  const ogImage = seoConfig.ogImage || `/api/og?username=${username}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="profile" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {seoConfig.customFavicon && <link rel="icon" href={seoConfig.customFavicon} />}
    </>
  )
}