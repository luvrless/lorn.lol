'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: 'glass-dark border-border/50',
              description: 'text-muted-foreground',
              actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
              cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/90',
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  )
}