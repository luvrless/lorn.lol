'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldAlert, UserCheck, Crown } from 'lucide-react'

export default function AdminStaffPage() {
  const [staffUsers, setStaffUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/users?role=ADMIN')
      .then((res) => res.json())
      .then((data) => {
        setStaffUsers(data.users || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Staff Team</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Authorized personnel with administrative or moderation rights on lorn.lol.
        </p>
      </div>

      <Card className="glass-dark border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Staff Hierarchy & Access</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Owner (Discord ID: 409564774444171265) holds master administrative privileges.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 text-destructive flex items-center justify-center font-bold">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Project Owner</p>
                <p className="text-[11px] text-muted-foreground font-mono">Discord: 409564774444171265</p>
              </div>
            </div>
            <Badge className="bg-destructive text-destructive-foreground text-[10px]">OWNER</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
