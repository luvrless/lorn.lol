import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function AdminIndexPage() {
  const session = await auth()
  const allowedRoles = ['STAFF', 'ADMIN', 'OWNER', 'MODERATOR']
  const userRole = (session?.user as any)?.role

  if (!session?.user?.id || !allowedRoles.includes(userRole)) {
    notFound()
  }

  redirect('/admin/dashboard')
}
