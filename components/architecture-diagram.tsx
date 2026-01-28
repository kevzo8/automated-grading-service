"use client"

import { cn } from "@/lib/utils"

export function ArchitectureDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px] p-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-accent"></div>
            <span className="text-muted-foreground">Compute</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span className="text-muted-foreground">Database</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-chart-3"></div>
            <span className="text-muted-foreground">Cache</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted-foreground"></div>
            <span className="text-muted-foreground">Monitoring</span>
          </div>
        </div>

        {/* Diagram */}
        <div className="relative">
          {/* Row 1: Client & Entry Point */}
          <div className="flex items-center justify-start gap-4 mb-8">
            <DiagramBox 
              label="Client Apps" 
              sublabel="Internal Services"
              className="bg-muted border-muted-foreground/30"
            />
            <Arrow />
            <DiagramBox 
              label="AWS ALB" 
              sublabel="Load Balancer"
              className="bg-accent/10 border-accent"
            />
            <Arrow />
            <DiagramBox 
              label="API Gateway" 
              sublabel="Rate Limiting"
              className="bg-accent/10 border-accent"
            />
          </div>

          {/* Row 2: Compute Layer */}
          <div className="flex items-start gap-4 mb-8 ml-[280px]">
            <div className="flex flex-col items-center">
              <Arrow direction="down" />
              <div className="p-4 border-2 border-accent rounded-lg bg-accent/5 mt-2">
                <p className="text-xs font-medium text-accent mb-3">ECS Fargate Cluster</p>
                <div className="flex gap-2">
                  <DiagramBox 
                    label="FastAPI" 
                    sublabel="Task 1"
                    className="bg-accent/20 border-accent text-xs"
                    small
                  />
                  <DiagramBox 
                    label="FastAPI" 
                    sublabel="Task 2"
                    className="bg-accent/20 border-accent text-xs"
                    small
                  />
                  <DiagramBox 
                    label="..." 
                    sublabel="Task N"
                    className="bg-accent/20 border-accent/50 text-xs"
                    small
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Data Layer */}
          <div className="flex items-start gap-8 ml-[200px]">
            <div className="flex flex-col items-center">
              <Arrow direction="down" />
              <DiagramBox 
                label="ML Model" 
                sublabel="Hugging Face"
                className="bg-accent/10 border-accent mt-2"
              />
            </div>
            <div className="flex flex-col items-center">
              <Arrow direction="down" />
              <DiagramBox 
                label="PostgreSQL" 
                sublabel="RDS Multi-AZ"
                className="bg-primary/10 border-primary mt-2"
              />
            </div>
            <div className="flex flex-col items-center">
              <Arrow direction="down" />
              <DiagramBox 
                label="Redis" 
                sublabel="ElastiCache"
                className="bg-chart-3/10 border-chart-3 mt-2"
              />
            </div>
          </div>

          {/* Side: Monitoring */}
          <div className="absolute top-0 right-0 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">Observability</p>
            <div className="space-y-2">
              <DiagramBox 
                label="CloudWatch" 
                sublabel="Metrics"
                className="bg-muted border-muted-foreground/50 text-xs"
                small
              />
              <DiagramBox 
                label="X-Ray" 
                sublabel="Tracing"
                className="bg-muted border-muted-foreground/50 text-xs"
                small
              />
              <DiagramBox 
                label="SNS" 
                sublabel="Alerts"
                className="bg-muted border-muted-foreground/50 text-xs"
                small
              />
            </div>
          </div>
        </div>

        {/* Request Flow */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-3">Request Flow</h4>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-background rounded border">1. HTTPS Request</span>
            <span className="text-muted-foreground">{">"}</span>
            <span className="px-2 py-1 bg-background rounded border">2. ALB Routes</span>
            <span className="text-muted-foreground">{">"}</span>
            <span className="px-2 py-1 bg-background rounded border">3. Rate Check (Redis)</span>
            <span className="text-muted-foreground">{">"}</span>
            <span className="px-2 py-1 bg-background rounded border">4. Model Inference</span>
            <span className="text-muted-foreground">{">"}</span>
            <span className="px-2 py-1 bg-background rounded border">5. Persist to DB</span>
            <span className="text-muted-foreground">{">"}</span>
            <span className="px-2 py-1 bg-background rounded border">6. Return Response</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DiagramBox({ 
  label, 
  sublabel, 
  className,
  small = false
}: { 
  label: string
  sublabel: string
  className?: string
  small?: boolean
}) {
  return (
    <div className={cn(
      "border-2 rounded-lg text-center",
      small ? "px-3 py-2" : "px-4 py-3",
      className
    )}>
      <p className={cn("font-medium", small ? "text-xs" : "text-sm")}>{label}</p>
      <p className={cn("text-muted-foreground", small ? "text-[10px]" : "text-xs")}>{sublabel}</p>
    </div>
  )
}

function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  if (direction === "down") {
    return (
      <div className="flex flex-col items-center text-muted-foreground">
        <div className="w-0.5 h-4 bg-muted-foreground/50"></div>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }
  
  return (
    <div className="flex items-center text-muted-foreground">
      <div className="w-6 h-0.5 bg-muted-foreground/50"></div>
      <svg className="w-3 h-3 -ml-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </div>
  )
}
