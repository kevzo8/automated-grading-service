import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CostItemProps {
  service: string
  specification: string
  monthlyCost: number
  notes: string
}

function CostItem({ service, specification, monthlyCost, notes }: CostItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex-1">
        <p className="font-medium text-sm">{service}</p>
        <p className="text-xs text-muted-foreground">{specification}</p>
      </div>
      <div className="text-right">
        <p className="font-bold">${monthlyCost.toLocaleString()}/mo</p>
        <p className="text-xs text-muted-foreground">{notes}</p>
      </div>
    </div>
  )
}

export function CostAnalysis() {
  const mvpCosts = [
    { service: "ECS Fargate", specification: "2 tasks x 2vCPU/4GB, 730 hrs", monthlyCost: 180, notes: "Always-on inference" },
    { service: "RDS PostgreSQL", specification: "db.t3.medium, Multi-AZ, 100GB", monthlyCost: 150, notes: "HA database" },
    { service: "ElastiCache Redis", specification: "cache.t3.micro, single node", monthlyCost: 25, notes: "Rate limiting + cache" },
    { service: "Application Load Balancer", specification: "1 ALB + LCUs", monthlyCost: 30, notes: "Traffic routing" },
    { service: "CloudWatch", specification: "Logs, metrics, alarms", monthlyCost: 40, notes: "Monitoring" },
    { service: "ECR", specification: "5GB storage", monthlyCost: 5, notes: "Container images" },
    { service: "S3", specification: "Model artifacts, backups", monthlyCost: 10, notes: "Storage" },
    { service: "Data Transfer", specification: "~50GB outbound", monthlyCost: 5, notes: "API responses" },
  ]

  const scaledCosts = [
    { service: "ECS Fargate", specification: "8 tasks x 4vCPU/8GB, 730 hrs", monthlyCost: 950, notes: "Auto-scaling" },
    { service: "RDS PostgreSQL", specification: "db.r5.large, Multi-AZ, 500GB", monthlyCost: 450, notes: "Read replicas" },
    { service: "ElastiCache Redis", specification: "cache.r5.large, 2-node cluster", monthlyCost: 250, notes: "Clustered" },
    { service: "Application Load Balancer", specification: "1 ALB + increased LCUs", monthlyCost: 80, notes: "Higher traffic" },
    { service: "CloudWatch", specification: "Extended retention, dashboards", monthlyCost: 100, notes: "Full observability" },
    { service: "ECR + S3", specification: "Increased storage", monthlyCost: 30, notes: "Artifacts" },
    { service: "Data Transfer", specification: "~500GB outbound", monthlyCost: 45, notes: "10x traffic" },
  ]

  const mvpTotal = mvpCosts.reduce((sum, item) => sum + item.monthlyCost, 0)
  const scaledTotal = scaledCosts.reduce((sum, item) => sum + item.monthlyCost, 0)

  return (
    <div id="cost-analysis-overview" className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="secondary">Financial Planning</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Cost Analysis</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Detailed cost breakdown demonstrating the economic viability of the proposed 
          architecture for both MVP and scaled deployment scenarios.
        </p>
      </div>

      {/* Cost Summary Cards */}
      <div id="cost-analysis-summary" className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              MVP Monthly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${mvpTotal}/mo</p>
            <p className="text-sm text-muted-foreground mt-1">10K submissions/day capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Scaled Monthly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${scaledTotal.toLocaleString()}/mo</p>
            <p className="text-sm text-muted-foreground mt-1">100K submissions/day capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-accent" />
              Cost Per Submission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$0.0015</p>
            <p className="text-sm text-muted-foreground mt-1">MVP: ${(mvpTotal / 300000).toFixed(4)}/request</p>
          </CardContent>
        </Card>
      </div>

      {/* MVP Cost Breakdown */}
      <div id="cost-analysis-mvp-breakdown">
        <Card>
          <CardHeader>
            <CardTitle>MVP Cost Breakdown (10K/day)</CardTitle>
          <CardDescription>Estimated monthly costs for minimum viable deployment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {mvpCosts.map((item) => (
              <CostItem key={item.service} {...item} />
            ))}
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t-2 font-bold">
            <span>Total Monthly</span>
            <span className="text-lg">${mvpTotal}/mo</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Annual estimate: ~${(mvpTotal * 12).toLocaleString()}/year (before Reserved Instance discounts)
          </p>
        </CardContent>
        </Card>
      </div>

      {/* Why This is Cost-Effective */}
      <div id="cost-analysis-cost-effectiveness">
        <Card>
          <CardHeader>
            <CardTitle>Why This Design is Cost-Effective</CardTitle>
          <CardDescription>Key architectural decisions that optimize total cost of ownership</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Right-Sized for MVP</p>
                  <p className="text-xs text-muted-foreground">
                    Fargate tasks sized for actual inference workload (2vCPU/4GB handles DeBERTa-base 
                    inference efficiently). No over-provisioning for &quot;future needs.&quot;
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Managed Services Reduce OpEx</p>
                  <p className="text-xs text-muted-foreground">
                    Fargate, RDS, and ElastiCache eliminate server management overhead. 
                    Engineering time is spent on ML, not infrastructure maintenance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Response Caching</p>
                  <p className="text-xs text-muted-foreground">
                    Redis caches identical Q&A pairs. If the same question/reference combo is graded 
                    multiple times, we skip expensive inference. Estimated 20-30% cache hit rate.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">No GPU Required (MVP)</p>
                  <p className="text-xs text-muted-foreground">
                    DeBERTa-base runs efficiently on CPU with ~100-200ms inference time. 
                    GPU instances would add $500+/month with minimal latency benefit at this scale.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Auto-Scaling Down</p>
                  <p className="text-xs text-muted-foreground">
                    During off-peak hours (nights, weekends), Fargate scales to minimum tasks, 
                    reducing compute costs by up to 60% during low-traffic periods.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Reserved Instance Potential</p>
                  <p className="text-xs text-muted-foreground">
                    Post-MVP, 1-year RDS Reserved Instance reduces database costs by ~40%. 
                    Fargate Savings Plans offer up to 50% discount for committed usage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Avoid Vendor Lock-In Costs</p>
                  <p className="text-xs text-muted-foreground">
                    Standard Docker + PostgreSQL means the system can be migrated to other clouds 
                    or on-premises if AWS costs become prohibitive at scale.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Sub-Linear Cost Scaling</p>
                  <p className="text-xs text-muted-foreground">
                    10x traffic increase (100K/day) only increases costs 4-5x due to 
                    better resource utilization and fixed-cost components.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Cost Comparison: LLM vs Fine-Tuned */}
      <div id="cost-analysis-llm-comparison">
        <Card>
          <CardHeader>
            <CardTitle>Alternative: LLM API Costs</CardTitle>
          <CardDescription>Why fine-tuned DeBERTa is more economical than GPT-4 API calls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Approach</th>
                  <th className="text-right py-2 font-medium">Cost/Request</th>
                  <th className="text-right py-2 font-medium">10K/day Monthly</th>
                  <th className="text-right py-2 font-medium">100K/day Monthly</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="bg-accent/5">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-accent text-accent-foreground">Selected</Badge>
                      Fine-tuned DeBERTa
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono">~$0.0015</td>
                  <td className="py-3 text-right font-mono">~$450</td>
                  <td className="py-3 text-right font-mono">~$1,900</td>
                </tr>
                <tr>
                  <td className="py-3">GPT-4o API (~500 tokens/req)</td>
                  <td className="py-3 text-right font-mono">~$0.0075</td>
                  <td className="py-3 text-right font-mono">~$2,250</td>
                  <td className="py-3 text-right font-mono">~$22,500</td>
                </tr>
                <tr>
                  <td className="py-3">GPT-4o-mini (~500 tokens/req)</td>
                  <td className="py-3 text-right font-mono">~$0.00075</td>
                  <td className="py-3 text-right font-mono">~$225</td>
                  <td className="py-3 text-right font-mono">~$2,250</td>
                </tr>
                <tr>
                  <td className="py-3">Claude 3.5 Sonnet (~500 tokens)</td>
                  <td className="py-3 text-right font-mono">~$0.0045</td>
                  <td className="py-3 text-right font-mono">~$1,350</td>
                  <td className="py-3 text-right font-mono">~$13,500</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Note: LLM costs shown are for inference only. Fine-tuned model costs include full infrastructure. 
            At scale, self-hosted fine-tuned models provide 5-10x cost savings over commercial APIs.
          </p>
        </CardContent>
        </Card>
      </div>

      {/* Scaled Deployment */}
      <div id="cost-analysis-scaled-deployment">
        <Card>
          <CardHeader>
            <CardTitle>Scaled Deployment (100K/day)</CardTitle>
          <CardDescription>Estimated costs when scaling 10x to meet growth targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {scaledCosts.map((item) => (
              <CostItem key={item.service} {...item} />
            ))}
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t-2 font-bold">
            <span>Total Monthly</span>
            <span className="text-lg">${scaledTotal.toLocaleString()}/mo</span>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Cost Optimization Roadmap */}
      <div id="cost-analysis-post-mvp-optimization">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Post-MVP Cost Optimization Opportunities</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li><strong>Reserved Instances:</strong> 1-year RDS RI saves ~40% ($60/month)</li>
            <li><strong>Fargate Savings Plans:</strong> Committed usage saves up to 50%</li>
            <li><strong>ONNX Runtime:</strong> Convert model to ONNX for 2-3x faster inference, reducing Fargate tasks needed</li>
            <li><strong>Request Batching:</strong> Batch multiple student answers together for throughput efficiency</li>
            <li><strong>Spot Instances:</strong> For non-production environments, use Fargate Spot (up to 70% savings)</li>
          </ul>
        </AlertDescription>
      </Alert>
      </div>
    </div>
  )
}
