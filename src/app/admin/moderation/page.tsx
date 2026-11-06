'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Flag, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function AdminModerationPage() {
  const [reports, setReports] = useState<any[]>([])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Moderation Queue</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review community reports regarding bio abuse, spam profiles, copyright, and impersonation.
        </p>
      </div>

      <Card className="glass-dark border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-lg">Open Reports ({reports.length})</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm">All Clean!</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                There are currently no outstanding user reports pending review.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-background/50 border border-border/60 flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="text-[10px] mb-1">{r.type}</Badge>
                    <p className="text-xs font-semibold">{r.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Dismiss</Button>
                    <Button size="sm" variant="destructive" className="text-xs">Take Action</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
