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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">API Gateway + ALB</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              AWS Application Load Balancer distributes traffic across multiple 
              ECS tasks with health checks and automatic failover.
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">SSL Termination</span>
                <Badge variant="outline">ACM Certificate</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Health Checks</span>
                <Badge variant="outline">/health endpoint</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Routing</span>
                <Badge variant="outline">Path-based</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ECS Fargate Cluster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Containerized FastAPI service running on serverless compute. 
              Auto-scales based on CPU/memory utilization.
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Min Tasks</span>
                <Badge variant="outline">2 (HA)</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Tasks</span>
                <Badge variant="outline">10 (scaling)</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">vCPU/Memory</span>
                <Badge variant="outline">2 vCPU / 4GB</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">RDS PostgreSQL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Multi-AZ deployment for high availability with automated backups 
              and point-in-time recovery.
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instance</span>
                <Badge variant="outline">db.r6g.large</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage</span>
                <Badge variant="outline">100GB gp3</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Backup Retention</span>
                <Badge variant="outline">7 days</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ElastiCache Redis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              In-memory cache for rate limiting counters and optional 
              model response caching for repeated queries.
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Node Type</span>
                <Badge variant="outline">cache.r6g.large</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Replicas</span>
                <Badge variant="outline">1 read replica</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Use Case</span>
                <Badge variant="outline">Rate limiting</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Availability Strategy */}
      <div id="architecture-high-availability">
        <Card>
          <CardHeader>
            <CardTitle>High Availability & Fault Tolerance</CardTitle>
          <CardDescription>Design decisions ensuring service reliability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Multi-AZ Deployment</h4>
              <p className="text-sm text-muted-foreground">
                All stateful components (RDS, ElastiCache) deployed across 
                multiple availability zones. ECS tasks distributed automatically.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Health Checks</h4>
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
                <li>db.r6g.large PostgreSQL</li>
                <li>Single Redis node cluster</li>
                <li>~7 requests/minute average</li>
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

      {/* Cost Estimation */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Estimated Monthly Cost (MVP)</CardTitle>
            <CardDescription>AWS pricing for production workload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">ECS Fargate (2 tasks, 2vCPU/4GB)</span>
                <span className="font-medium">~$150</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">RDS PostgreSQL (db.r6g.large, Multi-AZ)</span>
                <span className="font-medium">~$350</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">ElastiCache Redis (cache.r6g.large)</span>
                <span className="font-medium">~$200</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">ALB, CloudWatch, Data Transfer</span>
                <span className="font-medium">~$100</span>
              </div>
              <div className="flex justify-between items-center p-3 border-t-2 border-accent pt-4">
                <span className="font-medium">Estimated Total</span>
                <span className="font-bold text-lg">~$800/month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
