import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/code-block"

export function APIDesign() {
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
  "grade": "correct",
  "label_id": 2,                    // 0=incorrect, 1=partial, 2=correct
  "processed_at": "2026-01-28T14:30:00Z",
  "model_version": "v1.2.0",
  
  // Post-MVP fields (null in MVP)
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
      <div id="api-design-request-response">
      <Tabs defaultValue="request" className="w-full">
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
              <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h4 className="font-medium text-sm text-accent">Post-MVP Extensibility</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Response schema includes null placeholders for confidence scores, justifications, 
                  and formative feedback. These will be populated when features are implemented 
                  without breaking API compatibility.
                </p>
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
          <CardDescription>Protecting service availability and ensuring fair usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock code={rateLimitHeaders} language="bash" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">1,000</p>
              <p className="text-sm text-muted-foreground">Requests/hour default</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">10</p>
              <p className="text-sm text-muted-foreground">Concurrent requests</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">Redis</p>
              <p className="text-sm text-muted-foreground">Token bucket implementation</p>
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
            code={`-- Core submissions table
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
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
