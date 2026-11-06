import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyApiKey, getApiKeyPrefix } from '@/lib/encryption'

export type BotAuthResult =
  | { success: true; user: any; permissions: string[] }
  | { success: false; error: string; status: number }

export async function authenticateBot(
  request: NextRequest,
  requiredPermission: string
): Promise<BotAuthResult> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, error: 'Missing or invalid Authorization header', status: 401 }
  }

  const apiKey = authHeader.slice(7)
  const prefix = getApiKeyPrefix(apiKey)

  const keyRecord = await prisma.apiKey.findFirst({
    where: { keyPrefix: prefix, isActive: true },
    include: { user: true },
  })

  if (!keyRecord) {
    return { success: false, error: 'Invalid API key', status: 401 }
  }

  const isValid = await verifyApiKey(apiKey, keyRecord.keyHash)
  if (!isValid) {
    return { success: false, error: 'Invalid API key', status: 401 }
  }

  if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
    return { success: false, error: 'API key expired', status: 401 }
  }

  const hasPermission = keyRecord.permissions.includes(requiredPermission)
  if (!hasPermission) {
    return { success: false, error: 'Insufficient permissions', status: 403 }
  }

  await prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: { lastUsedAt: new Date() },
  })

  return { success: true, user: keyRecord.user, permissions: keyRecord.permissions }
}
