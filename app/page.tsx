"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SUBSECTIONS, getSubsectionId } from "@/lib/subsections"

// Dynamic imports for code splitting - components load only when needed
const Overview = dynamic(() => import("@/components/sections/overview").then(mod => ({ default: mod.Overview })), { ssr: true })
const APIDesign = dynamic(() => import("@/components/sections/api-design").then(mod => ({ default: mod.APIDesign })), { ssr: true })
const Architecture = dynamic(() => import("@/components/sections/architecture").then(mod => ({ default: mod.Architecture })), { ssr: true })
const MLMethodology = dynamic(() => import("@/components/sections/ml-methodology").then(mod => ({ default: mod.MLMethodology })), { ssr: true })
const Deployment = dynamic(() => import("@/components/sections/deployment").then(mod => ({ default: mod.Deployment })), { ssr: true })
const Playground = dynamic(() => import("@/components/sections/playground").then(mod => ({ default: mod.Playground })), { ssr: true })
const Timeline = dynamic(() => import("@/components/sections/timeline").then(mod => ({ default: mod.Timeline })), { ssr: true })
const TechStack = dynamic(() => import("@/components/sections/tech-stack").then(mod => ({ default: mod.TechStack })), { ssr: true })
const CostAnalysis = dynamic(() => import("@/components/sections/cost-analysis").then(mod => ({ default: mod.CostAnalysis })), { ssr: true })
const QASection = dynamic(() => import("@/components/sections/qa-section").then(mod => ({ default: mod.QASection })), { ssr: true })
const ThankYou = dynamic(() => import("@/components/sections/thank-you").then(mod => ({ default: mod.ThankYou })), { ssr: true })

export type Section = 
  | "overview" 
  | "api-design" 
  | "architecture" 
  | "ml-methodology" 
  | "deployment" 
  | "playground"
  | "timeline"
  | "tech-stack"
  | "cost-analysis"
  | "qa-section"
  | "thank-you"

const SECTIONS: Section[] = [
  "overview",
  "architecture",
  "api-design",
  "tech-stack",
  "ml-methodology",
  "cost-analysis",
  "deployment",
  "timeline",
  "playground",
  "qa-section",
  "thank-you"
]

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentSubsection, setCurrentSubsection] = useState(0)
  const activeSection = SECTIONS[currentIndex]
  const contentRef = useRef<HTMLDivElement>(null)

  const subsectionCount = SUBSECTIONS[activeSection]?.length ?? 1

  const goNextSubsection = () => {
    if (currentSubsection < subsectionCount - 1) {
      setCurrentSubsection(currentSubsection + 1)
    } else if (currentIndex < SECTIONS.length - 1) {
      // Move to next section
      setCurrentIndex(currentIndex + 1)
      setCurrentSubsection(0)
    }
  }

  const goPreviousSubsection = () => {
    if (currentSubsection > 0) {
      setCurrentSubsection(currentSubsection - 1)
    } else if (currentIndex > 0) {
      // Move to previous section
      setCurrentIndex(currentIndex - 1)
      const prevSection = SECTIONS[currentIndex - 1]
      setCurrentSubsection((SUBSECTIONS[prevSection]?.length ?? 1) - 1)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        goNextSubsection()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPreviousSubsection()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, currentSubsection, activeSection, subsectionCount])

  // Auto-scroll to current subsection when it changes
  useEffect(() => {
    setTimeout(() => {
      const subsectionId = getSubsectionId(activeSection, currentSubsection)
      const element = document.getElementById(subsectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }, [activeSection, currentSubsection])

  // Memoize section rendering to prevent unnecessary re-renders
  const renderSection = useMemo(() => {
    const subsectionId = getSubsectionId(activeSection, currentSubsection)
    switch (activeSection) {
      case "overview":
        return <Overview />
      case "api-design":
        return <APIDesign currentSubsection={subsectionId} />
      case "architecture":
        return <Architecture />
      case "ml-methodology":
        return <MLMethodology currentSubsection={subsectionId} />
      case "deployment":
        return <Deployment currentSubsection={subsectionId} />
      case "playground":
        return <Playground />
      case "timeline":
        return <Timeline />
      case "tech-stack":
        return <TechStack />
      case "cost-analysis":
        return <CostAnalysis />
      case "qa-section":
        return <QASection />
      case "thank-you":
        return <ThankYou />
      default:
        return <Overview />
    }
  }, [activeSection, currentSubsection])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="flex flex-col flex-1">
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <Sidebar activeSection={activeSection} onSectionChange={(section) => {
            const index = SECTIONS.indexOf(section)
            if (index !== -1) {
              setCurrentIndex(index)
              setCurrentSubsection(0)
            }
          }} />

          {/* Main Content */}
          <main className="flex-1 overflow-auto flex flex-col">
            <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-8 lg:px-12 lg:py-8">
              <div className="max-w-4xl">
                {renderSection}
              </div>
            </div>
          </main>
        </div>

        {/* Navigation Footer - Fixed */}
        <footer className="border-t border-border bg-background py-3 px-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goPreviousSubsection}
              disabled={currentIndex === 0 && currentSubsection === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground text-center flex-1">
              <div className="text-xs">
                {currentIndex + 1} / {SECTIONS.length} 
                {subsectionCount > 1 && ` • ${currentSubsection + 1} / ${subsectionCount}`}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goNextSubsection}
              disabled={currentIndex === SECTIONS.length - 1 && currentSubsection === subsectionCount - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
