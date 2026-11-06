'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { HelpCircle, MessageSquare, Send, CheckCircle2, ExternalLink } from 'lucide-react'

export default function SupportDashboardPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setSubject('')
    setMessage('')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Support & Assistance</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Have an inquiry, found a bug, or need account help? Contact the lorn.lol team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="glass-dark border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Submit a Support Ticket</CardTitle>
              <CardDescription className="text-xs">
                Our staff will respond directly via email or your connected Discord.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                  <h4 className="font-semibold text-sm">Ticket Submitted!</h4>
                  <p className="text-xs text-muted-foreground">
                    Your request has been forwarded to our moderation and support desk.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setSubmitted(false)} className="mt-2 text-xs">
                    Submit Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Topic / Subject</Label>
                    <Input
                      placeholder="e.g. Question about custom domains or badge unlock"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Detailed Description</Label>
                    <Textarea
                      placeholder="Please explain the issue or question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Support Request
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Discord community link */}
        <div className="space-y-4">
          <Card className="glass-dark border-primary/30 bg-primary/5">
            <CardContent className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-sm">Join Official Discord</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect with staff, report bugs in real-time, get the Helper badge, and join community events.
              </p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
                <a href="https://discord.gg" target="_blank" rel="noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Join Discord Community
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
