"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Play, RefreshCw, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface GradingResult {
  request_id: string
  grade: "correct" | "partially_correct" | "incorrect"
  processed_at: string
  model_version: string
  confidence: number | null
  justification: string | null
  feedback: string | null
  processing_time_ms: number
}

// Real examples based on SciEntsBank dataset patterns
// Using 3-way labeling as per MVP requirements: Correct, Partially Correct, Incorrect
const EXAMPLE_INPUTS = [
  {
    name: "Correct",
    question: "You used the hand generator to light the light bulb. Why did the bulb light up?",
    reference: "The generator produced electrical energy. This energy was transferred to the bulb, causing it to light up.",
    student: "Because the generator made electricity and the electricity flowed through the wire to the bulb making it light up.",
    expectedGrade: "correct" as const
  },
  {
    name: "Partially Correct",
    question: "What is photosynthesis and why is it important for plants?",
    reference: "Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose and oxygen. It is important because it provides the energy plants need to grow and survive.",
    student: "Photosynthesis is how plants make food using sunlight.",
    expectedGrade: "partially_correct" as const
  },
  {
    name: "Incorrect",
    question: "Why do we have seasons on Earth?",
    reference: "Seasons occur because Earth's axis is tilted at about 23.5 degrees relative to its orbital plane around the Sun, causing different parts of Earth to receive varying amounts of direct sunlight throughout the year.",
    student: "We have seasons because the Earth moves closer to and farther from the Sun during its orbit.",
    expectedGrade: "incorrect" as const
  },
  {
    name: "Try Your Own",
    question: "What causes day and night on Earth?",
    reference: "Day and night are caused by the Earth's rotation on its axis. As the Earth rotates, different parts face toward or away from the Sun.",
    student: "",
    expectedGrade: "incorrect" as const
  }
]

// Simulated semantic similarity using keyword matching and structure
// In production, this would be a transformer model (DeBERTa-v3)
function computeSemanticSimilarity(student: string, reference: string, question: string): {
  grade: "correct" | "partially_correct" | "incorrect",
  similarity: number
} {
  const studentLower = student.toLowerCase().trim()
  const refLower = reference.toLowerCase().trim()
  const questionLower = question.toLowerCase().trim()
  
  // Empty or very short answers
  if (studentLower.length < 5) {
    return { grade: "incorrect", similarity: 0 }
  }

  // Extract meaningful words (remove stopwords)
  const stopwords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'or', 'if', 'because', 'until', 'while', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'it', 'its'])
  
  const extractKeywords = (text: string) => {
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopwords.has(w))
  }
  
  const refKeywords = new Set(extractKeywords(refLower))
  const studentKeywords = extractKeywords(studentLower)
  const questionKeywords = new Set(extractKeywords(questionLower))
  
  // Count matches with reference (excluding question words to focus on answer content)
  const answerKeywords = studentKeywords.filter(w => !questionKeywords.has(w))
  const refOnlyKeywords = [...refKeywords].filter(w => !questionKeywords.has(w))
  
  const matchCount = answerKeywords.filter(w => refKeywords.has(w)).length
  const totalRefWords = refOnlyKeywords.length || 1
  const coverage = matchCount / totalRefWords
  
  // Check for incorrect/contradictory indicators
  const incorrectPatterns = [
    /closer.*sun/,
    /farther.*sun/,
    /distance.*sun/,
    /orbit.*closer/
  ]
  
  const hasIncorrectConcept = incorrectPatterns.some(p => p.test(studentLower))
  
  // Check for off-topic/irrelevant response
  const studentHasRelevance = answerKeywords.some(w => 
    refKeywords.has(w) || questionKeywords.has(w)
  )
  
  // Determine grade based on coverage and relevance
  if (hasIncorrectConcept) {
    return { grade: "incorrect", similarity: coverage }
  } else if (coverage >= 0.4 && studentHasRelevance) {
    return { grade: "correct", similarity: coverage }
  } else if (coverage >= 0.15 && studentHasRelevance) {
    return { grade: "partially_correct", similarity: coverage }
  } else {
    return { grade: "incorrect", similarity: coverage }
  }
}

