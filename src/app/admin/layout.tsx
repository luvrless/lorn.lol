import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import AdminLayoutClient from './AdminLayoutClient'

export const metadata = {
  title: 'Admin Panel - lorn.lol',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const allowedRoles = ['STAFF', 'ADMIN', 'OWNER', 'MODERATOR']
  const userRole = (session?.user as any)?.role

  // Return genuine 404 to non-staff users
  if (!session?.user?.id || !allowedRoles.includes(userRole)) {
    notFound()
  }

  return (
    <AdminLayoutClient user={session.user}>
      {children}
    </AdminLayoutClient>
  )
}
