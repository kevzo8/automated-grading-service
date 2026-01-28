"use client"

import React, { useMemo, useState, useCallback } from "react"

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
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

// Define navigation items outside component to prevent recreation
const NAVIGATION_ITEMS: { id: Section; label: string; iconName: string }[] = [
  { id: "overview", label: "Overview", iconName: "dashboard" },
  { id: "api-design", label: "API Design", iconName: "json" },
  { id: "architecture", label: "Architecture", iconName: "network" },
  { id: "ml-methodology", label: "ML Methodology", iconName: "brain" },
  { id: "tech-stack", label: "Tech Stack", iconName: "layers" },
  { id: "cost-analysis", label: "Cost Analysis", iconName: "dollar" },
  { id: "deployment", label: "Deployment", iconName: "rocket" },
  { id: "timeline", label: "6-Month Timeline", iconName: "calendar" },
  { id: "playground", label: "API Playground", iconName: "play" },
  { id: "qa-section", label: "Q&A", iconName: "help" },
  { id: "thank-you", label: "Thank You", iconName: "heart" },
]

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="w-4 h-4" />,
  json: <FileJson className="w-4 h-4" />,
  network: <Network className="w-4 h-4" />,
  brain: <Brain className="w-4 h-4" />,
  layers: <Layers className="w-4 h-4" />,
  dollar: <DollarSign className="w-4 h-4" />,
  rocket: <Rocket className="w-4 h-4" />,
  calendar: <Calendar className="w-4 h-4" />,
  play: <PlayCircle className="w-4 h-4" />,
  help: <HelpCircle className="w-4 h-4" />,
  heart: <Heart className="w-4 h-4" />,
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Memoize navigation items with icons
  const navigationItems = useMemo(() => 
    NAVIGATION_ITEMS.map(item => ({
      ...item,
      icon: iconMap[item.iconName]
    })),
    []
  )

  // Memoize callbacks
  const handleSectionChange = useCallback((section: Section) => {
    onSectionChange(section)
    setMobileOpen(false)
  }, [onSectionChange])

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev)
  }, [])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleMobile}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeMobile}
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
                onClick={() => handleSectionChange(item.id)}
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
