import { z } from 'zod'

/**
 * Lorn Discord Bot Configuration
 *
 * This module provides type-safe access to all bot configuration
 * validated against environment variables at startup.
 */

// Base environment schema with all bot-related variables
const envSchema = z.object({
  // Discord Bot Core
  DISCORD_BOT_TOKEN: z.string().min(1, 'DISCORD_BOT_TOKEN is required'),
  DISCORD_CLIENT_ID: z.string().min(1, 'DISCORD_CLIENT_ID is required'),
  DISCORD_CLIENT_SECRET: z.string().min(1, 'DISCORD_CLIENT_SECRET is required'),

  // Discord Bot Optional
  DISCORD_PUBLIC_KEY: z.string().optional(), // For interactions endpoint verification
  DISCORD_GUILD_ID: z.string().optional(), // Development guild for faster command registration

  // Bot Behavior
  BOT_PREFIX: z.string().default('!'),
  BOT_OWNER_IDS: z.string().optional().transform((val) =>
    val ? val.split(',').map(id => id.trim()).filter(Boolean) : []
  ),
  BOT_STATUS: z.string().default('with the void'),
  BOT_STATUS_TYPE: z.enum(['playing', 'streaming', 'listening', 'watching', 'competing']).default('playing'),

  // Intents & Permissions
  BOT_INTENTS: z.string().default('guilds,guildMessages,messageContent,guildMembers,guildModeration,guildVoiceStates,guildPresences'),
  BOT_DEFAULT_PERMISSIONS: z.string().default('8'), // Administrator permissions as default

  // Rate Limiting
  BOT_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(1000),
  BOT_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(5),

  // Features
  BOT_ENABLE_SLASH_COMMANDS: z.coerce.boolean().default(true),
  BOT_ENABLE_PREFIX_COMMANDS: z.coerce.boolean().default(false),
  BOT_ENABLE_CONTEXT_MENUS: z.coerce.boolean().default(true),
  BOT_AUTO_REGISTER_COMMANDS: z.coerce.boolean().default(true),

  // Logging
  BOT_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  BOT_LOG_PRETTY: z.coerce.boolean().default(true),

  // Database (for bot-specific data)
  BOT_DATABASE_URL: z.string().optional(),

  // Redis (for caching, sessions)
  BOT_REDIS_URL: z.string().optional(),

  // Webhook (for logging, alerts)
  BOT_WEBHOOK_URL: z.string().url().optional(),
  BOT_WEBHOOK_ERROR_URL: z.string().url().optional(),

  // Development
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  BOT_DEBUG_GUILDS: z.string().optional().transform((val) =>
    val ? val.split(',').map(id => id.trim()).filter(Boolean) : []
  ),

  // Sharding (for large bots)
  BOT_SHARD_COUNT: z.coerce.number().optional(),
  BOT_SHARD_IDS: z.string().optional().transform((val) =>
    val ? val.split(',').map(id => parseInt(id.trim(), 10)).filter(n => !isNaN(n)) : []
  ),

  // Presence
  BOT_PRESENCE_UPDATE_INTERVAL_MS: z.coerce.number().default(30000),
})

// Validate and parse environment
const envResult = envSchema.safeParse(process.env)

if (!envResult.success) {
  const errors = envResult.error.flatten().fieldErrors
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n')

  throw new Error(
    `❌ Invalid Discord Bot Configuration:\n${errorMessages}\n\n` +
    'Please check your environment variables.'
  )
}

const env = envResult.data

// ============================================
// Type Definitions
// ============================================

export type BotStatusType = 'playing' | 'streaming' | 'listening' | 'watching' | 'competing'
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface DiscordIntents {
  guilds: boolean
  guildMembers: boolean
  guildModeration: boolean
  guildEmojisAndStickers: boolean
  guildIntegrations: boolean
  guildWebhooks: boolean
  guildInvites: boolean
  guildVoiceStates: boolean
  guildPresences: boolean
  guildMessages: boolean
  guildMessageReactions: boolean
  guildMessageTyping: boolean
  directMessages: boolean
  directMessageReactions: boolean
  directMessageTyping: boolean
  messageContent: boolean
  guildScheduledEvents: boolean
  autoModerationConfiguration: boolean
  autoModerationExecution: boolean
}

export interface BotConfig {
  // Core
  token: string
  clientId: string
  clientSecret: string
  publicKey?: string

  // Guild
  guildId?: string
  debugGuilds: string[]

  // Behavior
  prefix: string
  ownerIds: string[]
  status: string
  statusType: BotStatusType

  // Intents
  intents: DiscordIntents
  defaultPermissions: bigint

  // Rate Limiting
  rateLimit: {
    windowMs: number
    maxRequests: number
  }

  // Features
  features: {
    slashCommands: boolean
    prefixCommands: boolean
    contextMenus: boolean
    autoRegisterCommands: boolean
  }

  // Logging
  logging: {
    level: LogLevel
    pretty: boolean
  }

  // Optional Services
  databaseUrl?: string
  redisUrl?: string
  webhookUrl?: string
  webhookErrorUrl?: string

  // Sharding
  sharding?: {
    count: number
    ids: number[]
  }

  // Presence
  presenceUpdateIntervalMs: number

