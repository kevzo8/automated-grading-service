"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Sidebar } from "@/components/sidebar"

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

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("overview")

  // Memoize section rendering to prevent unnecessary re-renders
  const renderSection = useMemo(() => {
    switch (activeSection) {
      case "overview":
        return <Overview />
      case "api-design":
        return <APIDesign />
      case "architecture":
        return <Architecture />
      case "ml-methodology":
        return <MLMethodology />
      case "deployment":
        return <Deployment />
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
  }, [activeSection])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 lg:px-12 lg:py-12">
          {renderSection}
        </div>
      </main>
    </div>
  )
}
