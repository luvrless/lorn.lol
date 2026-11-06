'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Award,
} from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      if (selectedRole) params.set('role', selectedRole)

      const res = await fetch(`/api/admin/users?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [selectedRole])

  const toggleBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      setActionLoading(userId)
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          isBanned: !currentBanStatus,
          banReason: !currentBanStatus ? 'Suspended by staff administrator' : null,
        }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isBanned: !currentBanStatus } : u))
        )
      }
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(null)
    }
  }

  const changeRole = async (userId: string, newRole: string) => {
    try {
      setActionLoading(userId)
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        )
      }
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Search, inspect, update roles, and manage bans across all platform accounts.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
          <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by username, display name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            className="pl-9 bg-background/50 text-sm"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="h-10 px-3 py-2 rounded-xl border border-input bg-background/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="PREMIUM">Premium</option>
          <option value="MODERATOR">Moderator</option>
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Owner</option>
        </select>
        <Button onClick={fetchUsers}>Search</Button>
      </div>

      {/* User Table Card */}
      <Card className="glass-dark border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/40 border-b border-border/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Badges</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <span>{user.displayName || user.username}</span>
                          <span className="text-xs text-muted-foreground font-mono">(@{user.username})</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{user.email || 'OAuth Login'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      disabled={actionLoading === user.id}
                      className="text-xs bg-muted/50 border border-border/60 rounded-lg px-2 py-1 font-mono focus:outline-none"
                    >
                      <option value="USER">USER</option>
                      <option value="PREMIUM">PREMIUM</option>
                      <option value="MODERATOR">MODERATOR</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="OWNER">OWNER</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    {user.isBanned ? (
                      <Badge variant="destructive" className="text-[10px]">BANNED</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/30 bg-green-500/10">ACTIVE</Badge>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs">{user._count?.badges || 0} badges</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant={user.isBanned ? 'outline' : 'destructive'}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => toggleBan(user.id, user.isBanned)}
                        disabled={actionLoading === user.id}
                      >
                        {user.isBanned ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-500" />
                            Unban
                          </>
                        ) : (
                          <>
                            <Ban className="w-3.5 h-3.5 mr-1" />
                            Ban
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
                        <a href={`/${user.username}`} target="_blank" rel="noreferrer">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!users.length && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    No users matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
import { cn } from '@/lib/utils'
