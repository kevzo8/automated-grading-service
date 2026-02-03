"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileJson, Network, Brain, Rocket, CheckCircle } from "lucide-react"

export function QASection() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div id="qa-section-keys-and-answers" className="space-y-4">
        <Badge variant="secondary">Interview Q&A</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Key Questions & Answers</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Comprehensive answers to the key interview questions covering System Architecture, 
          ML Methodology, and Deployment & Integration.
        </p>
      </div>

      {/* Section A: System Architecture & API Design */}
      <div id="qa-section-system-architecture">
        <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Network className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>A. System Architecture & API Design</CardTitle>
              <CardDescription>API specification, data persistence, and infrastructure</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="api-spec">
              <AccordionTrigger className="text-left">
                <span className="font-medium">What does the JSON payload look like? How do you handle authentication?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Request Payload:</p>
                  <pre className="p-3 bg-muted rounded-lg overflow-x-auto text-xs font-mono">
{`POST /v1/grade
{
  "question": "What is photosynthesis?",
  "reference_answer": "The process by which plants convert sunlight...",
  "student_answer": "Plants use sunlight to make food",
  "metadata": { "student_id": "abc123", "exam_id": "exam_456" }
}`}
                  </pre>
                </div>
                <div>
                  <p className="font-medium mb-2">Response Payload:</p>
                  <pre className="p-3 bg-muted rounded-lg overflow-x-auto text-xs font-mono">
{`{
  "request_id": "req_abc123",
  "grade": "partially_correct",
  "confidence": 0.87,
  "processed_at": "2024-01-15T10:30:00Z",
  "model_version": "deberta-v3-base-v1.0.0",
  "justification": null,  // Post-MVP
  "feedback": null        // Post-MVP
}`}
                  </pre>
                </div>
                <div>
                  <p className="font-medium mb-2">Authentication Strategy:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>API Key Authentication:</strong> Bearer tokens prefixed with `ag_live_` or `ag_test_`</li>
                    <li><strong>Rate Limiting:</strong> Redis-based, 100 req/min per key for MVP</li>
                    <li><strong>Key Management:</strong> Stored hashed in PostgreSQL, rotatable via admin API</li>
                    <li><strong>Future:</strong> OAuth 2.0 / OIDC for user-level authentication if B2C needed</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-persistence">
              <AccordionTrigger className="text-left">
                <span className="font-medium">How will you store requests and results? SQL vs NoSQL?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Decision: PostgreSQL (SQL)</p>
                  <p className="text-muted-foreground mb-3">
                    SQL is the right choice for this use case because:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Structured Data:</strong> Request/response payloads have a consistent, well-defined schema</li>
                    <li><strong>ACID Compliance:</strong> Critical for audit trails and compliance in education</li>
                    <li><strong>Complex Queries:</strong> Analytics dashboards need JOINs, aggregations, and window functions</li>
                    <li><strong>JSONB Support:</strong> PostgreSQL handles flexible metadata fields without sacrificing relational power</li>
                    <li><strong>Mature Ecosystem:</strong> Excellent tooling with SQLAlchemy, Alembic for migrations</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Schema Design:</p>
                  <pre className="p-3 bg-muted rounded-lg overflow-x-auto text-xs font-mono">
{`-- Core tables (normalized for relational design)
grading_requests (
  id UUID PRIMARY KEY,
  question TEXT NOT NULL,
  reference_answer TEXT NOT NULL,
  student_answer TEXT NOT NULL,
  metadata JSONB,  -- Flexible for future fields
  created_at TIMESTAMPTZ DEFAULT NOW()
)

grading_results (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES grading_requests(id),
  grade VARCHAR(20) NOT NULL,
  confidence FLOAT,
  model_version VARCHAR(50),
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
)`}
                  </pre>
                </div>
                <div>
                  <p className="font-medium mb-2">Why Not NoSQL?</p>
                  <p className="text-muted-foreground">
                    MongoDB/DynamoDB would work but add complexity without clear benefits. 
                    Our data is inherently relational (requests → results), and we need 
                    strong consistency for audit purposes. NoSQL's flexibility isn't needed 
                    when our schema is stable.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="architecture">
              <AccordionTrigger className="text-left">
                <span className="font-medium">How do you ensure high availability and fault tolerance?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-2">High Availability Strategy:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Multi-AZ Deployment:</strong> ECS Fargate tasks run across 2+ availability zones</li>
                    <li><strong>Auto-Scaling:</strong> ECS scales based on CPU/memory (min 2, max 10 tasks)</li>
                    <li><strong>RDS Multi-AZ:</strong> Automatic failover to standby with synchronous replication</li>
                    <li><strong>ALB Health Checks:</strong> Unhealthy containers automatically replaced</li>
                    <li><strong>Redis Cluster Mode:</strong> ElastiCache with automatic failover for caching</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Fault Tolerance Patterns:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Circuit Breakers:</strong> Prevent cascade failures if model inference is slow</li>
                    <li><strong>Graceful Degradation:</strong> Return cached results or queue requests if overloaded</li>
                    <li><strong>Retry Logic:</strong> Exponential backoff with jitter for transient failures</li>
                    <li><strong>Request Queuing:</strong> SQS for async processing during traffic spikes</li>
                    <li><strong>Model Fallback:</strong> If primary model fails, use lighter backup model</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Target SLAs:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted rounded">Availability: 99.9%</div>
                    <div className="p-2 bg-muted rounded">P95 Latency: {"<"}1s</div>
                    <div className="p-2 bg-muted rounded">RTO: {"<"}5 minutes</div>
                    <div className="p-2 bg-muted rounded">RPO: {"<"}1 minute</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      </div>

      {/* Section B: ML Methodology & Operationalization */}
      <div id="qa-section-ml-methodology">
        <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>B. ML Methodology & Operationalization</CardTitle>
              <CardDescription>Model selection, data strategy, and evaluation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="model-selection">
              <AccordionTrigger className="text-left">
                <span className="font-medium">What modelling approach would you choose given accuracy vs. latency trade-offs?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Selected Model: DeBERTa-v3-base (fine-tuned)</p>
                  <p className="text-muted-foreground mb-3">
                    This strikes the optimal balance for our MVP requirements:
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Model</th>
                        <th className="text-left p-2">Expected F1</th>
                        <th className="text-left p-2">Latency (P95)</th>
                        <th className="text-left p-2">Cost/10K</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-accent/10">
                        <td className="p-2 font-medium">DeBERTa-v3-base</td>
                        <td className="p-2">75-80%</td>
                        <td className="p-2">200-400ms</td>
                        <td className="p-2">$0.50-1</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">DistilBERT</td>
                        <td className="p-2">65-70%</td>
                        <td className="p-2">100-200ms</td>
                        <td className="p-2">$0.30</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">GPT-4 (zero-shot)</td>
                        <td className="p-2">70-75%</td>
                        <td className="p-2">500-1500ms</td>
                        <td className="p-2">$30-50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <p className="font-medium mb-2">Why DeBERTa-v3?</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Disentangled Attention:</strong> Better at capturing semantic relationships between texts</li>
                    <li><strong>Efficient Fine-tuning:</strong> Excellent transfer learning from pre-trained weights</li>
                    <li><strong>Production-Ready Size:</strong> 184M parameters fits on standard GPU with batching</li>
                    <li><strong>Proven Performance:</strong> State-of-the-art on many NLU benchmarks</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Post-MVP Enhancement Path:</p>
                  <p className="text-muted-foreground">
                    Hybrid approach: Use DeBERTa for classification, then LLM (Claude/GPT-4) 
                    for justification and feedback generation on flagged cases only. This keeps 
                    costs low while enabling rich explanations.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-strategy">
              <AccordionTrigger className="text-left">
                <span className="font-medium">How would you process SciEntsBank data? How do you handle class imbalances?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Data Processing Pipeline:</p>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li><strong>Load & Clean:</strong> Parse XML/JSON, normalize whitespace, handle encoding</li>
                    <li><strong>Label Mapping:</strong> Convert 5-way to 3-way labels (correct, partially_correct, incorrect)</li>
                    <li><strong>Input Formatting:</strong> Concatenate: `[CLS] question [SEP] reference [SEP] student [SEP]`</li>
                    <li><strong>Split Strategy:</strong> Use provided UA/UQ/UD splits, focus on Unseen Answers</li>
                    <li><strong>Tokenization:</strong> DeBERTa tokenizer with max_length=512, truncation strategy</li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium mb-2">Handling Class Imbalance:</p>
                  <p className="text-muted-foreground mb-2">
                    SciEntsBank typically has imbalanced classes (more incorrect than correct). Our strategy:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Weighted Loss:</strong> `CrossEntropyLoss(weight=[1.0, 1.5, 0.8])` based on inverse frequency</li>
                    <li><strong>Stratified Sampling:</strong> Ensure each batch has representative class distribution</li>
                    <li><strong>Data Augmentation:</strong> Paraphrase minority class examples using back-translation</li>
                    <li><strong>Evaluation Focus:</strong> Optimize for macro-F1, not accuracy, to weight classes equally</li>
                  </ul>
                </div>
                <pre className="p-3 bg-muted rounded-lg overflow-x-auto text-xs font-mono">
{`# Class weight calculation
from sklearn.utils.class_weight import compute_class_weight

weights = compute_class_weight(
    'balanced',
    classes=[0, 1, 2],  # correct, partial, incorrect
    y=train_labels
)
criterion = nn.CrossEntropyLoss(weight=torch.tensor(weights))`}
                </pre>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="evaluation">
              <AccordionTrigger className="text-left">
                <span className="font-medium">What metrics are critical for an educational product? How do you validate before production?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Critical Metrics for Education:</p>
                  <div className="grid gap-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-xs mb-1">1. Macro-F1 Score</p>
                      <p className="text-xs text-muted-foreground">
                        Weights all classes equally - critical when class imbalance exists. 
                        Target: {'>'}0.75 for MVP.
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-xs mb-1">2. Quadratic Weighted Kappa (QWK)</p>
                      <p className="text-xs text-muted-foreground">
                        Measures agreement accounting for grade proximity (partial is between correct/incorrect). 
                        Standard in educational assessment. Target: {'>'}0.70.
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-xs mb-1">3. Adjacent Agreement</p>
                      <p className="text-xs text-muted-foreground">
                        % of predictions within 1 grade of truth. Being 1 grade off is less harmful than 2. 
                        Target: {'>'}90%.
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-xs mb-1">4. Confusion Matrix Analysis</p>
                      <p className="text-xs text-muted-foreground">
                        Critical to understand: Is the model marking correct as incorrect (harmful to students) 
                        or incorrect as correct (harmful to learning)?
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Pre-Production Validation Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li><strong>Hold-out Test Set:</strong> Never train on UA test split, use for final evaluation</li>
                    <li><strong>Cross-Validation:</strong> 5-fold on training data to ensure stability</li>
                    <li><strong>Human Baseline:</strong> Compare model vs. human inter-annotator agreement</li>
                    <li><strong>Error Analysis:</strong> Manual review of 100+ misclassified examples</li>
                    <li><strong>Bias Audit:</strong> Check for demographic or linguistic biases</li>
                    <li><strong>A/B Test:</strong> Shadow mode comparing to existing grading (if available)</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      </div>


      {/* Section C: Deployment & Integration */}
      <div id="qa-section-deployment-operations">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>C. Deployment & Integration</CardTitle>
              <CardDescription>Testing, deployment, and observability</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="testing">
              <AccordionTrigger className="text-left">
                <span className="font-medium">How do you ensure reliability? Describe your testing approach.</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Testing Pyramid:</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-xs mb-1">Unit Tests (70%)</p>
                      <ul className="text-xs text-muted-foreground list-disc list-inside">
                        <li>Model preprocessing/postprocessing functions</li>
                        <li>API request/response validation (Pydantic)</li>
                        <li>Database model methods</li>
                        <li>Utility functions (tokenization, normalization)</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-xs mb-1">Integration Tests (20%)</p>
                      <ul className="text-xs text-muted-foreground list-disc list-inside">
                        <li>API endpoint workflows with test database</li>
                        <li>Model loading and inference pipeline</li>
                        <li>Redis caching behavior</li>
                        <li>Authentication and rate limiting</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-xs mb-1">Load Tests (10%)</p>
                      <ul className="text-xs text-muted-foreground list-disc list-inside">
                        <li>Locust for sustained load testing (10K requests)</li>
                        <li>Verify P95 latency under load</li>
                        <li>Auto-scaling trigger validation</li>
                        <li>Memory leak detection over time</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">ML-Specific Tests:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Smoke Tests:</strong> Model produces valid outputs for known inputs</li>
                    <li><strong>Invariance Tests:</strong> Synonym substitution shouldn't change grade</li>
                    <li><strong>Boundary Tests:</strong> Empty strings, max length, unicode handling</li>
                    <li><strong>Regression Suite:</strong> Golden dataset of 50+ examples that must pass</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="deployment">
              <AccordionTrigger className="text-left">
                <span className="font-medium">How would you deploy this model? How do you handle updates/rollbacks?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Deployment Strategy: Docker + ECS Fargate</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Containerization:</strong> Multi-stage Dockerfile with model baked in</li>
                    <li><strong>Registry:</strong> ECR for image storage with vulnerability scanning</li>
                    <li><strong>Orchestration:</strong> ECS Fargate (serverless containers, no EC2 management)</li>
                    <li><strong>Model Storage:</strong> S3 with versioned buckets for model artifacts</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Release Process:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li><strong>Blue-Green Deployment:</strong> New version deployed alongside old</li>
                    <li><strong>Canary Release:</strong> Route 5% traffic to new version first</li>
                    <li><strong>Automated Validation:</strong> Run smoke tests against canary</li>
                    <li><strong>Gradual Rollout:</strong> 5% → 25% → 50% → 100% over 1 hour</li>
                    <li><strong>Auto-Rollback:</strong> If error rate exceeds 1%, revert automatically</li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium mb-2">Model Versioning:</p>
                  <pre className="p-3 bg-muted rounded-lg overflow-x-auto text-xs font-mono">
{`# Model artifact structure in S3
s3://autograde-models/
  └── deberta-v3-base/
      ├── v1.0.0/
      │   ├── model.safetensors
      │   ├── config.json
      │   └── metrics.json  # Training metrics
      ├── v1.0.1/
      └── latest -> v1.0.1  # Symlink`}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="observability">
              <AccordionTrigger className="text-left">
                <span className="font-medium">How will you know the model is performing correctly without user complaints?</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Observability Stack:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Metrics:</strong> CloudWatch custom metrics + Prometheus</li>
                    <li><strong>Logging:</strong> Structured JSON logs to CloudWatch Logs</li>
                    <li><strong>Tracing:</strong> AWS X-Ray for request tracing</li>
                    <li><strong>Dashboards:</strong> Grafana for visualization</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Key Metrics to Monitor:</p>
                  <div className="grid gap-2 grid-cols-2">
                    <div className="p-2 bg-muted rounded text-xs">
                      <span className="font-medium">Latency P50/P95/P99</span>
                      <p className="text-muted-foreground">Alert if P95 {">"} 1s</p>
                    </div>
                    <div className="p-2 bg-muted rounded text-xs">
                      <span className="font-medium">Error Rate</span>
                      <p className="text-muted-foreground">Alert if {">"} 0.1%</p>
                    </div>
                    <div className="p-2 bg-muted rounded text-xs">
                      <span className="font-medium">Grade Distribution</span>
                      <p className="text-muted-foreground">Detect drift from baseline</p>
                    </div>
                    <div className="p-2 bg-muted rounded text-xs">
                      <span className="font-medium">Confidence Distribution</span>
                      <p className="text-muted-foreground">Many low-confidence = concern</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">ML-Specific Monitoring:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Prediction Drift:</strong> Compare daily grade distribution vs. baseline</li>
                    <li><strong>Input Drift:</strong> Monitor input text length and vocabulary changes</li>
                    <li><strong>Low Confidence Alerts:</strong> Flag requests where confidence {"<"} 0.6</li>
                    <li><strong>Human Review Queue:</strong> Sample 1% of predictions for manual review</li>
                  </ul>
                </div>
                <pre className="p-3 bg-muted rounded-lg overflow-x-auto text-xs font-mono">
{`# CloudWatch alarm example
aws cloudwatch put-metric-alarm \\
  --alarm-name "HighLatencyP95" \\
  --metric-name "inference_latency_p95" \\
  --threshold 1000 \\
  --comparison-operator GreaterThanThreshold \\
  --evaluation-periods 3 \\
  --period 60`}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      </div>

      {/* Section D: Business Context */}
      <div id="qa-section-business-context">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>D. Business & Vision</CardTitle>
                <CardDescription>Why this matters and where it's headed</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="vision">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">Why is this problem important and what's your vision?</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm">
                  <p className="font-medium">The Problem:</p>
                  <p className="text-muted-foreground">
                    Scale is the core challenge in science education. A single teacher can only manually grade so many submissions, 
                    limiting assessment frequency and feedback quality. AI-powered grading can unlock: instant feedback, fairness 
                    through consistency, and the ability for teachers to focus on high-value interactions with struggling students.
                  </p>
                  <p className="font-medium mt-3">Our Approach:</p>
                  <p className="text-muted-foreground">
                    Start with the science domain (SciEntsBank) to prove value and robustness. Build a production-ready system 
                    that can scale to thousands of simultaneous grading requests. Establish the foundation for multi-domain expansion.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="success">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">How do you measure success?</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm">
                  <p className="font-medium">MVP Success Metrics:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Macro-F1 ≥ 0.75 on Unseen Answers (UA) test set</li>
                    <li>P95 latency {"<"} 1 second per request</li>
                    <li>System reliability: 99.9% uptime</li>
                    <li>Positive SME validation on prediction quality</li>
                    <li>Capacity to handle 10K submissions/day</li>
                  </ul>
                  <p className="font-medium mt-3">Post-MVP Expansion:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Scale to 100K+ submissions/day</li>
                    <li>Extend to other domains (math, language, history)</li>
                    <li>Add confidence scores and explanations</li>
                    <li>Enable teacher-in-the-loop feedback loops</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Evaluation Criteria Summary */}
      <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">How This MVP Addresses Evaluation Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">ML + API + Database Integration</p>
                  <p className="text-xs text-muted-foreground">
                    DeBERTa model connected to FastAPI with PostgreSQL for persistence
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Balancing SOTA ML with Production</p>
                  <p className="text-xs text-muted-foreground">
                    DeBERTa-v3 over GPT-4: 10x cheaper, meets latency, ~75% F1
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Clear API Design</p>
                  <p className="text-xs text-muted-foreground">
                    RESTful with Pydantic validation, consistent error handling
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Model Selection Justification</p>
                  <p className="text-xs text-muted-foreground">
                    Compared DistilBERT, DeBERTa, GPT-4 with clear trade-off analysis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">NLP Understanding</p>
                  <p className="text-xs text-muted-foreground">
                    Class imbalance handling, appropriate metrics (QWK, macro-F1)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Clear Technical Communication</p>
                  <p className="text-xs text-muted-foreground">
                    Architecture diagrams, code samples, decision rationale throughout
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
