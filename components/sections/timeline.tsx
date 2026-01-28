import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Milestone {
  month: string
  title: string
  description: string
  deliverables: string[]
  status: "completed" | "in-progress" | "upcoming"
}

const milestones: Milestone[] = [
  {
    month: "Month 1",
    title: "Foundation & Data Pipeline",
    description: "Set up project infrastructure and data processing pipeline",
    deliverables: [
      "AWS infrastructure setup (VPC, ECS cluster, RDS)",
      "CI/CD pipeline configuration",
      "SciEntsBank data loading and preprocessing",
      "Label mapping and class balancing strategy",
      "Initial model training experiments"
    ],
    status: "completed"
  },
  {
    month: "Month 2",
    title: "Model Development & Baseline",
    description: "Train and evaluate the grading model",
    deliverables: [
      "DeBERTa-v3 fine-tuning on SciEntsBank",
      "Hyperparameter optimization",
      "Cross-validation and UA/UQ/UD evaluation",
      "Baseline metrics established",
      "Error analysis and iteration"
    ],
    status: "completed"
  },
  {
    month: "Month 3",
    title: "API Development",
    description: "Build the FastAPI service and database layer",
    deliverables: [
      "FastAPI application structure",
      "Request/response schemas (Pydantic)",
      "PostgreSQL models (SQLAlchemy)",
      "Authentication and rate limiting",
      "Unit and integration tests"
    ],
    status: "in-progress"
  },
  {
    month: "Month 4",
    title: "Integration & Testing",
    description: "Connect model to API and comprehensive testing",
    deliverables: [
      "Model serving integration",
      "End-to-end API testing",
      "Load testing with Locust",
      "Performance optimization",
      "Security review"
    ],
    status: "upcoming"
  },
  {
    month: "Month 5",
    title: "Staging Deployment",
    description: "Deploy to staging environment and validate",
    deliverables: [
      "Docker containerization",
      "ECS Fargate deployment",
      "CloudWatch monitoring setup",
      "Staging environment testing",
      "SME validation of predictions"
    ],
    status: "upcoming"
  },
  {
    month: "Month 6",
    title: "Production Launch",
    description: "Production deployment and handoff",
    deliverables: [
      "Production deployment",
      "Blue-green deployment setup",
      "Alert configuration",
      "Documentation completion",
      "Team training and handoff"
    ],
    status: "upcoming"
  }
]

const StatusIcon = ({ status }: { status: Milestone["status"] }) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-5 h-5 text-accent" />
    case "in-progress":
      return <Clock className="w-5 h-5 text-primary" />
    case "upcoming":
      return <Circle className="w-5 h-5 text-muted-foreground" />
  }
}

export function Timeline() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="secondary">Project Plan</Badge>
        <h1 className="text-4xl font-bold tracking-tight">6-Month MVP Timeline</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Phased approach to delivering a production-ready automated grading service, 
          from data pipeline to production deployment.
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: "40%" }}></div>
            </div>
            <span className="text-sm font-medium">40%</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>2 phases completed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span>1 phase in progress</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Circle className="w-4 h-4 text-muted-foreground" />
              <span>3 phases upcoming</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-0.5"></div>

        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={milestone.month} className={cn(
              "relative flex gap-6",
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}>
              {/* Status indicator */}
              <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  milestone.status === "completed" && "bg-accent/20",
                  milestone.status === "in-progress" && "bg-primary/20",
                  milestone.status === "upcoming" && "bg-muted"
                )}>
                  <StatusIcon status={milestone.status} />
                </div>
              </div>

              {/* Content */}
              <div className={cn(
                "flex-1 ml-16 md:ml-0",
                index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
              )}>
                <Card className={cn(
                  milestone.status === "in-progress" && "border-primary/50"
                )}>
                  <CardHeader className="pb-2">
                    <div className={cn(
                      "flex items-center gap-2",
                      index % 2 === 0 ? "md:justify-end" : ""
                    )}>
                      <Badge variant={
                        milestone.status === "completed" ? "default" :
                        milestone.status === "in-progress" ? "secondary" : "outline"
                      }>
                        {milestone.month}
                      </Badge>
                      {milestone.status === "in-progress" && (
                        <Badge className="bg-primary text-primary-foreground">Current</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{milestone.title}</CardTitle>
                    <CardDescription>{milestone.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className={cn(
                      "space-y-1 text-sm text-muted-foreground",
                      index % 2 === 0 ? "md:text-right" : ""
                    )}>
                      {milestone.deliverables.map((deliverable) => (
                        <li key={deliverable} className="flex items-center gap-2">
                          {index % 2 !== 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 shrink-0"></span>
                          )}
                          <span className="flex-1">{deliverable}</span>
                          {index % 2 === 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 shrink-0 hidden md:block"></span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block flex-1"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Mitigation */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Mitigation</CardTitle>
          <CardDescription>Key risks and mitigation strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Model Accuracy Below Target</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Mitigation:</strong> Early baseline establishment in Month 2, 
                iterative improvement, fallback to ensemble methods if needed.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Latency Exceeds Target</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Mitigation:</strong> Model quantization, GPU inference option, 
                async processing for non-critical paths.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Integration Delays</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Mitigation:</strong> API contract finalized early, mock services 
                for parallel development, buffer time in Month 4.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Scope Creep</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Mitigation:</strong> MVP scope clearly defined, post-MVP features 
                documented but deferred, weekly scope reviews.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team & Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
          <CardDescription>Team structure and estimated effort</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Full-Stack ML Engineer</p>
              <p className="text-xs text-muted-foreground mt-1">Primary owner</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold">0.5</p>
              <p className="text-sm text-muted-foreground">MLOps Support</p>
              <p className="text-xs text-muted-foreground mt-1">Infrastructure & deployment</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold">0.25</p>
              <p className="text-sm text-muted-foreground">SME Review</p>
              <p className="text-xs text-muted-foreground mt-1">Validation & feedback</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>MVP Success Criteria</CardTitle>
          <CardDescription>Definition of done for the 6-month MVP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <p className="text-sm">API endpoint accepting requests and returning grades (Correct/Partial/Incorrect)</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <p className="text-sm">Macro-F1 {">"}0.75 on Unseen Answers (UA) test set</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <p className="text-sm">P95 latency {"<"}1 second for inference requests</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <p className="text-sm">System handles 10K submissions/day without degradation</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <p className="text-sm">Full monitoring and alerting in place</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <p className="text-sm">Documentation and runbooks completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
