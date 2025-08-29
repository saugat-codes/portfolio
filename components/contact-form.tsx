"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get('name') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string
    
    const emailBody = `Name: ${name}\n\nMessage:\n${message}`
    
    // Gmail compose link
    const gmailLink = `https://mail.google.com/mail/?view=cm&to=saugatbhattarai00@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
    
    // Fallback mailto link for default email client
    const mailtoLink = `mailto:saugatbhattarai00@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
    
    // Try Gmail first, fallback to mailto if Gmail fails
    try {
      const gmailWindow = window.open(gmailLink, '_blank')
      
      // Check if popup was blocked or failed to open
      if (!gmailWindow || gmailWindow.closed || typeof gmailWindow.closed === 'undefined') {
        // Fallback to mailto
        window.location.href = mailtoLink
      }
    } catch {
      // Fallback to mailto if any error occurs
      window.location.href = mailtoLink
    }
  }

  return (
    <Card className="border-glow bg-card">
      <CardContent className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              name="name"
              placeholder="Your Name"
              required
              className="bg-input border-border focus:border-accent focus:ring-accent"
            />
          </div>
          <div>
            <Input
              name="subject"
              placeholder="Subject"
              required
              className="bg-input border-border focus:border-accent focus:ring-accent"
            />
          </div>
          <div>
            <Textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              required
              className="bg-input border-border focus:border-accent focus:ring-accent resize-none"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 glow-green-hover font-semibold"
          >
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
