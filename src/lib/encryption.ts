import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-char-encryption-key-here!!'
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 32
const TAG_LENGTH = 16
const KEY_LENGTH = 32

async function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
}

export async function encrypt(text: string): Promise<string> {
  try {
    const salt = randomBytes(SALT_LENGTH)
    const iv = randomBytes(IV_LENGTH)
    const key = await deriveKey(ENCRYPTION_KEY, salt)

    const cipher = createCipheriv(ALGORITHM, key, iv)
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ])
    const authTag = cipher.getAuthTag()

    return Buffer.concat([salt, iv, authTag, encrypted]).toString('base64')
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

export async function decrypt(encryptedData: string): Promise<string> {
  try {
    const buffer = Buffer.from(encryptedData, 'base64')

    const salt = buffer.subarray(0, SALT_LENGTH)
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
    const authTag = buffer.subarray(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH
    )
    const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)

    const key = await deriveKey(ENCRYPTION_KEY, salt)

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ])

    return decrypted.toString('utf8')
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

export async function hashApiKey(key: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = (await scryptAsync(key, salt, 32)) as Buffer
  return Buffer.concat([salt, hash]).toString('base64')
}

export async function verifyApiKey(key: string, hashedKey: string): Promise<boolean> {
  try {
    const buffer = Buffer.from(hashedKey, 'base64')
    const salt = buffer.subarray(0, 16)
    const hash = buffer.subarray(16)
    const newHash = (await scryptAsync(key, salt, 32)) as Buffer
    return hash.equals(newHash)
  } catch {
    return false
  }
}

export function generateApiKey(): string {
  const prefix = 'lrn_'
  const randomPart = randomBytes(32).toString('base64url')
  return prefix + randomPart
}

export function getApiKeyPrefix(key: string): string {
  return key.slice(0, 8)
}