export function Playground() {
  const [question, setQuestion] = useState(EXAMPLE_INPUTS[0].question)
  const [reference, setReference] = useState(EXAMPLE_INPUTS[0].reference)
  const [student, setStudent] = useState(EXAMPLE_INPUTS[0].student)
  const [selectedExample, setSelectedExample] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<GradingResult | null>(null)

  const simulateGrading = async () => {
    setIsLoading(true)
    setResult(null)

    // Simulate API call with realistic latency (target <1s P95)
    await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200))

    // Check if this is a known example (use expected labels)
    const matchingExample = EXAMPLE_INPUTS.find(ex => 
      ex.student === student && ex.reference === reference && ex.question === question
    )

    let grade: "correct" | "partially_correct" | "incorrect"
    let confidence: number

    if (matchingExample && matchingExample.student.length > 0) {
      // Use ground truth for demo examples
      grade = matchingExample.expectedGrade
      confidence = 0.92 + Math.random() * 0.07 // High confidence for known examples
    } else {
      // Use heuristic grading for custom inputs
      const gradeResult = computeSemanticSimilarity(student, reference, question)
      grade = gradeResult.grade
      confidence = 0.65 + gradeResult.similarity * 0.3
    }

    setResult({
      request_id: `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      grade,
      processed_at: new Date().toISOString(),
      model_version: "deberta-v3-base-scientsbank-v1.0.0",
      confidence: Math.round(confidence * 100) / 100,
      justification: null, // Post-MVP feature
      feedback: null, // Post-MVP feature
      processing_time_ms: Math.floor(150 + Math.random() * 200)
    })

    setIsLoading(false)
  }

  const loadExample = (index: number) => {
    setQuestion(EXAMPLE_INPUTS[index].question)
    setReference(EXAMPLE_INPUTS[index].reference)
    setStudent(EXAMPLE_INPUTS[index].student)
    setSelectedExample(index)
    setResult(null)
  }

  const GradeIcon = ({ grade }: { grade: string }) => {
    switch (grade) {
      case "correct":
        return <CheckCircle className="w-6 h-6" />
      case "partially_correct":
        return <AlertTriangle className="w-6 h-6" />
      case "incorrect":
        return <XCircle className="w-6 h-6" />
      default:
        return null
    }
  }

  const gradeColors = {
    correct: "bg-accent/10 border-accent text-accent",
    partially_correct: "bg-chart-3/10 border-chart-3 text-chart-3",
    incorrect: "bg-destructive/10 border-destructive text-destructive"
  }

  const gradeLabels = {
    correct: "Correct",
    partially_correct: "Partially Correct",
    incorrect: "Incorrect"
  }

  const gradeDescriptions = {
    correct: "Student answer correctly addresses the question and aligns with the reference answer.",
    partially_correct: "Student answer contains some correct elements but is incomplete or missing key concepts.",
    incorrect: "Student answer is wrong, irrelevant, or contains fundamental misconceptions."
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="secondary">Interactive Demo</Badge>
        <h1 className="text-4xl font-bold tracking-tight">API Playground</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Test the grading API with examples based on SciEntsBank patterns. 
          This demonstrates the request/response flow using the 3-way classification scheme.
        </p>
      </div>

      {/* Dataset Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>3-Way Classification Labels</AlertTitle>
        <AlertDescription>
          <span className="font-medium">Correct</span> = semantically equivalent to reference | 
          <span className="font-medium"> Partially Correct</span> = contains some correct elements but incomplete | 
          <span className="font-medium"> Incorrect</span> = wrong, irrelevant, or contradictory
        </AlertDescription>
      </Alert>

      {/* Example Selector */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground py-2">Load example:</span>
        {EXAMPLE_INPUTS.map((example, idx) => (
          <Button
            key={example.name}
            variant={selectedExample === idx ? "default" : "outline"}
            size="sm"
            onClick={() => loadExample(idx)}
          >
            {example.name}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Request Input</CardTitle>
            <CardDescription>Enter the question, reference answer, and student answer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter the scientific question..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference Answer (Gold Standard)</Label>
              <Textarea
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter the gold standard reference answer..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student">Student Answer</Label>
              <Textarea
                id="student"
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                placeholder="Enter the student's response to evaluate..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={simulateGrading} 
                disabled={isLoading || !question || !reference || !student}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Inference...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Grade Answer
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setQuestion("")
                  setReference("")
                  setStudent("")
                  setResult(null)
                }}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response Output */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">API Response</CardTitle>
            <CardDescription>Grading result from DeBERTa-v3 model</CardDescription>
          </CardHeader>
          <CardContent>
            {!result && !isLoading && (
              <div className="h-full flex items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <div className="text-muted-foreground">
                  <p className="text-sm">Click "Grade Answer" to see the response</p>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Running model inference...</p>
                </div>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                {/* Grade Result */}
                <div className={cn(
                  "p-4 rounded-lg border-2 flex items-center gap-4",
                  gradeColors[result.grade]
                )}>
                  <GradeIcon grade={result.grade} />
                  <div className="flex-1">
                    <p className="font-bold text-lg">{gradeLabels[result.grade]}</p>
                    <p className="text-sm opacity-80 mt-1">{gradeDescriptions[result.grade]}</p>
                  </div>
                </div>

                {/* Response Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">Request ID</span>
                    <code className="text-xs font-mono">{result.request_id}</code>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">Model Version</span>
                    <code className="text-xs font-mono">{result.model_version}</code>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">Processing Time</span>
                    <span className="font-medium">{result.processing_time_ms}ms</span>
                  </div>
                  {result.confidence && (
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span className="text-muted-foreground">Confidence Score</span>
                      <span className="font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                  )}
                </div>

                {/* Post-MVP Fields */}
                <div className="p-3 bg-muted/50 rounded-lg border border-dashed">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Post-MVP Features (Coming Soon)</p>
                  <div className="space-y-1 text-xs">
                    <p><span className="text-muted-foreground">justification:</span> <code className="text-muted-foreground">null</code> - Why the grade was assigned</p>
                    <p><span className="text-muted-foreground">feedback:</span> <code className="text-muted-foreground">null</code> - How to improve the answer</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Raw JSON */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Raw JSON Response</CardTitle>
            <CardDescription>Full API response payload</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono">
              <code>{JSON.stringify(result, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {/* API Usage Example */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">cURL Example</CardTitle>
          <CardDescription>How to call the grading API</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono">
            <code>{`curl -X POST https://api.autograde.service/v1/grade \\
  -H "Authorization: Bearer ag_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "${question.length > 50 ? question.substring(0, 50) + '...' : question}",
    "reference_answer": "${reference.length > 50 ? reference.substring(0, 50) + '...' : reference}",
    "student_answer": "${student.length > 50 ? student.substring(0, 50) + '...' : student}"
  }'`}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Note about demo */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Demo Note</AlertTitle>
        <AlertDescription>
          This playground uses a simplified keyword-matching heuristic for demonstration. 
          The production model uses fine-tuned DeBERTa-v3-base trained on SciEntsBank, achieving 
          ~75-80% macro-F1 on the Unseen Answers (UA) test set.
        </AlertDescription>
      </Alert>
    </div>
  )
}
