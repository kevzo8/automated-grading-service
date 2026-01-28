"use client"

import React from "react"

import { cn } from "@/lib/utils"
import type { Section } from "@/app/page"
import { 
  LayoutDashboard, 
  FileJson, 
  Network, 
  Brain, 
  Rocket, 
  PlayCircle,
  Calendar,
  Menu,
  X,
  Layers,
  DollarSign,
  HelpCircle,
  Heart
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

const navigationItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "api-design", label: "API Design", icon: <FileJson className="w-4 h-4" /> },
  { id: "architecture", label: "Architecture", icon: <Network className="w-4 h-4" /> },
  { id: "ml-methodology", label: "ML Methodology", icon: <Brain className="w-4 h-4" /> },
  { id: "tech-stack", label: "Tech Stack", icon: <Layers className="w-4 h-4" /> },
  { id: "cost-analysis", label: "Cost Analysis", icon: <DollarSign className="w-4 h-4" /> },
  { id: "deployment", label: "Deployment", icon: <Rocket className="w-4 h-4" /> },
  { id: "timeline", label: "6-Month Timeline", icon: <Calendar className="w-4 h-4" /> },
  { id: "playground", label: "API Playground", icon: <PlayCircle className="w-4 h-4" /> },
  { id: "qa-section", label: "Q&A", icon: <HelpCircle className="w-4 h-4" /> },
  { id: "thank-you", label: "Thank You", icon: <Heart className="w-4 h-4" /> },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">AG</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm">AutoGrade</h1>
              <p className="text-xs text-sidebar-foreground/60">MVP Documentation</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id)
                  setMobileOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  activeSection === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/50">
            <p className="font-medium text-sidebar-foreground/70">by Kevin Vega</p>
            <p className="mt-1">Interview Presentation</p>
            <p>Cambridge University Press & Assessment</p>
          </div>
        </div>
      </aside>
    </>
  )
}
