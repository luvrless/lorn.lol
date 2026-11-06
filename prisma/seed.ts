import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const passwordHash = await bcrypt.hash('password123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lorn.lol' },
    update: {
      role: 'OWNER',
    },
    create: {
      email: 'admin@lorn.lol',
      username: 'admin',
      displayName: 'Admin',
      passwordHash,
      role: 'OWNER',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Admin user created/verified:', admin.username)

  const badges = [
    {
      name: 'Staff',
      slug: 'staff',
      description: 'Be a part of the lorn.lol staff team.',
      iconUrl: '/badges/staff.svg',
      color: '#5865F2',
      rarity: 'MYTHIC' as const,
      category: 'STAFF' as const,
      isAnimated: true,
      sortOrder: 1,
    },
    {
      name: 'Helper',
      slug: 'helper',
      description: 'Be active and help users in the community.',
      iconUrl: '/badges/helper.svg',
      color: '#F59E0B',
      rarity: 'RARE' as const,
      category: 'HELPER' as const,
      sortOrder: 2,
    },
    {
      name: 'Premium',
      slug: 'premium',
      description: 'Purchase the premium package.',
      iconUrl: '/badges/premium.svg',
      color: '#A855F7',
      rarity: 'EPIC' as const,
      category: 'PREMIUM' as const,
      isAnimated: true,
      sortOrder: 3,
    },
    {
      name: 'Verified',
      slug: 'verified',
      description: 'Purchase or be a known content creator.',
      iconUrl: '/badges/verified.svg',
      color: '#3B82F6',
      rarity: 'LEGENDARY' as const,
      category: 'VERIFIED' as const,
      isAnimated: true,
      sortOrder: 4,
    },
    {
      name: 'Donor',
      slug: 'donor',
      description: 'Donate at least 10€ to lorn.lol.',
      iconUrl: '/badges/donor.svg',
      color: '#10B981',
      rarity: 'EPIC' as const,
      category: 'DONATOR' as const,
      sortOrder: 5,
    },
    {
      name: 'Gifter',
      slug: 'gifter',
      description: 'Gift a lorn.lol product to another user.',
      iconUrl: '/badges/gifter.svg',
      color: '#F97316',
      rarity: 'RARE' as const,
      category: 'SPECIAL' as const,
      sortOrder: 6,
    },
    {
      name: 'Image Host',
      slug: 'image-host',
      description: 'Purchase the Image Host.',
      iconUrl: '/badges/image-host.svg',
      color: '#10B981',
      rarity: 'RARE' as const,
      category: 'SPECIAL' as const,
      sortOrder: 7,
    },
    {
      name: 'Domain Legend',
      slug: 'domain-legend',
      description: 'Add a public custom domain to lorn.lol Image Host.',
      iconUrl: '/badges/domain-legend.svg',
      color: '#EF4444',
      rarity: 'LEGENDARY' as const,
      category: 'MILESTONE' as const,
      sortOrder: 8,
    },
    {
      name: 'OG',
      slug: 'og',
      description: 'Be an early supporter of lorn.lol (First 150 registered users).',
      iconUrl: '/badges/og.svg',
      color: '#EAB308',
      rarity: 'LEGENDARY' as const,
      category: 'EARLY_SUPPORTER' as const,
      sortOrder: 9,
    },
    {
      name: 'Server Booster',
      slug: 'server-booster',
      description: 'Boost the lorn.lol discord server.',
      iconUrl: '/badges/booster.svg',
      color: '#F97316',
      rarity: 'EPIC' as const,
      category: 'COMMUNITY' as const,
      sortOrder: 10,
    },
    {
      name: 'Bug Hunter',
      slug: 'bug-hunter',
      description: 'Report a bug to the lorn.lol team.',
      iconUrl: '/badges/bug-hunter.svg',
      color: '#10B981',
      rarity: 'RARE' as const,
      category: 'SPECIAL' as const,
      sortOrder: 11,
    },
    {
      name: 'Summer 2026',
      slug: 'summer-2026',
      description: 'Exclusive badge from the 2026 summer sale.',
      iconUrl: '/badges/summer-2026.svg',
      color: '#F59E0B',
      rarity: 'RARE' as const,
      category: 'EVENT' as const,
      sortOrder: 12,
    },
    {
      name: 'Easter 2026',
      slug: 'easter-2026',
      description: 'Exclusive badge from the 2026 easter sale.',
      iconUrl: '/badges/easter-2026.svg',
      color: '#A855F7',
      rarity: 'RARE' as const,
      category: 'EVENT' as const,
      sortOrder: 13,
    },
    {
      name: 'Christmas 2025',
      slug: 'christmas-2025',
      description: 'Exclusive badge from the 2025 winter sale.',
      iconUrl: '/badges/christmas-2025.svg',
      color: '#06B6D4',
      rarity: 'RARE' as const,
      category: 'EVENT' as const,
      sortOrder: 14,
    },
    {
      name: 'Easter 2025',
      slug: 'easter-2025',
      description: 'Exclusive badge from the 2025 easter sale.',
      iconUrl: '/badges/easter-2025.svg',
      color: '#EC4899',
      rarity: 'RARE' as const,
      category: 'EVENT' as const,
      sortOrder: 15,
    },
    {
      name: 'Christmas 2024',
      slug: 'christmas-2024',
      description: 'Exclusive badge from the 2024 winter sale.',
      iconUrl: '/badges/christmas-2024.svg',
      color: '#EF4444',
      rarity: 'RARE' as const,
      category: 'EVENT' as const,
      sortOrder: 16,
    },
    {
      name: 'The 1K',
      slug: 'the-1k',
      description: 'Celebration badge for 1K registered users.',
      iconUrl: '/badges/the-1k.svg',
      color: '#14B8A6',
      rarity: 'MYTHIC' as const,
      category: 'MILESTONE' as const,
      isAnimated: true,
      sortOrder: 17,
    },
    {
      name: 'Winner',
      slug: 'winner',
      description: 'Win a lorn.lol event.',
      iconUrl: '/badges/winner.svg',
      color: '#EAB308',
      rarity: 'LEGENDARY' as const,
      category: 'EVENT' as const,
      sortOrder: 18,
    },
    {
      name: 'Second Place',
      slug: 'second-place',
      description: 'Get second place in a lorn.lol event.',
      iconUrl: '/badges/second-place.svg',
      color: '#94A3B8',
      rarity: 'EPIC' as const,
      category: 'EVENT' as const,
      sortOrder: 19,
    },
    {
      name: 'Third Place',
      slug: 'third-place',
      description: 'Get third place in a lorn.lol event.',
      iconUrl: '/badges/third-place.svg',
      color: '#D97706',
      rarity: 'RARE' as const,
      category: 'EVENT' as const,
      sortOrder: 20,
    },
    {
      name: 'Christmas 2026',
      slug: 'christmas-2026',
      description: 'Exclusive badge from the 2026 winter event.',
      iconUrl: '/badges/christmas-2026.svg',
      color: '#06B6D4',
      rarity: 'RARE' as const,
      category: 'EVENT' as const,
      sortOrder: 21,
    },
    {
      name: 'Easter 2027',
      slug: 'easter-2027',
      description: 'Exclusive badge from the 2027 easter event.',
      iconUrl: '/badges/easter-2027.svg',
      color: '#F472B6',
      rarity: 'RARE' as const,
      category: 'EVENT' as const,
      sortOrder: 22,
    },
    {
      name: 'Summer 2027',
      slug: 'summer-2027',
      description: 'Exclusive badge from the 2027 summer event.',
      iconUrl: '/badges/summer-2027.svg',
      color: '#F59E0B',
      rarity: 'RARE' as const,
      category: 'EVENT' as const,
      sortOrder: 23,
    },
    {
      name: 'Founder',
      slug: 'founder',
      description: 'Founding member of lorn.lol.',
      iconUrl: '/badges/founder.svg',
      color: '#EC4899',
      rarity: 'MYTHIC' as const,
      category: 'FOUNDER' as const,
      isAnimated: true,
      sortOrder: 24,
    },
    {
      name: 'Developer',
      slug: 'developer',
      description: 'Official platform developer.',
      iconUrl: '/badges/developer.svg',
      color: '#10B981',
      rarity: 'EPIC' as const,
      category: 'DEVELOPER' as const,
      sortOrder: 25,
    },
    {
      name: 'Early Supporter',
      slug: 'early-supporter',
      description: 'Early supporter during platform beta.',
      iconUrl: '/badges/early-supporter.svg',
      color: '#8B5CF6',
      rarity: 'LEGENDARY' as const,
      category: 'EARLY_SUPPORTER' as const,
      sortOrder: 26,
    },
  ]

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: badge,
    })
  }

  console.log(`✅ ${badges.length} Badges seeded successfully`)

  const systemConfigs = [
    { key: 'site_name', value: 'LORN.LOL', description: 'Site name' },
    { key: 'site_description', value: 'Your Digital Identity', description: 'Site description' },
    { key: 'owner_discord_id', value: '409564774444171265', description: 'Official Owner Discord ID' },
    { key: 'premium_mode_free', value: true, description: 'When true, all premium features are currently free for everyone' },
    { key: 'enable_registration', value: true, description: 'Enable user registration' },
    { key: 'enable_discord_oauth', value: true, description: 'Enable Discord OAuth' },
    { key: 'enable_google_oauth', value: false, description: 'Enable Google OAuth' },
    { key: 'default_profile_visibility', value: 'PUBLIC', description: 'Default profile visibility' },
    { key: 'max_file_size_mb', value: 100, description: 'Maximum file upload size in MB' },
    { key: 'allowed_image_types', value: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], description: 'Allowed image MIME types' },
    { key: 'allowed_video_types', value: ['video/mp4', 'video/webm', 'video/quicktime'], description: 'Allowed video MIME types' },
    { key: 'allowed_audio_types', value: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'], description: 'Allowed audio MIME types' },
    { key: 'milestone_1k_achieved', value: false, description: 'Whether 1K users milestone has been triggered' },
  ]

  for (const config of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
  }

  console.log('✅ System configs created')
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