  // Environment
  isDevelopment: boolean
  isProduction: boolean
  isTest: boolean
}

// ============================================
// Helper Functions
// ============================================

/**
 * Parse intent string into DiscordIntents object
 * Format: "guilds,guildMessages,messageContent"
 */
function parseIntents(intentString: string): DiscordIntents {
  const intents: Partial<DiscordIntents> = {}
  const intentList = intentString.split(',').map(i => i.trim().toLowerCase())

  const allIntents: (keyof DiscordIntents)[] = [
    'guilds',
    'guildMembers',
    'guildModeration',
    'guildEmojisAndStickers',
    'guildIntegrations',
    'guildWebhooks',
    'guildInvites',
    'guildVoiceStates',
    'guildPresences',
    'guildMessages',
    'guildMessageReactions',
    'guildMessageTyping',
    'directMessages',
    'directMessageReactions',
    'directMessageTyping',
    'messageContent',
    'guildScheduledEvents',
    'autoModerationConfiguration',
    'autoModerationExecution',
  ]

  for (const intent of allIntents) {
    intents[intent] = intentList.includes(intent.toLowerCase())
  }

  // Ensure required intents are enabled
  intents.guilds = true
  intents.guildMessages = true

  return intents as DiscordIntents
}

/**
 * Get default permissions as bigint
 */
function getDefaultPermissions(permString: string): bigint {
  const parsed = BigInt(permString)
  return parsed
}

/**
 * Build the complete bot configuration
 */
function buildConfig(): BotConfig {
  const intents = parseIntents(env.BOT_INTENTS)

  return {
    // Core
    token: env.DISCORD_BOT_TOKEN,
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
    publicKey: env.DISCORD_PUBLIC_KEY,

    // Guild
    guildId: env.DISCORD_GUILD_ID,
    debugGuilds: env.BOT_DEBUG_GUILDS,

    // Behavior
    prefix: env.BOT_PREFIX,
    ownerIds: env.BOT_OWNER_IDS,
    status: env.BOT_STATUS,
    statusType: env.BOT_STATUS_TYPE,

    // Intents
    intents,
    defaultPermissions: getDefaultPermissions(env.BOT_DEFAULT_PERMISSIONS),

    // Rate Limiting
    rateLimit: {
      windowMs: env.BOT_RATE_LIMIT_WINDOW_MS,
      maxRequests: env.BOT_RATE_LIMIT_MAX_REQUESTS,
    },

    // Features
    features: {
      slashCommands: env.BOT_ENABLE_SLASH_COMMANDS,
      prefixCommands: env.BOT_ENABLE_PREFIX_COMMANDS,
      contextMenus: env.BOT_ENABLE_CONTEXT_MENUS,
      autoRegisterCommands: env.BOT_AUTO_REGISTER_COMMANDS,
    },

    // Logging
    logging: {
      level: env.BOT_LOG_LEVEL,
      pretty: env.BOT_LOG_PRETTY,
    },

    // Optional Services
    databaseUrl: env.BOT_DATABASE_URL,
    redisUrl: env.BOT_REDIS_URL,
    webhookUrl: env.BOT_WEBHOOK_URL,
    webhookErrorUrl: env.BOT_WEBHOOK_ERROR_URL,

    // Sharding
    sharding: env.BOT_SHARD_COUNT ? {
      count: env.BOT_SHARD_COUNT,
      ids: env.BOT_SHARD_IDS.length > 0 ? env.BOT_SHARD_IDS : Array.from({ length: env.BOT_SHARD_COUNT }, (_, i) => i),
    } : undefined,

    // Presence
    presenceUpdateIntervalMs: env.BOT_PRESENCE_UPDATE_INTERVAL_MS,

    // Environment
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  }
}

// ============================================
// Export Configuration
// ============================================

/**
 * Main bot configuration object
 * Validated at import time, guaranteed to be valid
 */
export const botConfig = buildConfig()

/**
 * Configuration validation result (for health checks)
 */
export const configValidation = {
  valid: true,
  timestamp: new Date().toISOString(),
  environment: env.NODE_ENV,
  features: botConfig.features,
  intentsEnabled: Object.entries(botConfig.intents)
    .filter(([, v]) => v)
    .map(([k]) => k),
}

/**
 * Get a sanitized config for logging (no secrets)
 */
export function getSanitizedConfig(): Omit<BotConfig, 'token' | 'clientSecret' | 'webhookUrl' | 'webhookErrorUrl'> {
  const { token, clientSecret, webhookUrl, webhookErrorUrl, ...sanitized } = botConfig
  return sanitized
}

/**
 * Validate config at runtime (useful for health checks)
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!botConfig.token) errors.push('Missing bot token')
  if (!botConfig.clientId) errors.push('Missing client ID')
  if (!botConfig.clientSecret) errors.push('Missing client secret')
  if (botConfig.ownerIds.length === 0 && botConfig.isProduction) {
    errors.push('No owner IDs configured in production')
  }
  if (botConfig.rateLimit.windowMs < 100) {
    errors.push('Rate limit window too small (< 100ms)')
  }
  if (botConfig.rateLimit.maxRequests < 1) {
    errors.push('Rate limit max requests must be at least 1')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export default botConfig