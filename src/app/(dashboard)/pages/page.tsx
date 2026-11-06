'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Layout, Plus, Trash2, Globe } from 'lucide-react'

export default function PagesDashboardPage() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pages')
      .then((res) => res.json())
      .then((data) => setPages(data.pages || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Multi-Page System</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create secondary tabs and deck layouts (e.g. /about, /portfolio, /gear).
        </p>
      </div>

      <Card className="glass-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Configured Pages ({pages.length})</CardTitle>
          <CardDescription className="text-xs">Main profile page is always enabled.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3.5 rounded-xl bg-background/50 border border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                /
              </div>
              <div>
                <span className="font-semibold text-sm">Main Landing Profile</span>
                <p className="text-[11px] text-muted-foreground">Default card view</p>
              </div>
            </div>
            <span className="text-xs font-mono text-primary font-semibold">PRIMARY</span>
          </div>

          {pages.map((p) => (
            <div key={p.id} className="p-3.5 rounded-xl bg-background/50 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-mono text-xs">
                  /{p.slug}
                </div>
                <div>
                  <span className="font-semibold text-sm">{p.title}</span>
                  <p className="text-[11px] text-muted-foreground">Layout: {p.layout || 'MAGAZINE'}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
