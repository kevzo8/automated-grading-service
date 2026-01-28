"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, Sparkles, GraduationCap, Code2, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThankYou() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Decorative Header */}
      <div className="text-center space-y-6 py-8">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
              <GraduationCap className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Badge variant="secondary" className="mb-2">Thank You</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Thanks for Your Consideration
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            I&apos;m excited about the opportunity to contribute to Cambridge University Press & Assessment&apos;s 
            mission of advancing education through technology.
          </p>
        </div>
      </div>

      {/* Why I'm Excited */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Why This Role Excites Me
            </h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Meaningful Impact</p>
                  <p className="text-xs text-muted-foreground">
                    Building technology that directly improves educational outcomes for millions of learners worldwide.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Technical Challenge</p>
                  <p className="text-xs text-muted-foreground">
                    Solving complex NLP problems at scale while balancing ML innovation with production reliability.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Full-Stack Ownership</p>
                  <p className="text-xs text-muted-foreground">
                    The opportunity to own the complete lifecycle from ML research to production deployment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What I Bring */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              What I Bring to the Team
            </h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="p-3 rounded-lg border bg-card">
                <p className="font-medium text-sm mb-1">Production ML Experience</p>
                <p className="text-xs text-muted-foreground">
                  End-to-end ML system design and deployment at scale
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <p className="font-medium text-sm mb-1">NLP Expertise</p>
                <p className="text-xs text-muted-foreground">
                  Deep understanding of transformer architectures and fine-tuning
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <p className="font-medium text-sm mb-1">Full-Stack Skills</p>
                <p className="text-xs text-muted-foreground">
                  Python, FastAPI, React, PostgreSQL, AWS infrastructure
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <p className="font-medium text-sm mb-1">Collaborative Mindset</p>
                <p className="text-xs text-muted-foreground">
                  Strong communication and ability to work across teams
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Let&apos;s Connect</h3>
            <p className="text-sm text-muted-foreground">
              I&apos;m looking forward to discussing this opportunity further and learning more about 
              the exciting projects at Cambridge Assessment.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                <a href="mailto:kevinguadalupevega@gmail.com">
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                <a href="https://www.linkedin.com/in/kgvega/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Closing Quote */}
      <div className="text-center py-8 space-y-4">
        <blockquote className="text-lg italic text-muted-foreground max-w-lg mx-auto leading-relaxed">
          &quot;The best way to predict the future is to create it.&quot;
        </blockquote>
        <p className="text-sm text-muted-foreground">— Peter Drucker</p>
        
        <div className="pt-6 border-t mt-8">
          <p className="text-sm font-medium">Kevin Vega</p>
          <p className="text-xs text-muted-foreground">Full-Stack ML Engineer</p>
        </div>
      </div>

      {/* Decorative Footer */}
      <div className="flex justify-center gap-1 pb-8">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="w-2 h-2 rounded-full bg-primary/20"
            style={{ 
              opacity: 1 - (Math.abs(i - 2) * 0.25),
              transform: `scale(${1 - (Math.abs(i - 2) * 0.15)})`
            }}
          />
        ))}
      </div>
    </div>
  )
}
