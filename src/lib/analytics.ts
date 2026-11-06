export async function trackProfileView(username: string) {
  try {
    await fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
  } catch (error) {
    console.error('Failed to track profile view:', error)
  }
}

export async function trackLinkClick(linkId: string, url: string) {
  try {
    await fetch(`/api/links/${linkId}/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
  } catch (error) {
    console.error('Failed to track link click:', error)
  }
}

export async function trackMusicPlay(trackId: string) {
  try {
    await fetch('/api/analytics/music-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId }),
    })
  } catch (error) {
    console.error('Failed to track music play:', error)
  }
}

export async function trackTemplateApply(templateId: string) {
  try {
    await fetch('/api/analytics/template-apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId }),
    })
  } catch (error) {
    console.error('Failed to track template apply:', error)
  }
}