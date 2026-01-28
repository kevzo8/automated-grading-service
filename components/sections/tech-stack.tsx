import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, DollarSign, Zap, Shield, Scale, ArrowRight } from "lucide-react"

interface TechComparisonProps {
  name: string
  pros: string[]
  cons: string[]
  selected?: boolean
}

function TechComparison({ name, pros, cons, selected }: TechComparisonProps) {
  return (
    <Card className={selected ? "border-accent" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {name}
          {selected && <Badge className="bg-accent text-accent-foreground">Selected</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          {pros.map((pro, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>{pro}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {cons.map((con, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <span>{con}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TechStack() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="secondary">Technical Decisions</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Technology Stack Rationale</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Every technology choice balances performance, cost, maintainability, and alignment 
          with Cambridge&apos;s existing Python ecosystem and AWS infrastructure.
        </p>
      </div>

      {/* Decision Framework */}
      <Card>
        <CardHeader>
          <CardTitle>Decision Framework</CardTitle>
          <CardDescription>Key criteria guiding technology selection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Performance</p>
                <p className="text-xs text-muted-foreground">Meet latency and throughput targets</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Cost Efficiency</p>
                <p className="text-xs text-muted-foreground">Optimize TCO for MVP budget</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Team Expertise</p>
                <p className="text-xs text-muted-foreground">Leverage existing Python skills</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Scalability</p>
                <p className="text-xs text-muted-foreground">Support 10x growth without rewrite</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Framework */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">API Framework</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <TechComparison
            name="FastAPI"
            selected
            pros={[
              "Native async support for I/O-bound operations",
              "Automatic OpenAPI documentation",
              "Pydantic validation with type hints",
              "High performance (on par with Node.js)",
            ]}
            cons={[
              "Relatively newer ecosystem",
              "Less enterprise adoption than Flask",
            ]}
          />
          <TechComparison
            name="Flask"
            pros={[
              "Mature ecosystem with extensive plugins",
              "Large community and documentation",
              "Simple and familiar to most Python developers",
            ]}
            cons={[
              "Synchronous by default (WSGI)",
              "Manual request validation",
              "No built-in OpenAPI generation",
            ]}
          />
          <TechComparison
            name="Django REST Framework"
            pros={[
              "Batteries-included approach",
              "Built-in admin panel",
              "ORM with migrations",
            ]}
            cons={[
              "Heavyweight for microservices",
              "Monolithic architecture tendencies",
              "Slower for ML inference APIs",
            ]}
          />
        </div>
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Rationale</p>
                <p className="text-sm text-muted-foreground">
                  FastAPI is selected for its async-first design (critical for ML inference that may involve 
                  GPU batching), automatic request validation via Pydantic (reducing boilerplate and bugs), 
                  and built-in OpenAPI spec generation (essential for internal client integration). Its performance 
                  characteristics make it ideal for the {"<"}1s latency target.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ML Framework */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">ML Framework</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <TechComparison
            name="PyTorch + Transformers"
            selected
            pros={[
              "Industry standard for NLP research",
              "Hugging Face ecosystem integration",
              "Flexible for custom architectures",
              "Strong GPU acceleration support",
            ]}
            cons={[
              "Higher memory footprint than ONNX",
              "Requires careful optimization for production",
            ]}
          />
          <TechComparison
            name="TensorFlow + Keras"
            pros={[
              "TensorFlow Serving for production",
              "TensorFlow Lite for edge deployment",
              "Mature production tooling",
            ]}
            cons={[
              "Less intuitive debugging",
              "Transformers library prefers PyTorch",
              "Heavier dependency tree",
            ]}
          />
          <TechComparison
            name="ONNX Runtime"
            pros={[
              "Optimized inference speed",
              "Smaller deployment footprint",
              "Cross-platform compatibility",
            ]}
            cons={[
              "Conversion overhead for new models",
              "Limited support for some ops",
              "Less flexible for experimentation",
            ]}
          />
        </div>
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Rationale</p>
                <p className="text-sm text-muted-foreground">
                  PyTorch with Hugging Face Transformers provides the fastest path to fine-tuning DeBERTa-v3 on 
                  SciEntsBank. The ecosystem offers pre-trained checkpoints, tokenizers, and training utilities. 
                  For MVP, we prioritize development speed; ONNX conversion can be added post-MVP for 
                  latency optimization if needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Database</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <TechComparison
            name="PostgreSQL (RDS)"
            selected
            pros={[
              "ACID compliance for audit trails",
              "JSONB for flexible metadata",
              "Mature tooling and AWS integration",
              "Strong query optimization",
            ]}
            cons={[
              "Vertical scaling limits",
              "Higher cost than NoSQL for write-heavy",
            ]}
          />
          <TechComparison
            name="MongoDB (DocumentDB)"
            pros={[
              "Schema flexibility",
              "Horizontal scaling built-in",
              "Good for document-centric data",
            ]}
            cons={[
              "No ACID by default",
              "Less suited for relational queries",
              "Higher operational complexity",
            ]}
          />
          <TechComparison
            name="DynamoDB"
            pros={[
              "Serverless, auto-scaling",
              "Single-digit millisecond latency",
              "Pay-per-request pricing option",
            ]}
            cons={[
              "Limited query flexibility",
              "No JOINs or complex queries",
              "Requires careful key design",
            ]}
          />
        </div>
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Rationale</p>
                <p className="text-sm text-muted-foreground">
                  PostgreSQL is chosen for its ACID guarantees (critical for educational assessment audit trails), 
                  JSONB support (flexible metadata storage for future features), and team familiarity. The data 
                  profile (structured Q&A pairs with predictable schema) fits relational modeling well. At 10K 
                  requests/day, a single RDS instance handles the load comfortably.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compute Infrastructure */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Compute Infrastructure</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <TechComparison
            name="ECS Fargate"
            selected
            pros={[
              "No server management overhead",
              "Auto-scaling based on metrics",
              "Pay only for compute used",
              "Docker-native deployment",
            ]}
            cons={[
              "Higher per-unit cost than EC2",
              "Cold start latency (~30s)",
            ]}
          />
          <TechComparison
            name="EC2 with ASG"
            pros={[
              "Full control over instances",
              "GPU instances available",
              "Lowest per-unit cost",
            ]}
            cons={[
              "Manual capacity planning",
              "Patch and maintenance overhead",
              "Slower scaling response",
            ]}
          />
          <TechComparison
            name="Lambda + API Gateway"
            pros={[
              "True serverless, pay-per-invocation",
              "Zero infrastructure management",
              "Automatic scaling to zero",
            ]}
            cons={[
              "15-minute timeout limit",
              "Cold starts problematic for ML",
              "Memory limits (10GB max)",
            ]}
          />
        </div>
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Rationale</p>
                <p className="text-sm text-muted-foreground">
                  ECS Fargate balances operational simplicity with cost-effectiveness. For ML inference, Lambda&apos;s 
                  cold starts and memory limits are problematic. EC2 requires more DevOps overhead. Fargate 
                  allows us to run containerized PyTorch inference with minimal ops burden, and scales 
                  automatically based on CPU/memory metrics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Caching */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Caching Layer</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <TechComparison
            name="ElastiCache Redis"
            selected
            pros={[
              "Sub-millisecond latency",
              "Rich data structures (hashes, sorted sets)",
              "Pub/sub for real-time features",
              "Rate limiting support",
            ]}
            cons={[
              "Memory-bound (cost at scale)",
              "Requires cluster management",
            ]}
          />
          <TechComparison
            name="ElastiCache Memcached"
            pros={[
              "Simple key-value operations",
              "Multi-threaded architecture",
              "Lower memory overhead",
            ]}
            cons={[
              "No persistence",
              "Limited data structures",
              "No pub/sub or Lua scripting",
            ]}
          />
        </div>
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Rationale</p>
                <p className="text-sm text-muted-foreground">
                  Redis provides the flexibility needed for both response caching (reducing inference calls for 
                  repeated Q&A pairs) and API rate limiting (using sorted sets for sliding window algorithms). 
                  Its rich data structures support future features like session management and real-time analytics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Summary</CardTitle>
          <CardDescription>Complete stack overview with alternatives considered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Layer</th>
                  <th className="text-left py-2 font-medium">Selected</th>
                  <th className="text-left py-2 font-medium">Alternatives Considered</th>
                  <th className="text-left py-2 font-medium">Key Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 text-muted-foreground">API Framework</td>
                  <td className="py-2"><Badge>FastAPI</Badge></td>
                  <td className="py-2 text-muted-foreground">Flask, Django REST</td>
                  <td className="py-2 text-xs">Async + auto-validation</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">ML Framework</td>
                  <td className="py-2"><Badge>PyTorch + HF</Badge></td>
                  <td className="py-2 text-muted-foreground">TensorFlow, ONNX</td>
                  <td className="py-2 text-xs">Ecosystem + flexibility</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Database</td>
                  <td className="py-2"><Badge>PostgreSQL</Badge></td>
                  <td className="py-2 text-muted-foreground">MongoDB, DynamoDB</td>
                  <td className="py-2 text-xs">ACID + JSONB</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Compute</td>
                  <td className="py-2"><Badge>ECS Fargate</Badge></td>
                  <td className="py-2 text-muted-foreground">EC2, Lambda</td>
                  <td className="py-2 text-xs">Ops simplicity + ML support</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Cache</td>
                  <td className="py-2"><Badge>Redis</Badge></td>
                  <td className="py-2 text-muted-foreground">Memcached</td>
                  <td className="py-2 text-xs">Rate limiting + flexibility</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Monitoring</td>
                  <td className="py-2"><Badge>CloudWatch</Badge></td>
                  <td className="py-2 text-muted-foreground">Datadog, Prometheus</td>
                  <td className="py-2 text-xs">AWS-native integration</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
