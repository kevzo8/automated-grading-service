// Define subsections for each page
export type SectionKey = 
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

export const SUBSECTIONS: Record<SectionKey, string[]> = {
  "overview": ["hero", "requirements", "tech-stack", "dataset", "future-enhancements"],
  "api-design": ["overview", "endpoints", "request-response", "authentication", "rate-limiting", "data-persistence", "database-schema"],
  "architecture": ["overview", "diagram", "components", "high-availability", "scaling", "security"],
  "ml-methodology": ["overview", "model-selection", "data-processing", "training", "evaluation", "pre-production-validation", "llm-integration"],
  "tech-stack": ["overview", "decision-framework", "api-framework", "ml-framework", "database", "infrastructure", "caching", "summary"],
  "cost-analysis": ["overview", "summary", "mvp-breakdown", "cost-effectiveness", "llm-comparison", "scaled-deployment", "post-mvp-optimization"],
  "deployment": ["overview", "testing", "deployment", "model-updates", "observability", "cicd"],
  "timeline": ["overview", "progress-overview", "month1", "month2", "month3", "month4", "month5", "month6", "risks", "team"],
  "playground": ["overview", "examples", "curl-example"],
  "qa-section": ["keys-and-answers", "system-architecture", "ml-methodology", "deployment-operations", "business-context"],
  "thank-you": ["closing", "why-excited", "what-i-bring", "contact"]
}

export function getSubsectionCount(section: SectionKey): number {
  return SUBSECTIONS[section]?.length ?? 1
}

export function getSubsectionId(section: SectionKey, subsectionIndex: number): string {
  const subsections = SUBSECTIONS[section]
  const subsectionName = subsections?.[subsectionIndex]
  return subsectionName ? `${section}-${subsectionName}` : `${section}-0`
}
