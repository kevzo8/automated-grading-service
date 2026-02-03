import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Target, Zap, Database, Shield } from "lucide-react"

export function Overview() {
  return (
    <div id="overview-hero" className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <Badge variant="secondary" className="mb-2">MVP Proposal</Badge>
        <h1 className="text-4xl font-bold tracking-tight text-balance">
          Automated Short-Answer Grading Service
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A production-ready ML service that evaluates student responses to scientific questions 
          by comparing against reference answers, delivering accurate grading via HTTP API.
        </p>
      </div>

      {/* Key Requirements Grid */}
      <div id="overview-requirements" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Core Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">3-Way Classification</p>
            <p className="text-sm text-muted-foreground mt-1">
              Correct, Partially Correct, Incorrect
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
              Throughput Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">10K/day</p>
            <p className="text-sm text-muted-foreground mt-1">
              Scalable to 100K+ submissions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500 bg-gradient-to-br from-violet-50 to-transparent dark:from-violet-950/20 dark:to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              Latency Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">&lt;1s P95</p>
            <p className="text-sm text-muted-foreground mt-1">
              Long-term goal (MVP: 250-300ms)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tech Stack */}
      <div id="overview-tech-stack">
        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          <CardDescription>Production-grade Python ecosystem on AWS infrastructure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">API Layer</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>FastAPI</Badge>
                <Badge>SQLAlchemy</Badge>
                <Badge>Pydantic</Badge>
                <Badge>Pytest</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">ML Stack</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>PyTorch</Badge>
                <Badge>Transformers</Badge>
                <Badge>scikit-learn</Badge>
                <Badge>Pandas</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Infrastructure</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>AWS ECS</Badge>
                <Badge>RDS PostgreSQL</Badge>
                <Badge>ElastiCache</Badge>
                <Badge>CloudWatch</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Dataset Info */}
      <div id="overview-dataset">
        <Card>
          <CardHeader>
            <CardTitle>SciEntsBank Dataset</CardTitle>
          <CardDescription>Scientific Entailment Bank for short-answer assessment (Dzikovska et al., 2013)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Primary Focus</p>
                <p className="text-lg font-semibold mt-1">Unseen Answers (UA)</p>
                <p className="text-xs text-muted-foreground mt-1">Novel student expressions for known Q&A pairs</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Input Schema</p>
                <p className="text-lg font-semibold mt-1">Question + Reference + Student</p>
                <p className="text-xs text-muted-foreground mt-1">Three-text comparison task</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Classification</p>
                <p className="text-lg font-semibold mt-1">3-Way Labels</p>
                <p className="text-xs text-muted-foreground mt-1">Correct / Partially Correct / Incorrect</p>
              </div>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg border border-secondary">
              <p className="text-sm font-medium mb-2">Label Definitions (3-way classification)</p>
              <div className="grid gap-2 md:grid-cols-3 text-xs">
                <div>
                  <span className="font-medium text-accent">Correct:</span>
                  <span className="text-muted-foreground ml-1">Semantically equivalent to reference answer</span>
                </div>
                <div>
                  <span className="font-medium text-chart-3">Partially Correct:</span>
                  <span className="text-muted-foreground ml-1">Contains some correct elements but incomplete</span>
                </div>
                <div>
                  <span className="font-medium text-destructive">Incorrect:</span>
                  <span className="text-muted-foreground ml-1">Wrong, irrelevant, or contradictory response</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm font-medium text-accent mb-2">Licensing & Attribution</p>
              <p className="text-sm text-muted-foreground">
                SciEntsBank is available via Hugging Face (nkazi/SciEntsBank) under academic use terms. 
                Original dataset: Dzikovska et al. (2013). For commercial deployment, licensing agreement with dataset authors/Cambridge University may be required.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stretch Goals */}
      <div id="overview-future-enhancements">
        <Card>
          <CardHeader>
            <CardTitle>Future Enhancements (Post-MVP)</CardTitle>
            <CardDescription>Architecture designed to accommodate these features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="font-medium">Confidence Scores</p>
                  <p className="text-sm text-muted-foreground">Model prediction probability for each grade</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="font-medium">Justification</p>
                  <p className="text-sm text-muted-foreground">Clear rationale for why an answer was graded correct, partially correct, or incorrect</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="font-medium">Formative Feedback</p>
                  <p className="text-sm text-muted-foreground">Guidance on how to improve the answer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="font-medium">Multi-Domain Support</p>
                  <p className="text-sm text-muted-foreground">Expand beyond science to other subjects</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Differentiators */}
      <div id="overview-differentiators" className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              Data-First Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every request and response is persisted for audit trails, model retraining, 
              and analytics. Schema supports future metadata expansion.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Production-Ready Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              API key authentication with rate limiting, input validation, 
              and comprehensive logging for compliance requirements.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
