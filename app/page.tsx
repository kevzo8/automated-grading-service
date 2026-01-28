"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Overview } from "@/components/sections/overview"
import { APIDesign } from "@/components/sections/api-design"
import { Architecture } from "@/components/sections/architecture"
import { MLMethodology } from "@/components/sections/ml-methodology"
import { Deployment } from "@/components/sections/deployment"
import { Playground } from "@/components/sections/playground"
import { Timeline } from "@/components/sections/timeline"
import { TechStack } from "@/components/sections/tech-stack"
import { CostAnalysis } from "@/components/sections/cost-analysis"
import { QASection } from "@/components/sections/qa-section"
import { ThankYou } from "@/components/sections/thank-you"

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

  const renderSection = () => {
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
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 lg:px-12 lg:py-12">
          {renderSection()}
        </div>
      </main>
    </div>
  )
}
