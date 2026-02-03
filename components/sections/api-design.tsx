"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/code-block"

export function APIDesign({ currentSubsection }: { currentSubsection: string }) {
  const [activeTab, setActiveTab] = useState("request")
  const requestSchema = `{
  "question": "What is a controlled experiment?",
  "reference_answer": "A controlled experiment is one where all variables are held constant except the one being tested.",
  "student_answer": "An experiment where you only change one thing and keep everything else the same.",
  "metadata": {
    "student_id": "stu_12345",      // Optional: for tracking
    "session_id": "sess_abc123",    // Optional: for batch correlation
    "domain": "biology"             // Optional: for analytics
  }
}`

  const responseSchema = `{
  "request_id": "req_7f3a2b1c",
  "grade": "correct",               // One of: "correct", "partially_correct", "incorrect"
  "processed_at": "2026-01-28T14:30:00Z",  // ISO 8601 UTC
  "model_version": "v1.2.0",
  "processing_time_ms": 245,        // Important for latency monitoring
  
  // Post-MVP fields (will be added in v2)
  "confidence": null,               // Future: 0.0-1.0 probability
  "justification": null,            // Future: explanation text
  "feedback": null                  // Future: formative feedback
}`

  const errorResponse = `{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "student_answer exceeds maximum length of 2000 characters",
    "request_id": "req_7f3a2b1c",
    "timestamp": "2026-01-28T14:30:00Z"
  }
}`

  const authHeader = `# API Key Authentication
curl -X POST https://api.autograde.cambridge.org/v1/grade \\
  -H "Authorization: Bearer ag_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"question": "...", "reference_answer": "...", "student_answer": "..."}'`

  const rateLimitHeaders = `# Rate Limit Response Headers
X-RateLimit-Limit: 1000          # Requests per hour
X-RateLimit-Remaining: 847       # Remaining requests
X-RateLimit-Reset: 1706450400    # Unix timestamp for reset`

  // Auto-switch tabs based on current subsection
  useEffect(() => {
    if (currentSubsection === "api-design-request-schema") setActiveTab("request")
    else if (currentSubsection === "api-design-response-schema") setActiveTab("response")
    else if (currentSubsection === "api-design-error-handling") setActiveTab("error")
  }, [currentSubsection])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div id="api-design-overview" className="space-y-4">
        <Badge variant="secondary">A. System Architecture</Badge>
        <h1 className="text-4xl font-bold tracking-tight">API Design</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          RESTful API contract with clear request/response schemas, 
          authentication patterns, and error handling strategies.
        </p>
      </div>

      {/* Endpoint Overview */}
      <div id="api-design-endpoints">
      <Card>
        <CardHeader>
          <CardTitle>Primary Endpoint</CardTitle>
          <CardDescription>Single endpoint for grading submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg font-mono text-sm">
            <Badge className="bg-accent text-accent-foreground">POST</Badge>
            <span>/v1/grade</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Accepts a student answer with question context and returns a grading label.
            Designed for synchronous real-time grading with optional async batch processing post-MVP.
          </p>
        </CardContent>
      </Card>
      </div>

      {/* Request/Response Schemas */}
      <div id="api-design-request-schema"></div>
      <div id="api-design-response-schema"></div>
      <div id="api-design-error-handling"></div>
      <div id="api-design-request-response">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="request">Request Schema</TabsTrigger>
          <TabsTrigger value="response">Response Schema</TabsTrigger>
          <TabsTrigger value="error">Error Handling</TabsTrigger>
        </TabsList>
        <TabsContent value="request" className="mt-4">
          <Card>
              <CardHeader>
                <CardTitle className="text-base">Request Payload</CardTitle>
                <CardDescription>JSON body for grading requests</CardDescription>
              </CardHeader>
            <CardContent>
              <CodeBlock code={requestSchema} language="json" />
              
              {/* Visual Schema Diagram */}
              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm mb-3">Request Structure</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-blue-500">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">question</div>
                      <div className="text-xs text-muted-foreground">string (required) • max 1000 chars</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-blue-500">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">reference_answer</div>
                      <div className="text-xs text-muted-foreground">string (required) • max 2000 chars</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-blue-500">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">student_answer</div>
                      <div className="text-xs text-muted-foreground">string (required) • max 2000 chars</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-accent">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">metadata</div>
                      <div className="text-xs text-muted-foreground">object (optional) • tracking data</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm">Required Fields</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li><code className="text-xs bg-muted px-1 py-0.5 rounded">question</code> - The scientific question being assessed (max 1000 chars)</li>
                  <li><code className="text-xs bg-muted px-1 py-0.5 rounded">reference_answer</code> - Examiner-provided gold standard answer (max 2000 chars)</li>
                  <li><code className="text-xs bg-muted px-1 py-0.5 rounded">student_answer</code> - Student response to evaluate (max 2000 chars)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="response" className="mt-4">
          <Card>
              <CardHeader>
                <CardTitle className="text-base">Success Response</CardTitle>
                <CardDescription>HTTP 200 response payload</CardDescription>
              </CardHeader>
            <CardContent>
              <CodeBlock code={responseSchema} language="json" />
              
              {/* Visual Schema Diagram */}
              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm mb-3">Response Structure</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-green-500">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">request_id</div>
                      <div className="text-xs text-muted-foreground">string • unique identifier</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-green-500">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">grade</div>
                      <div className="text-xs text-muted-foreground">string • correct | partially_correct | incorrect</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-green-500">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">processed_at</div>
                      <div className="text-xs text-muted-foreground">string • ISO 8601 UTC timestamp</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-green-500">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">processing_time_ms</div>
                      <div className="text-xs text-muted-foreground">integer • latency in milliseconds</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-green-500">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">model_version</div>
                      <div className="text-xs text-muted-foreground">string • deployed model version</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-yellow-500/50">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">confidence</div>
                      <div className="text-xs text-muted-foreground">float | null • post-MVP feature</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-yellow-500/50">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">justification</div>
                      <div className="text-xs text-muted-foreground">string | null • post-MVP feature</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background rounded border-l-4 border-yellow-500/50">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">feedback</div>
                      <div className="text-xs text-muted-foreground">string | null • post-MVP feature</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h4 className="font-medium text-sm text-accent">Post-MVP Extensibility</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Response schema includes null placeholders for confidence scores, justifications, 
                  and formative feedback. These will be populated when features are implemented 
                  without breaking API compatibility.
                </p>
              </div>
              
              {/* Future Extension Fields */}
              <div className="mt-4 p-4 border-2 border-dashed border-accent/30 rounded-lg bg-accent/5">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <span className="text-accent">🔮</span>
                  Future Extension: Custom Fields Collection
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground mb-3">
                    For post-MVP features, the API can leverage a flexible JSONB extension field without schema migration:
                  </p>
                  <div className="p-3 bg-background rounded border">
                    <div className="font-mono text-xs">
                      <span className="text-blue-400">"extensions"</span>: {'{'}
                      <div className="ml-4 text-muted-foreground">
                        <div><span className="text-green-400">"confidence_breakdown"</span>: {'{'}
                          <div className="ml-4">
                            <div><span className="text-yellow-400">"overall"</span>: 0.87,</div>
                            <div><span className="text-yellow-400">"by_criterion"</span>: {'{'} ... {'}'}</div>
                          </div>
                        {'}'},</div>
                        <div><span className="text-green-400">"justification"</span>: {'{'}
                          <div className="ml-4">
                            <div><span className="text-yellow-400">"missing_concepts"</span>: [...],</div>
                            <div><span className="text-yellow-400">"incorrect_statements"</span>: [...]</div>
                          </div>
                        {'}'},</div>
                        <div><span className="text-green-400">"feedback"</span>: {'{'}
                          <div className="ml-4">
                            <div><span className="text-yellow-400">"suggestions"</span>: [...],</div>
                            <div><span className="text-yellow-400">"resources"</span>: [...]</div>
                          </div>
                        {'}'}</div>
                      </div>
                      {'}'}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <strong>Benefits:</strong> Zero-downtime deployment, backward compatibility, feature flags per client
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="error" className="mt-4">
          <Card>
              <CardHeader>
                <CardTitle className="text-base">Error Response</CardTitle>
                <CardDescription>Standardized error format</CardDescription>
              </CardHeader>
            <CardContent>
              <CodeBlock code={errorResponse} language="json" />
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm">Error Codes</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <code className="text-xs">VALIDATION_ERROR</code>
                    <span className="text-muted-foreground">400 - Invalid input</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <code className="text-xs">UNAUTHORIZED</code>
                    <span className="text-muted-foreground">401 - Invalid API key</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <code className="text-xs">RATE_LIMITED</code>
                    <span className="text-muted-foreground">429 - Too many requests</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <code className="text-xs">MODEL_ERROR</code>
                    <span className="text-muted-foreground">500 - Inference failure</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      {/* Authentication */}
      <div id="api-design-authentication">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Strategy</CardTitle>
          <CardDescription>API key-based authentication for internal services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock code={authHeader} language="bash" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm">MVP Approach</h4>
              <p className="text-sm text-muted-foreground mt-1">
                API keys issued per client application, stored hashed in database. 
                Simple but effective for internal services.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm">Post-MVP Enhancement</h4>
              <p className="text-sm text-muted-foreground mt-1">
                OAuth 2.0 with JWT tokens for external partners, supporting 
                fine-grained scopes and token rotation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Rate Limiting */}
      <div id="api-design-rate-limiting">
      <Card>
        <CardHeader>
          <CardTitle>Rate Limiting</CardTitle>
          <CardDescription>Tiered rate limits protecting service availability while accommodating growth</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CodeBlock code={rateLimitHeaders} language="bash" />
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Rate Limit Tiers</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg space-y-2">
                <p className="font-medium text-sm">Free Tier</p>
                <div className="text-2xl font-bold text-primary">100</div>
                <p className="text-xs text-muted-foreground">requests/hour</p>
                <p className="text-xs text-muted-foreground mt-2">Evaluation & testing</p>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <p className="font-medium text-sm">Pro Tier</p>
                <div className="text-2xl font-bold text-accent">10,000</div>
                <p className="text-xs text-muted-foreground">requests/hour</p>
                <p className="text-xs text-muted-foreground mt-2">Production deployments</p>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <p className="font-medium text-sm">Enterprise Tier</p>
                <div className="text-2xl font-bold text-chart-1">Custom</div>
                <p className="text-xs text-muted-foreground">requests/hour</p>
                <p className="text-xs text-muted-foreground mt-2">SLA guaranteed limits</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Rate Limit Response</h4>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm"><span className="font-mono font-medium">HTTP 429</span> when limit exceeded</p>
              <p className="text-xs text-muted-foreground">Response headers indicate remaining quota and reset time</p>
              <p className="text-xs text-muted-foreground mt-2">Retry-After header specifies seconds until reset</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Implementation</h4>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium">Token Bucket Algorithm via ElastiCache Redis</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Per API key token tracking in Redis</li>
                <li>Tokens refill at rate limit frequency</li>
                <li>10 concurrent requests allowed per key</li>
                <li>Sliding window prevents burst exploitation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Data Persistence */}
      <div id="api-design-data-persistence">
      <Card>
        <CardHeader>
          <CardTitle>Data Persistence Strategy</CardTitle>
          <CardDescription>Why PostgreSQL is the right choice for this workload</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                SQL (PostgreSQL) - Chosen
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Structured data with clear relationships</li>
                <li>ACID compliance for audit requirements</li>
                <li>Complex queries for analytics and reporting</li>
                <li>Mature tooling (SQLAlchemy, migrations)</li>
                <li>JSON column support for flexible metadata</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
                NoSQL - Considered but Not Selected
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Data is not truly schemaless</li>
                <li>Need for relational queries (join submissions with models)</li>
                <li>Consistency requirements for educational records</li>
                <li>DynamoDB cost grows with complex queries</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Database Schema */}
      <div id="api-design-database-schema">
      <Card>
        <CardHeader>
          <CardTitle>Database Schema</CardTitle>
          <CardDescription>Core tables for the grading service</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock 
            code={`-- Denormalized submissions table (request + result in one)
-- See Q&A for normalized relational design discussion
CREATE TABLE grading_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(32) UNIQUE NOT NULL,
    
    -- Input data
    question TEXT NOT NULL,
    reference_answer TEXT NOT NULL,
    student_answer TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    
    -- Output data
    grade VARCHAR(20) NOT NULL,  -- 'correct', 'partially_correct', 'incorrect'
    label_id SMALLINT NOT NULL,  -- 0, 1, 2
    confidence FLOAT,            -- Post-MVP
    justification TEXT,          -- Post-MVP
    feedback TEXT,               -- Post-MVP
    
    -- Tracking
    model_version VARCHAR(20) NOT NULL,
    processing_time_ms INTEGER,
    api_key_id UUID REFERENCES api_keys(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for common queries
    INDEX idx_created_at (created_at),
    INDEX idx_api_key (api_key_id),
    INDEX idx_grade (grade)
);`} 
            language="sql" 
          />
          
          {/* Visual Database Schema */}
          <div id="api-design-entity-relationship" className="mt-6 p-4 border rounded-lg bg-muted/30">
            <h4 className="font-medium text-sm mb-4">Entity Relationship Diagram</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {/* grading_submissions table */}
              <div className="border-2 border-primary rounded-lg overflow-hidden">
                <div className="bg-primary text-primary-foreground px-4 py-2 font-semibold text-sm">
                  grading_submissions
                </div>
                <div className="p-3 space-y-1 bg-background">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-yellow-500">🔑</span>
                    <span className="font-mono">id</span>
                    <span className="text-muted-foreground">UUID</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">request_id</span>
                    <span className="text-muted-foreground">VARCHAR(32)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">question</span>
                    <span className="text-muted-foreground">TEXT</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">reference_answer</span>
                    <span className="text-muted-foreground">TEXT</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">student_answer</span>
                    <span className="text-muted-foreground">TEXT</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">○</span>
                    <span className="font-mono">metadata</span>
                    <span className="text-muted-foreground">JSONB</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500">●</span>
                    <span className="font-mono">grade</span>
                    <span className="text-muted-foreground">VARCHAR(20)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500">●</span>
                    <span className="font-mono">label_id</span>
                    <span className="text-muted-foreground">SMALLINT</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">○</span>
                    <span className="font-mono">confidence</span>
                    <span className="text-muted-foreground">FLOAT (Post-MVP)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">○</span>
                    <span className="font-mono">justification</span>
                    <span className="text-muted-foreground">TEXT (Post-MVP)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">○</span>
                    <span className="font-mono">feedback</span>
                    <span className="text-muted-foreground">TEXT (Post-MVP)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">model_version</span>
                    <span className="text-muted-foreground">VARCHAR(20)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">○</span>
                    <span className="font-mono">processing_time_ms</span>
                    <span className="text-muted-foreground">INTEGER</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-purple-500">🔗</span>
                    <span className="font-mono">api_key_id</span>
                    <span className="text-muted-foreground">UUID → api_keys</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">created_at</span>
                    <span className="text-muted-foreground">TIMESTAMPTZ</span>
                  </div>
                </div>
              </div>

              {/* api_keys table */}
              <div className="border-2 border-accent rounded-lg overflow-hidden">
                <div className="bg-accent text-accent-foreground px-4 py-2 font-semibold text-sm">
                  api_keys
                </div>
                <div className="p-3 space-y-1 bg-background">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-yellow-500">🔑</span>
                    <span className="font-mono">id</span>
                    <span className="text-muted-foreground">UUID</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">key_hash</span>
                    <span className="text-muted-foreground">VARCHAR(64)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">service_name</span>
                    <span className="text-muted-foreground">VARCHAR(100)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">rate_limit</span>
                    <span className="text-muted-foreground">INTEGER</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">created_at</span>
                    <span className="text-muted-foreground">TIMESTAMPTZ</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">🔑</span> Primary Key
              </div>
              <div className="flex items-center gap-1">
                <span className="text-purple-500">🔗</span> Foreign Key
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-500">●</span> Required
              </div>
              <div className="flex items-center gap-1">
                <span className="text-accent">○</span> Optional
              </div>
            </div>
          </div>
          
          {/* Post-MVP Extension Table */}
          <div className="mt-6 p-4 border-2 border-dashed border-accent/30 rounded-lg bg-accent/5">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <span className="text-accent">🔮</span>
              Post-MVP Extension: Enhanced Features Table
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              {/* grading_enhancements table */}
              <div className="border-2 border-accent/50 border-dashed rounded-lg overflow-hidden">
                <div className="bg-accent/20 text-foreground px-4 py-2 font-semibold text-sm">
                  grading_enhancements
                </div>
                <div className="p-3 space-y-1 bg-background">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-yellow-500">🔑</span>
                    <span className="font-mono">id</span>
                    <span className="text-muted-foreground">UUID</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-purple-500">🔗</span>
                    <span className="font-mono">submission_id</span>
                    <span className="text-muted-foreground">UUID → grading_submissions</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500">●</span>
                    <span className="font-mono">confidence_score</span>
                    <span className="text-muted-foreground">FLOAT (0.0-1.0)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">○</span>
                    <span className="font-mono">confidence_breakdown</span>
                    <span className="text-muted-foreground">JSONB</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">○</span>
                    <span className="font-mono">justification_text</span>
                    <span className="text-muted-foreground">TEXT</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">○</span>
                    <span className="font-mono">missing_concepts</span>
                    <span className="text-muted-foreground">TEXT[]</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">○</span>
                    <span className="font-mono">feedback_suggestions</span>
                    <span className="text-muted-foreground">JSONB</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent">○</span>
                    <span className="font-mono">resource_links</span>
                    <span className="text-muted-foreground">JSONB</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">●</span>
                    <span className="font-mono">created_at</span>
                    <span className="text-muted-foreground">TIMESTAMPTZ</span>
                  </div>
                </div>
              </div>

              {/* Benefits list */}
              <div className="flex flex-col justify-center space-y-3 text-sm">
                <div className="p-3 bg-background rounded border">
                  <div className="font-semibold text-accent mb-1">✓ Zero Schema Migration</div>
                  <div className="text-xs text-muted-foreground">
                    Existing queries remain unchanged
                  </div>
                </div>
                <div className="p-3 bg-background rounded border">
                  <div className="font-semibold text-accent mb-1">✓ Optional Join</div>
                  <div className="text-xs text-muted-foreground">
                    Load enhancements only when needed
                  </div>
                </div>
                <div className="p-3 bg-background rounded border">
                  <div className="font-semibold text-accent mb-1">✓ Feature Flags</div>
                  <div className="text-xs text-muted-foreground">
                    Enable per-client or A/B testing
                  </div>
                </div>
                <div className="p-3 bg-background rounded border">
                  <div className="font-semibold text-accent mb-1">✓ Backward Compatible</div>
                  <div className="text-xs text-muted-foreground">
                    API can return null for MVP clients
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-background rounded text-xs">
              <strong className="text-accent">Alternative:</strong> <span className="text-muted-foreground">
                Add a single <code className="bg-muted px-1 py-0.5 rounded">extensions JSONB</code> column to grading_submissions 
                for maximum flexibility without additional joins.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
