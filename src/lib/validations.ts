import { z } from 'zod'

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores, and hyphens')
  .transform(val => val.toLowerCase())

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .toLowerCase()

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

export const displayNameSchema = z
  .string()
  .min(1, 'Display name is required')
  .max(50, 'Display name must be at most 50 characters')
  .regex(/^[\p{L}\p{N}\s._-]+$/u, 'Display name contains invalid characters')

export const bioSchema = z
  .string()
  .max(500, 'Bio must be at most 500 characters')
  .optional()

export const urlSchema = z
  .string()
  .url('Invalid URL')
  .refine(url => {
    try {
      const parsed = new URL(url)
      return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }, 'URL must use HTTP or HTTPS protocol')

export const colorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format')

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug is too long')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .transform(val => val.toLowerCase())

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  username: usernameSchema.optional(),
  recaptchaToken: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  twoFactorCode: z.string().optional(),
  rememberMe: z.boolean().optional(),
})

export const updateProfileSchema = z.object({
  displayName: displayNameSchema.optional(),
  bio: bioSchema,
  location: z.string().max(100).optional(),
  languages: z.array(z.string().min(1).max(50)).max(10).optional(),
  showJoinedDate: z.boolean().optional(),
  profileStatus: z.string().max(100).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).optional(),
  allowIndexing: z.boolean().optional(),
  description: z.string().max(1000).optional(),
})

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  customPlatform: z.string().optional(),
  label: z.string().min(1).max(50),
  url: urlSchema,
  description: z.string().max(200).optional(),
  iconUrl: urlSchema.optional(),
  iconColor: colorSchema.optional(),
  isMonochrome: z.boolean().optional(),
  visibility: z.enum(['VISIBLE', 'HIDDEN', 'FEATURED', 'ICON_ONLY']).optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  section: z.string().max(50).optional(),
})

export const pageSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  slug: slugSchema,
  layout: z.enum(['MAGAZINE', 'DECK', 'STACK', 'WALL', 'SPINE', 'COLLAGE', 'FLOW', 'GRID']).optional(),
  backgroundConfig: z.record(z.any()).optional(),
  isPublished: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
})

export const widgetSchema = z.object({
  type: z.enum([
    'ABOUT_ME', 'PERSONAL_INFO', 'LANGUAGES', 'LOCATION', 'SKILLS', 'PROJECTS', 'CUSTOM_TEXT',
    'MY_GAMES', 'GAMING_SETUP', 'HARDWARE', 'GAME_SETTINGS', 'CROSSHAIR_SETTINGS', 'GAMING_STATS', 'GAME_COLLECTIONS',
    'IMAGE_GALLERY', 'VIDEO_GALLERY', 'CLIPS', 'MUSIC_COLLECTION', 'EMBEDDED_MEDIA', 'MUSIC_PLAYER',
    'DISCORD', 'DISCORD_SERVER', 'ROBLOX', 'STEAM', 'YOUTUBE', 'TWITCH', 'GITHUB', 'SPOTIFY',
    'CALENDAR', 'COUNTDOWN', 'TIMEZONE', 'WEATHER', 'CLOCK', 'CUSTOM_LIST', 'CUSTOM_INFO_ROWS'
  ]),
  title: z.string().max(100).optional(),
  config: z.record(z.any()),
  style: z.record(z.any()).optional(),
  isVisible: z.boolean().optional(),
  isEnabled: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  width: z.number().int().min(1).max(12).optional(),
  height: z.number().int().min(1).max(12).optional(),
  x: z.number().int().min(0).optional(),
  y: z.number().int().min(0).optional(),
  pageId: z.string().cuid().optional(),
})

export const musicTrackSchema = z.object({
  title: z.string().min(1).max(100),
  artist: z.string().min(1).max(100),
  album: z.string().max(100).optional(),
  audioUrl: urlSchema,
  coverUrl: urlSchema.optional(),
  duration: z.number().int().min(0),
  lyrics: z.string().max(10000).optional(),
  syncedLyrics: z.array(z.object({
    time: z.number(),
    text: z.string(),
  })).optional(),
  order: z.number().int().min(0).optional(),
})

export const backgroundConfigSchema = z.object({
  type: z.enum([
    'IMAGE', 'VIDEO', 'SHADER', 'GRADIENT', 'SOLID', 'PARTICLES', 'AURORA', 'GALAXY', 'STARS',
    'LIQUID', 'SILK', 'CLOUDS', 'LIGHTNING', 'PLASMA', 'IRIDESCENCE', 'DITHER', 'CRT',
    'LIGHT_RAYS', 'SNOWFALL', 'RAIN', 'ANIMATED_GRADIENT', 'CUSTOM_SHADER'
  ]),
  imageUrl: urlSchema.optional(),
  videoUrl: urlSchema.optional(),
  colors: z.array(colorSchema).min(1).max(10).optional(),
  gradient: z.object({
    angle: z.number().min(0).max(360),
    stops: z.array(z.object({
      color: colorSchema,
      position: z.number().min(0).max(100),
    })).min(2).max(10),
  }).optional(),
  speed: z.number().min(0).max(10).optional(),
  particleCount: z.number().int().min(0).max(10000).optional(),
  opacity: z.number().min(0).max(1).optional(),
  blur: z.number().min(0).max(100).optional(),
  intensity: z.number().min(0).max(10).optional(),
  brightness: z.number().min(0).max(2).optional(),
  scale: z.number().min(0.1).max(5).optional(),
  position: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }).optional(),
  overlayColor: colorSchema.optional(),
  overlayOpacity: z.number().min(0).max(1).optional(),
  customShader: z.string().optional(),
  shaderUniforms: z.record(z.any()).optional(),
})

