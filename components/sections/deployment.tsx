import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/code-block"
import { AlertTriangle, CheckCircle, Activity, Shield, GitBranch, RefreshCw } from "lucide-react"

export function Deployment({ currentSubsection }: { currentSubsection: string }) {
  const [activeTestTab, setActiveTestTab] = useState("unit")
  const [activeMonitorTab, setActiveMonitorTab] = useState("dashboard")
  const dockerfileCode = `# Multi-stage build for optimized production image
FROM python:3.11-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY ./app ./app
COPY ./models ./models

# Non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`

  const testingCode = `# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestGradingEndpoint:
    """Unit and integration tests for grading API."""
    
    def test_valid_request_returns_grade(self):
        """Happy path: valid input returns a grade."""
        response = client.post("/v1/grade", json={
            "question": "What is photosynthesis?",
            "reference_answer": "The process by which plants convert sunlight to energy.",
            "student_answer": "Plants use sunlight to make food."
        }, headers={"Authorization": "Bearer test_api_key"})
        
        assert response.status_code == 200
        data = response.json()
        assert data["grade"] in ["correct", "partially_correct", "incorrect"]
        assert "request_id" in data
    
    def test_missing_field_returns_400(self):
        """Validation: missing required field returns error."""
        response = client.post("/v1/grade", json={
            "question": "What is photosynthesis?",
            "reference_answer": "The process..."
            # Missing student_answer
        }, headers={"Authorization": "Bearer test_api_key"})
        
        assert response.status_code == 400
        assert "student_answer" in response.json()["error"]["message"]
    
    def test_unauthorized_returns_401(self):
        """Auth: missing API key returns 401."""
        response = client.post("/v1/grade", json={
            "question": "Test",
            "reference_answer": "Test",
            "student_answer": "Test"
        })
        
        assert response.status_code == 401
    
    def test_rate_limit_returns_429(self, mock_rate_limiter):
        """Rate limiting: exceeded limit returns 429."""
        mock_rate_limiter.is_allowed.return_value = False
        
        response = client.post("/v1/grade", json={...})
        assert response.status_code == 429

# tests/test_model.py
class TestModelInference:
    """Tests for ML model component."""
    
    def test_model_loads_successfully(self, model_service):
        """Model can be loaded from disk."""
        assert model_service.model is not None
    
    def test_inference_returns_valid_label(self, model_service):
        """Inference produces valid 3-way classification."""
        result = model_service.predict(
            question="What is a variable?",
            reference="A value that can change.",
            student="Something that changes."
        )
        assert result["label"] in [0, 1, 2]
        assert 0 <= result["confidence"] <= 1`

  const loadTestCode = `# load_tests/locustfile.py
from locust import HttpUser, task, between

class GradingUser(HttpUser):
    """Load testing for grading API."""
    wait_time = between(0.5, 2)
    
    def on_start(self):
        self.headers = {"Authorization": "Bearer load_test_key"}
    
    @task(10)
    def grade_short_answer(self):
        """Simulate typical grading request."""
        self.client.post("/v1/grade", json={
            "question": "What is the scientific method?",
            "reference_answer": "A systematic approach to inquiry...",
            "student_answer": "A way to do experiments properly."
        }, headers=self.headers)
    
    @task(1)
    def health_check(self):
        """Occasional health check."""
        self.client.get("/health")

# Run: locust -f locustfile.py --host=https://api.autograde.com
# Target: 100 concurrent users, 10K requests/day = ~7 req/min average`

  const monitoringCode = `# CloudWatch Dashboard Configuration (Terraform)
resource "aws_cloudwatch_dashboard" "autograde" {
  dashboard_name = "autograde-production"
  
  dashboard_body = jsonencode({
    widgets = [
      # Request metrics
      {
        type   = "metric"
        properties = {
          title  = "API Requests"
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", aws_lb.main.arn_suffix]
          ]
          period = 60
          stat   = "Sum"
        }
      },
      # Latency percentiles
      {
        type   = "metric"
        properties = {
          title  = "Response Latency (P50, P95, P99)"
          metrics = [
            ["AutoGrade", "inference_latency_ms", { "stat": "p50" }],
            ["AutoGrade", "inference_latency_ms", { "stat": "p95" }],
            ["AutoGrade", "inference_latency_ms", { "stat": "p99" }]
          ]
        }
      },
      # Model accuracy drift
      {
        type   = "metric"
        properties = {
          title  = "Prediction Distribution"
          metrics = [
            ["AutoGrade", "prediction_correct_count"],
            ["AutoGrade", "prediction_partial_count"],
            ["AutoGrade", "prediction_incorrect_count"]
          ]
        }
      }
    ]
  })
}`

  const alertsCode = `# CloudWatch Alarms for critical metrics
resource "aws_cloudwatch_metric_alarm" "high_latency" {
  alarm_name          = "autograde-high-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "inference_latency_ms"
  namespace           = "AutoGrade"
  period              = 60
  statistic           = "p95"
  threshold           = 1000  # 1 second P95
  alarm_description   = "P95 latency exceeds 1 second"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "error_rate" {
  alarm_name          = "autograde-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "5XXError"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Sum"
  threshold           = 50
  alarm_description   = "More than 50 5XX errors in 5 minutes"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "prediction_drift" {
  alarm_name          = "autograde-prediction-drift"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 24  # 24 hours
  metric_name         = "prediction_correct_ratio"
  namespace           = "AutoGrade"
  period              = 3600
  statistic           = "Average"
  threshold           = 0.10  # Less than 10% correct is suspicious
  alarm_description   = "Prediction distribution anomaly detected"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}`

  // Auto-switch testing tabs based on current subsection
  useEffect(() => {
    if (currentSubsection === "deployment-testing-unit") setActiveTestTab("unit")
    else if (currentSubsection === "deployment-testing-load") setActiveTestTab("load")
    else if (currentSubsection === "deployment-testing-ml") setActiveTestTab("ml")
    
    if (currentSubsection === "deployment-observability-dashboard") setActiveMonitorTab("dashboard")
    else if (currentSubsection === "deployment-observability-alerts") setActiveMonitorTab("alerts")
  }, [currentSubsection])

  return (
    <div id="deployment-overview" className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="secondary">C. Deployment & Integration</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Deployment & Monitoring</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Testing strategy, containerized deployment, model versioning, 
          and production observability for reliable ML service operation.
        </p>
      </div>

      {/* Testing Strategy */}
      <div id="deployment-testing-unit"></div>
      <div id="deployment-testing-load"></div>
      <div id="deployment-testing-ml"></div>
      <div id="deployment-testing">
        <Card>
          <CardHeader>
            <CardTitle>Testing Strategy</CardTitle>
          <CardDescription>Comprehensive testing pyramid for ML services</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTestTab} onValueChange={setActiveTestTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="unit">Unit & Integration</TabsTrigger>
              <TabsTrigger value="load">Load Testing</TabsTrigger>
              <TabsTrigger value="ml">ML-Specific Tests</TabsTrigger>
            </TabsList>
            <TabsContent value="unit" className="mt-4">
              <CodeBlock code={testingCode} language="python" />
            </TabsContent>
            <TabsContent value="load" className="mt-4 space-y-4">
              <CodeBlock code={loadTestCode} language="python" />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold">100</p>
                  <p className="text-sm text-muted-foreground">Concurrent Users</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold">{"<"}500ms</p>
                  <p className="text-sm text-muted-foreground">P95 Target</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold">{"<"}0.1%</p>
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ml" className="mt-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">ML-Specific Test Categories</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Invariance Tests</p>
                      <p className="text-xs text-muted-foreground">
                        Verify model produces same output for semantically equivalent inputs 
                        (e.g., minor typo corrections should not change grade).
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Directional Tests</p>
                      <p className="text-xs text-muted-foreground">
                        Adding correct information should improve or maintain grade; 
                        adding incorrect information should decrease it.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Minimum Functionality Tests</p>
                      <p className="text-xs text-muted-foreground">
                        Golden dataset of known inputs and expected outputs that must pass.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Regression Tests</p>
                      <p className="text-xs text-muted-foreground">
                        Track performance on held-out test set; alert if new model is worse.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        </Card>
      </div>

      {/* Deployment */}
      <div id="deployment-deployment">
        <Card>
          <CardHeader>
            <CardTitle>Containerized Deployment</CardTitle>
          <CardDescription>Docker-based deployment on AWS ECS Fargate</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={dockerfileCode} language="dockerfile" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Why ECS Fargate?</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Serverless container orchestration</li>
                <li>No EC2 instance management</li>
                <li>Built-in auto-scaling</li>
                <li>Pay only for running tasks</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Alternative: Lambda</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Cold start issues with large models</li>
                <li>15-minute timeout limit</li>
                <li>Memory constraints for transformers</li>
                <li>Better for lighter workloads</li>
              </ul>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Model Updates & Rollbacks */}
      <div id="deployment-model-updates">
        <Card>
          <CardHeader>
            <CardTitle>Model Updates & Rollbacks</CardTitle>
          <CardDescription>Safe deployment of model changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-accent/20 rounded-lg">
                <GitBranch className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Model Versioning</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Models stored in S3 with semantic versioning (v1.0.0, v1.1.0). 
                  Each ECS task definition pins a specific model version.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-accent/20 rounded-lg">
                <RefreshCw className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Blue-Green Deployments</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  New model versions deployed to separate task set. Traffic gradually shifted 
                  (10% {">"} 50% {">"} 100%) with automatic rollback on error spike.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Canary Analysis</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Compare new model metrics (latency, error rate, prediction distribution) 
                  against baseline before full rollout.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border border-accent/30 bg-accent/5 rounded-lg">
            <h4 className="font-medium text-sm text-accent mb-2">Rollback Procedure</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Alert triggers (latency spike, error rate increase)</li>
              <li>Automated traffic shift back to previous task set</li>
              <li>Incident logged with model version and metrics snapshot</li>
              <li>Post-mortem analysis before re-attempting deployment</li>
            </ol>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Observability */}
      <div id="deployment-observability-dashboard"></div>
      <div id="deployment-observability-alerts"></div>
      <div id="deployment-observability">
        <Card>
          <CardHeader>
            <CardTitle>Observability & Monitoring</CardTitle>
          <CardDescription>Detecting issues before user complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeMonitorTab} onValueChange={setActiveMonitorTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-4">
              <CodeBlock code={monitoringCode} language="hcl" />
            </TabsContent>
            <TabsContent value="alerts" className="mt-4">
              <CodeBlock code={alertsCode} language="hcl" />
            </TabsContent>
          </Tabs>
        </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Monitoring Metrics</CardTitle>
          <CardDescription>What we track to ensure service health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-accent" />
                <h4 className="font-medium text-sm">System Metrics</h4>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>Request count / Error rate</li>
                <li>Latency percentiles (P50, P95, P99)</li>
                <li>CPU / Memory utilization</li>
                <li>Active connections</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <h4 className="font-medium text-sm">ML Metrics</h4>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>Prediction distribution over time</li>
                <li>Model inference latency</li>
                <li>Input text length distribution</li>
                <li>Confidence score distribution</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h4 className="font-medium text-sm">Drift Detection</h4>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>Input distribution shift</li>
                <li>Prediction ratio anomalies</li>
                <li>Sudden latency changes</li>
                <li>New question domains</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CI/CD Pipeline */}
      <div id="deployment-cicd">
        <Card>
          <CardHeader>
            <CardTitle>CI/CD Pipeline</CardTitle>
          <CardDescription>Automated testing and deployment workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Push to main</span>
            </div>
            <span className="text-muted-foreground">{">"}</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Run unit tests</span>
            </div>
            <span className="text-muted-foreground">{">"}</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Build Docker image</span>
            </div>
            <span className="text-muted-foreground">{">"}</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Push to ECR</span>
            </div>
            <span className="text-muted-foreground">{">"}</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Deploy to staging</span>
            </div>
            <span className="text-muted-foreground">{">"}</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Integration tests</span>
            </div>
            <span className="text-muted-foreground">{">"}</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-accent/20 rounded-lg border border-accent/30">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Deploy to production</span>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  )
}
