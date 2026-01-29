import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArchitectureDiagram } from "@/components/architecture-diagram"

export function Architecture() {
  return (
    <div id="architecture-overview" className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="secondary">A. System Architecture</Badge>
        <h1 className="text-4xl font-bold tracking-tight">AWS Architecture</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          High-availability architecture on AWS designed for fault tolerance, 
          horizontal scaling, and operational observability.
        </p>
      </div>

      {/* Architecture Diagram */}
      <div id="architecture-diagram">
        <Card>
          <CardHeader>
            <CardTitle>System Architecture Diagram</CardTitle>
            <CardDescription>Request flow from client to response with all infrastructure components</CardDescription>
          </CardHeader>
          <CardContent>
            <ArchitectureDiagram />
          </CardContent>
        </Card>
      </div>

      {/* Component Breakdown */}
      <div id="architecture-components" className="grid gap-4 md:grid-cols-2">
        <Card className="border-t-4 border-t-cyan-500">
          <CardHeader>
            <CardTitle className="text-base text-cyan-700 dark:text-cyan-400">API Gateway + ALB</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              AWS Application Load Balancer distributes traffic across multiple 
              ECS tasks with health checks and automatic failover.
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">SSL Termination</span>
                <Badge variant="outline" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">ACM Certificate</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Health Checks</span>
                <Badge variant="outline" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">/health endpoint</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Routing</span>
                <Badge variant="outline" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">Path-based</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-indigo-500">
          <CardHeader>
            <CardTitle className="text-base text-indigo-700 dark:text-indigo-400">ECS Fargate Cluster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Containerized FastAPI service running on serverless compute. 
              Auto-scales for burst traffic while maintaining HA with minimum 2 tasks.
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Min Tasks</span>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">2 (High Availability)</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Tasks</span>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">10 (Cost control)</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Task Size</span>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">2 vCPU / 4GB RAM</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target CPU</span>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">70% utilization</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Memory</span>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">80% utilization</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scale-down cooldown</span>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">5 minutes</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-emerald-500">
          <CardHeader>
            <CardTitle className="text-base text-emerald-700 dark:text-emerald-400">RDS PostgreSQL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Production-grade database with Multi-AZ for high availability. 
              Automated backups with point-in-time recovery.
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instance Type</span>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">db.t3.large</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deployment</span>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Multi-AZ (Standby)</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage</span>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">100GB gp3</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Backup Retention</span>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">7 days</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Encryption</span>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">AES-256 at rest</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-rose-500">
          <CardHeader>
            <CardTitle className="text-base text-rose-700 dark:text-rose-400">ElastiCache Redis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              In-memory cache for rate limiting counters and optional 
              model response caching for repeated queries.
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Node Type</span>
                <Badge variant="outline" className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">cache.t3.small</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engine</span>
                <Badge variant="outline" className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">Redis 7.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Use Case</span>
                <Badge variant="outline" className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">Rate limiting</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Availability Strategy */}
      <div id="architecture-high-availability">
        <Card className="border-l-4 border-l-violet-500 bg-gradient-to-br from-violet-50 to-transparent dark:from-violet-950/20 dark:to-transparent">
          <CardHeader>
            <CardTitle className="text-violet-700 dark:text-violet-300">High Availability & Fault Tolerance</CardTitle>
          <CardDescription>Design decisions ensuring service reliability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2 p-3 rounded-lg bg-violet-100/30 dark:bg-violet-900/20">
              <h4 className="font-medium text-sm text-violet-900 dark:text-violet-200">Multi-AZ Deployment</h4>
              <p className="text-sm text-muted-foreground">
                All stateful components (RDS, ElastiCache) deployed across 
                multiple availability zones. ECS tasks distributed automatically.
              </p>
            </div>
            <div className="space-y-2 p-3 rounded-lg bg-violet-100/30 dark:bg-violet-900/20">
              <h4 className="font-medium text-sm text-violet-900 dark:text-violet-200">Health Checks</h4>
              <p className="text-sm text-muted-foreground">
                ALB performs regular health checks on /health endpoint. 
                Unhealthy tasks are automatically replaced by ECS.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Graceful Degradation</h4>
              <p className="text-sm text-muted-foreground">
                If Redis is unavailable, rate limiting falls back to 
                in-memory per-task limiting with conservative defaults.
              </p>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Scaling Strategy */}
      <div id="architecture-scaling">
        <Card>
          <CardHeader>
            <CardTitle>Scaling Strategy</CardTitle>
          <CardDescription>From 10K to 100K+ submissions per day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm">MVP (10K/day)</h4>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>2 ECS tasks (minimum for HA)</li>
                <li>db.t3.large PostgreSQL</li>
                <li>Single Redis node cluster</li>
                <li>~7 requests/second peak</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm">Scale-up (100K+/day)</h4>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Auto-scale to 10+ ECS tasks</li>
                <li>RDS read replicas for analytics</li>
                <li>Redis cluster mode for throughput</li>
                <li>Optional: SQS for async processing</li>
              </ul>
            </div>
          </div>
          <div className="p-4 border border-accent/30 bg-accent/5 rounded-lg">
            <h4 className="font-medium text-sm text-accent">Auto-Scaling Triggers</h4>
            <p className="text-sm text-muted-foreground mt-1">
              ECS Service Auto Scaling configured with target tracking: scale out at 70% CPU utilization, 
              scale in at 30%. Minimum 2 tasks ensures high availability during low traffic.
            </p>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Security Architecture */}
      <div id="architecture-security">
        <Card>
          <CardHeader>
            <CardTitle>Security Architecture</CardTitle>
            <CardDescription>Defense in depth approach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-sm">Network</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  VPC with private subnets for ECS, RDS, Redis. 
                  Only ALB in public subnets.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-sm">Encryption</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  TLS 1.3 in transit, AES-256 at rest 
                  for RDS and ElastiCache.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-sm">Secrets</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  AWS Secrets Manager for DB credentials 
                  and API keys. Auto-rotation.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-sm">IAM</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Least-privilege roles for ECS tasks. 
                  No long-lived credentials.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy & Compliance */}
      <div id="architecture-compliance">
        <Card>
          <CardHeader>
            <CardTitle>Student Privacy & Compliance</CardTitle>
          <CardDescription>GDPR and educational data protection standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Data Handling</h4>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Optional student_id (for audit only when provided)</li>
                  <li>No PII storage (emails, names, phone numbers)</li>
                  <li>Anonymized submission tracking</li>
                  <li>JSON metadata for flexible client requirements</li>
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Retention & Deletion</h4>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Default retention: 90 days (configurable)</li>
                  <li>GDPR right to deletion: DELETE endpoint</li>
                  <li>Data export: GET /submissions/&#123;student_id&#125;</li>
                  <li>Compliance logging for audit trails</li>
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Encryption</h4>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>TLS 1.3 in transit (all API calls)</li>
                  <li>AES-256 at rest (RDS encryption enabled)</li>
                  <li>Database backups encrypted</li>
                  <li>No unencrypted logs with student data</li>
                </ul>
              </div>
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg space-y-2">
                <h4 className="font-medium text-sm text-accent">Compliance Status</h4>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>GDPR ready (data residency, deletion)</li>
                  <li>FERPA compatible (US education law)</li>
                  <li>COPPA safe (no child tracking)</li>
                  <li>Subject to Cambridge privacy policies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Estimation */}
      <div id="architecture-estimated-cost">
        <Card>
          <CardHeader>
            <CardTitle>Estimated Monthly Cost (MVP)</CardTitle>
            <CardDescription>AWS pricing for production workload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">ECS Fargate (2 tasks, 2vCPU/4GB, HA)</span>
                <span className="font-medium">$260</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">RDS PostgreSQL (db.t3.large, Multi-AZ)</span>
                <span className="font-medium">$280</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">ElastiCache Redis (cache.t3.small)</span>
                <span className="font-medium">$45</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">ALB, CloudWatch, ECR, S3, Data Transfer</span>
                <span className="font-medium">$110</span>
              </div>
              <div className="flex justify-between items-center p-3 border-t-2 border-accent pt-4">
                <span className="font-medium">Estimated Total</span>
                <span className="font-bold text-lg">$695/month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