export const cardConfigSchema = z.object({
  layout: z.enum(['centered', 'left', 'right', 'split', 'minimal', 'card', 'floating']).optional(),
  width: z.number().min(200).max(1200).optional(),
  height: z.number().min(200).max(1200).optional(),
  position: z.enum(['center', 'top', 'bottom', 'left', 'right']).optional(),
  alignment: z.enum(['center', 'start', 'end']).optional(),
  opacity: z.number().min(0).max(1).optional(),
  transparency: z.number().min(0).max(1).optional(),
  backgroundBlur: z.number().min(0).max(50).optional(),
  shadow: z.object({
    enabled: z.boolean(),
    color: colorSchema.optional(),
    offsetX: z.number().optional(),
    offsetY: z.number().optional(),
    blur: z.number().optional(),
    spread: z.number().optional(),
  }).optional(),
  border: z.object({
    enabled: z.boolean(),
    radius: z.number().min(0).max(100).optional(),
    thickness: z.number().min(0).max(20).optional(),
    color: colorSchema.optional(),
    gradient: z.array(colorSchema).optional(),
    animated: z.boolean().optional(),
    glow: z.boolean().optional(),
  }).optional(),
  hoverEffect: z.enum(['none', 'scale', 'glow', 'tilt', 'float', 'rotate']).optional(),
  mouseFollow: z.boolean().optional(),
  tilt3d: z.boolean().optional(),
  entranceAnimation: z.enum(['none', 'fade', 'slide', 'zoom', 'flip', 'bounce']).optional(),
})

export const textConfigSchema = z.object({
  fontFamily: z.string().optional(),
  fontSize: z.number().min(8).max(200).optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  letterSpacing: z.number().min(-5).max(50).optional(),
  lineHeight: z.number().min(0.5).max(5).optional(),
  color: colorSchema.optional(),
  gradient: z.array(colorSchema).min(2).max(10).optional(),
  shadow: z.object({
    enabled: z.boolean(),
    color: colorSchema.optional(),
    offsetX: z.number().optional(),
    offsetY: z.number().optional(),
    blur: z.number().optional(),
  }).optional(),
  glow: z.object({
    enabled: z.boolean(),
    color: colorSchema.optional(),
    intensity: z.number().min(0).max(10).optional(),
  }).optional(),
  animation: z.enum([
    'none', 'typewriter', 'decrypt', 'glitch', 'wave', 'rainbow',
    'split', 'reveal', 'custom'
  ]).optional(),
  animationSpeed: z.number().min(0.1).max(5).optional(),
  usernameEffect: z.enum(['none', 'gradient', 'glitch', 'rainbow', 'pulse', 'shimmer']).optional(),
  bioAnimation: z.enum(['none', 'fade', 'typewriter', 'wave']).optional(),
})

export const cursorConfigSchema = z.object({
  imageUrl: urlSchema.optional(),
  animated: z.boolean().optional(),
  particles: z.boolean().optional(),
  trail: z.boolean().optional(),
  glow: z.boolean().optional(),
  color: colorSchema.optional(),
  size: z.number().min(16).max(128).optional(),
  hoverEffect: z.enum(['none', 'scale', 'rotate', 'pulse']).optional(),
})

export const overlayConfigSchema = z.object({
  type: z.enum(['none', 'snow', 'rain', 'petals', 'fireworks', 'particles', 'stars', 'floating', 'light_rays', 'ambient']).optional(),
  color: colorSchema.optional(),
  density: z.number().min(0).max(100).optional(),
  speed: z.number().min(0).max(10).optional(),
  intensity: z.number().min(0).max(10).optional(),
  customElements: z.array(z.object({
    imageUrl: urlSchema,
    size: z.number().min(10).max(200),
    count: z.number().int().min(1).max(100),
  })).optional(),
})

export const animationConfigSchema = z.object({
  profileEntrance: z.enum(['none', 'fade', 'slide_up', 'slide_down', 'slide_left', 'slide_right', 'zoom', 'flip', 'custom']).optional(),
  avatarEntrance: z.enum(['none', 'fade', 'zoom', 'rotate', 'bounce', 'elastic']).optional(),
  cardEntrance: z.enum(['none', 'fade', 'slide', 'zoom', 'stagger', 'custom']).optional(),
  linkEntrance: z.enum(['none', 'fade', 'slide', 'stagger', 'custom']).optional(),
  staggerDelay: z.number().min(0).max(2).optional(),
  hoverAnimations: z.boolean().optional(),
  floatingElements: z.boolean().optional(),
  animatedBorders: z.boolean().optional(),
  animatedGlow: z.boolean().optional(),
  interactive3d: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
})

