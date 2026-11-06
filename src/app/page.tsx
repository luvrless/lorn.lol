import React from 'react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
  Sparkles,
  Palette,
  Music,
  Layers,
  Zap,
  ArrowRight,
  Github,
  MessageSquare,
  Twitter,
  Globe,
  CheckCircle,
  Star,
  Heart,
  Crown,
  Wand2,
  BarChart3,
  Shield,
  Rocket,
  Infinity as InfinityIcon,
} from 'lucide-react'

interface FeatureItem {
  icon: any
  title: string
  description: string
}

interface IntegrationItem {
  name: string
  icon: any
  color: string
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

const features: FeatureItem[] = [
  {
    icon: Palette,
    title: 'Advanced Customization',
    description: 'Control every pixel of your profile with animated backgrounds, custom cursors, text effects, and 3D card animations.',
  },
  {
    icon: Layers,
    title: 'Pages & Widgets',
    description: 'Create multiple pages with drag-and-drop widgets: galleries, music players, gaming stats, social feeds, and more.',
  },
  {
    icon: Music,
    title: 'Music Player',
    description: 'Upload your own tracks, add synced lyrics, choose from vinyl, waveform, or minimal player styles.',
  },
  {
    icon: Zap,
    title: 'Click-to-Enter',
    description: 'Build immersive entry screens with custom animations, sounds, and full-screen backgrounds before revealing your profile.',
  },
  {
    icon: Globe,
    title: 'Integrations',
    description: 'Connect Discord, Roblox, Steam, GitHub, Spotify, YouTube, Twitch, and more for live status and data.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track views, unique visitors, link clicks, music plays, and traffic sources with beautiful interactive charts.',
  },
]

const integrations = [
  { name: 'Discord', icon: MessageSquare, color: 'text-[#5865F2]' },
  { name: 'Roblox', icon: Globe, color: 'text-[#00A2FF]' },
  { name: 'Steam', icon: Globe, color: 'text-[#1B2838]' },
  { name: 'GitHub', icon: Github, color: 'text-white' },
  { name: 'Spotify', icon: Music, color: 'text-[#1DB954]' },
  { name: 'YouTube', icon: Globe, color: 'text-[#FF0000]' },
  { name: 'Twitch', icon: Globe, color: 'text-[#9146FF]' },
  { name: 'Twitter', icon: Twitter, color: 'text-white' },
]

export default async function HomePage() {
  const session = await auth()

  if (session?.user) {
    redirect('/dashboard/overview')
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundEffects />
      <Navigation />
      <HeroSection />
      <FeaturesSection features={features} />
      <IntegrationsSection integrations={integrations} />
      <CTASection />
      <Footer />
    </div>
  )
}

function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <CanvasBackground />
    </div>
  )
}

function CanvasBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = []
    const particleCount = 80

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '262, 83%, 58%' : '290, 84%, 61%',
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.color}, ${p.opacity})`
        ctx.fill()

        particles.forEach((p2) => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `hsla(${p.color}, ${0.1 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
}

function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-border/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">LORN.LOL</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#integrations" className="text-muted-foreground hover:text-foreground transition-colors">
              Integrations
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:from-primary/90 hover:to-accent/90 transition-all shadow-glow"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 inline-block" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-border/50 mb-8 animate-in">
            <Star className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Now in Public Beta</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-in" style={{ animationDelay: '100ms' }}>
            Your Digital{' '}
            <span className="text-gradient">Identity</span>
            , Redefined
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in" style={{ animationDelay: '200ms' }}>
            Create stunning, animated profiles with unlimited customization.
            Backgrounds, music, widgets, integrations &mdash; all yours to design.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in" style={{ animationDelay: '300ms' }}>
            <Link
              href="/auth/signup"
              className="group w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:from-primary/90 hover:to-accent/90 transition-all shadow-glow flex items-center justify-center gap-2"
            >
              Create Your Profile
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/templates"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold glass border-border/50 text-foreground rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              Browse Templates
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No coding required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Full customization</span>
            </div>
          </div>
        </div>

        <ProfilePreview className="mt-20 animate-in" style={{ animationDelay: '500ms' }} />
      </div>
    </section>
  )
}

function ProfilePreview({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative max-w-md mx-auto ${className || ''}`} style={style}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl animate-pulse" />
      <div className="relative glass-dark rounded-3xl border-border/50 p-6 overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-gradient">username</h3>
            <p className="text-muted-foreground text-sm">Digital Creator</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 glass rounded-xl">
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-sm">lorn.lol/username</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
          </div>
          <div className="flex items-center gap-3 p-3 glass rounded-xl">
            <BarChart3 className="w-5 h-5 text-accent" />
            <span className="text-sm">12.4K profile views</span>
          </div>
          <div className="flex items-center gap-3 p-3 glass rounded-xl">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm">847 link clicks</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {integrations.slice(0, 5).map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg text-xs"
            >
              <integration.icon className={`w-4 h-4 ${integration.color}`} />
              <span>{integration.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeaturesSection({ features }: { features: FeatureItem[] }) {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Everything you need to{' '}
            <span className="text-gradient">stand out</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for creators, gamers, developers, and anyone who wants a digital identity that's truly theirs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }: { feature: FeatureItem; index: number }) {
  return (
    <div
      className="group glass-dark rounded-2xl border-border/50 p-6 hover:border-primary/50 hover:shadow-glow transition-all duration-500 animate-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <feature.icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </div>
  )
}

function IntegrationsSection({ integrations }: { integrations: IntegrationItem[] }) {
  return (
    <section id="integrations" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Connect your{' '}
            <span className="text-gradient">favorite platforms</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sync live data, display real-time status, and showcase your presence across the web.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {integrations.map((integration) => (
            <IntegrationCard key={integration.name} integration={integration} />
          ))}
        </div>
      </div>
    </section>
  )
}

function IntegrationCard({ integration }: { integration: IntegrationItem }) {
  return (
    <div className="group glass-dark rounded-xl border-border/50 p-6 text-center hover:border-primary/50 hover:shadow-glow transition-all duration-500">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <integration.icon className={`w-7 h-7 ${integration.color}`} />
      </div>
      <h3 className="font-medium">{integration.name}</h3>
    </div>
  )
}

function CTASection() {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="glass-dark rounded-3xl border-border/50 p-12 md:p-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-border/50 mb-6">
            <Crown className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Premium Features Available</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            Ready to build your{' '}
            <span className="text-gradient">digital identity</span>?
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of creators. Free to start, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:from-primary/90 hover:to-accent/90 transition-all shadow-glow flex items-center justify-center gap-2"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/templates"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold glass border-border/50 text-foreground rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              Explore Templates
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-8 text-center">
            <StatItem value="50K+" label="Profiles Created" icon={Heart} />
            <StatItem value="2M+" label="Profile Views" icon={BarChart3} />
            <StatItem value="100K+" label="Links Clicked" icon={ArrowRight} />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, label, icon: Icon }: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="font-display text-3xl font-bold text-gradient">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gradient">LORN.LOL</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your digital identity, your rules. Build something amazing.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link></li>
              <li><Link href="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
              <li><Link href="/api-docs" className="hover:text-foreground transition-colors">API Docs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LORN.LOL. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="https://discord.gg/lorn" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <DiscordIcon className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/lornlol" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://github.com/lornlol" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}