'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Check, ExternalLink, QrCode, Share2 } from 'lucide-react'

export default function ShareDashboardPage() {
  const [username, setUsername] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.username) {
          setUsername(data.user.username)
        }
      })
      .catch(console.error)
  }, [])

  const fullUrl = `https://lorn.lol/${username || 'username'}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Share Your Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Promote your digital identity across Discord, Twitter, Instagram bio, and anywhere else.
        </p>
      </div>

      <Card className="glass-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Public Link</CardTitle>
          <CardDescription className="text-xs">Your personal bio link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={fullUrl}
              readOnly
              className="bg-background/50 font-mono text-sm"
            />
            <Button onClick={copyToClipboard} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="outline" asChild>
              <a href={fullUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">QR Code</CardTitle>
          <CardDescription className="text-xs">Scan from mobile devices to view your profile directly</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-xl">
            {/* Standard SVG QR Code placeholder */}
            <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-xl text-gray-800">
              <QrCode className="w-28 h-28" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{fullUrl}</p>
        </CardContent>
      </Card>
    </div>
  )
}