export const enterScreenConfigSchema = z.object({
  enabled: z.boolean().optional(),
  title: z.string().max(100).optional(),
  subtitle: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  iconUrl: urlSchema.optional(),
  imageUrl: urlSchema.optional(),
  videoUrl: urlSchema.optional(),
  backgroundColor: colorSchema.optional(),
  gradient: z.array(colorSchema).min(2).max(10).optional(),
  blur: z.number().min(0).max(100).optional(),
  textColor: colorSchema.optional(),
  fontFamily: z.string().optional(),
  buttonText: z.string().max(50).optional(),
  buttonIcon: z.string().optional(),
  buttonStyle: z.object({
    backgroundColor: colorSchema.optional(),
    textColor: colorSchema.optional(),
    borderRadius: z.number().min(0).max(50).optional(),
    padding: z.object({
      x: z.number().min(0).max(100).optional(),
      y: z.number().min(0).max(50).optional(),
    }).optional(),
    hoverEffect: z.enum(['none', 'scale', 'glow', 'slide']).optional(),
  }).optional(),
  enterAnimation: z.enum(['fade', 'zoom', 'blur', 'slide', 'curtain', 'dissolve', 'glitch', 'ripple', 'pixel', 'custom']).optional(),
  exitAnimation: z.enum(['fade', 'zoom', 'blur', 'slide', 'curtain', 'dissolve', 'glitch', 'ripple', 'pixel', 'custom']).optional(),
  soundUrl: urlSchema.optional(),
  soundVolume: z.number().min(0).max(1).optional(),
  autoPlaySound: z.boolean().optional(),
})

export const seoConfigSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(200).optional(),
  ogImage: urlSchema.optional(),
  ogTitle: z.string().max(100).optional(),
  ogDescription: z.string().max(200).optional(),
  twitterCard: z.enum(['summary', 'summary_large_image']).optional(),
  customFavicon: urlSchema.optional(),
  allowIndexing: z.boolean().optional(),
  customBrowserTitle: z.string().max(100).optional(),
  animatedTitle: z.boolean().optional(),
  titleAnimation: z.enum(['none', 'typewriter', 'marquee', 'wave']).optional(),
})

export const templateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  previewImageUrl: urlSchema.optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).optional(),
  config: z.object({
    background: backgroundConfigSchema.optional(),
    card: cardConfigSchema.optional(),
    text: textConfigSchema.optional(),
    cursor: cursorConfigSchema.optional(),
    overlay: overlayConfigSchema.optional(),
    animation: animationConfigSchema.optional(),
    enterScreen: enterScreenConfigSchema.optional(),
    seo: seoConfigSchema.optional(),
  }),
  tags: z.array(z.string().min(1).max(30)).max(20).optional(),
  category: z.string().max(50).optional(),
})

export const badgeSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9_-]+$/),
  description: z.string().max(500),
  iconUrl: urlSchema,
  color: colorSchema.optional(),
  glowColor: colorSchema.optional(),
  rarity: z.enum(['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC']).optional(),
  category: z.enum(['VERIFIED', 'PREMIUM', 'STAFF', 'DEVELOPER', 'FOUNDER', 'EARLY_SUPPORTER', 'DONATOR', 'COMMUNITY', 'HELPER', 'EVENT', 'MILESTONE', 'SPECIAL', 'CUSTOM']).optional(),
  isAnimated: z.boolean().optional(),
  animationConfig: z.record(z.any()).optional(),
  requirement: z.string().max(1000).optional(),
  isAutoAward: z.boolean().optional(),
  isHidden: z.boolean().optional(),
  maxOwners: z.number().int().min(1).optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export const integrationSchema = z.object({
  platform: z.enum(['DISCORD', 'ROBLOX', 'STEAM', 'GITHUB', 'SPOTIFY', 'YOUTUBE', 'TWITCH', 'TIKTOK', 'VRCHAT', 'APPLE_MUSIC']),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  scope: z.string().optional(),
})

export const apiKeySchema = z.object({
  name: z.string().min(1).max(50),
  permissions: z.array(z.enum([
    'profile:read', 'profile:write',
    'links:read', 'links:write',
    'pages:read', 'pages:write',
    'widgets:read', 'widgets:write',
    'media:read', 'media:write',
    'music:read', 'music:write',
    'badges:read', 'badges:write',
    'templates:read', 'templates:write',
    'analytics:read',
    'integrations:read', 'integrations:write',
    'account:read', 'account:write',
  ])).min(1),
  expiresAt: z.string().datetime().optional(),
})

export const reportSchema = z.object({
  targetId: z.string().cuid(),
  targetType: z.enum(['USER', 'PROFILE', 'TEMPLATE', 'ASSET']),
  type: z.enum(['SPAM', 'HARASSMENT', 'IMPERSONATION', 'INAPPROPRIATE_CONTENT', 'COPYRIGHT', 'OTHER']),
  reason: z.string().min(10).max(2000),
  evidence: z.record(z.any()).optional(),
})

export const supportTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(5000),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
})