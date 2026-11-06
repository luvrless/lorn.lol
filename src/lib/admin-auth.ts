import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const STAFF_ROLES = ['STAFF', 'ADMIN', 'OWNER', 'MODERATOR']

export async function verifyAdminSession() {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      user: null,
    }
  }

  const role = (session.user as any).role || 'USER'
  if (!STAFF_ROLES.includes(role)) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      user: null,
    }
  }

  return {
    authorized: true,
    response: null,
    user: session.user,
  }
}
