"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/code-block"
import { AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react"

export function MLMethodology({ currentSubsection }: { currentSubsection: string }) {
  const [activeDataTab, setActiveDataTab] = useState("processing")
  const dataProcessingCode = `from datasets import load_dataset
import pandas as pd

# Load SciEntsBank from Hugging Face
dataset = load_dataset("nkazi/SciEntsBank")

# Map 5-way labels to 3-way classification
LABEL_MAP = {
    "correct": "correct",
    "partially_correct_incomplete": "partially_correct",
    "contradictory": "incorrect",
    "irrelevant": "incorrect",
    "non_domain": "incorrect"
}

def preprocess_example(example):
    """Prepare input for model training."""
    # Concatenate inputs with special tokens
    text = (
        f"[QUESTION] {example['question']} "
        f"[REFERENCE] {example['reference_answer']} "
        f"[STUDENT] {example['student_answer']}"
    )
    label = LABEL_MAP[example['label']]
    return {"text": text, "label": label}

# Process training data
train_data = dataset['train'].map(preprocess_example)`

  const modelCode = `from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    TrainingArguments,
    Trainer
)

# Model: DeBERTa-v3-base (optimal accuracy/latency balance)
MODEL_NAME = "microsoft/deberta-v3-base"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=3,
    id2label={0: "incorrect", 1: "partially_correct", 2: "correct"},
    label2id={"incorrect": 0, "partially_correct": 1, "correct": 2}
)

# Training configuration optimized for short-answer assessment
training_args = TrainingArguments(
    output_dir="./autograde-model",
    num_train_epochs=5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=32,
    learning_rate=2e-5,
    warmup_ratio=0.1,
    weight_decay=0.01,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="macro_f1",
    fp16=True,  # Mixed precision for faster training
)`

  const evaluationCode = `from sklearn.metrics import (
    accuracy_score,
    f1_score,
    cohen_kappa_score,
    confusion_matrix,
    classification_report
)

def compute_metrics(eval_pred):
    """Educational assessment metrics beyond simple accuracy."""
    predictions, labels = eval_pred
    preds = predictions.argmax(-1)
    
    return {
        # Standard metrics
        "accuracy": accuracy_score(labels, preds),
        "macro_f1": f1_score(labels, preds, average="macro"),
        "weighted_f1": f1_score(labels, preds, average="weighted"),
        
        # Educational metrics
        "quadratic_weighted_kappa": cohen_kappa_score(
            labels, preds, weights="quadratic"
        ),
        
        # Per-class F1 for imbalance analysis
        "f1_correct": f1_score(labels, preds, labels=[2], average="micro"),
        "f1_partial": f1_score(labels, preds, labels=[1], average="micro"),
        "f1_incorrect": f1_score(labels, preds, labels=[0], average="micro"),
    }

# Additional validation: Adjacent Agreement
# Measures how often predictions are within 1 grade of truth
def adjacent_agreement(y_true, y_pred):
    """For educational products, being off by 1 grade is better than 2."""
    return sum(abs(t - p) <= 1 for t, p in zip(y_true, y_pred)) / len(y_true)`

  // Auto-switch data strategy tabs based on current subsection
  useEffect(() => {
    if (currentSubsection === "ml-methodology-data-processing") setActiveDataTab("processing")
    else if (currentSubsection === "ml-methodology-class-imbalance") setActiveDataTab("imbalance")
    else if (currentSubsection === "ml-methodology-augmentation") setActiveDataTab("augmentation")
  }, [currentSubsection])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div id="ml-methodology-overview" className="space-y-4">
        <Badge variant="secondary">B. ML Methodology</Badge>
        <h1 className="text-4xl font-bold tracking-tight">ML Methodology & Operationalization</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Model selection, data processing strategy, and evaluation framework 
          optimized for educational assessment accuracy and production latency.
        </p>
      </div>

      {/* Model Selection */}
      <div id="ml-methodology-model-selection">
        <Card>
          <CardHeader>
            <CardTitle>Model Selection: DeBERTa-v3-base</CardTitle>
          <CardDescription>Balancing accuracy and latency for production deployment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selection Rationale */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-br from-teal-100 to-transparent dark:from-teal-950/30 dark:to-transparent border-l-4 border-l-teal-500 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h4 className="font-medium text-sm text-teal-900 dark:text-teal-200">Chosen: DeBERTa-v3-base</h4>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>SOTA on NLU benchmarks</li>
                <li>~250-300ms inference P95 (CPU)</li>
                <li>184M parameters</li>
                <li>Disentangled attention mechanism</li>
              </ul>
            </div>
            <div className="p-4 bg-gradient-to-br from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent border-l-4 border-l-slate-400 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <h4 className="font-medium text-sm text-slate-900 dark:text-slate-200">Considered: GPT-4/LLMs</h4>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Highest accuracy potential</li>
                <li>2-5s inference latency</li>
                <li>High cost per request</li>
                <li>Less control, API dependency</li>
              </ul>
            </div>
            <div className="p-4 bg-gradient-to-br from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent border-l-4 border-l-slate-400 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <h4 className="font-medium text-sm text-slate-900 dark:text-slate-200">Considered: DistilBERT</h4>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Fastest inference (~30ms)</li>
                <li>Lower accuracy trade-off</li>
                <li>66M parameters</li>
                <li>May miss nuanced answers</li>
              </ul>
            </div>
          </div>

          {/* Why DeBERTa */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-sm mb-2">Why DeBERTa-v3 for Short-Answer Assessment?</h4>
            <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <Zap className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                  <span><strong>Disentangled Attention:</strong> Better at comparing semantic similarity between reference and student answers.</span>
                </p>
                <p className="flex items-start gap-2">
                  <Zap className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                  <span><strong>Enhanced Mask Decoder:</strong> Improved understanding of partial matches and paraphrasing.</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <span><strong>Latency Profile:</strong> 250-300ms P95 on CPU (within &lt;1s target). For sub-100ms, deploy on GPU (T4, adds ~$200/month).</span>
                </p>
                <p className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <span><strong>Fine-tuning Efficiency:</strong> Converges in 5-10 epochs on SciEntsBank (~4-6 hours training on GPU).</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Data Processing */}
      <div id="ml-methodology-data-processing"></div>
      <div id="ml-methodology-class-imbalance"></div>
      <div id="ml-methodology-augmentation"></div>
      <div id="ml-methodology-data-processing">
        <Card>
          <CardHeader>
            <CardTitle>Data Strategy</CardTitle>
          <CardDescription>Processing SciEntsBank for 3-way classification</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDataTab} onValueChange={setActiveDataTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="processing">Data Processing</TabsTrigger>
              <TabsTrigger value="imbalance">Class Imbalance</TabsTrigger>
              <TabsTrigger value="augmentation">Augmentation</TabsTrigger>
            </TabsList>
            <TabsContent value="processing" className="mt-4">
              <CodeBlock code={dataProcessingCode} language="python" />
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">Label Mapping Strategy</h4>
                <p className="text-sm text-muted-foreground">
                  SciEntsBank provides 5 fine-grained labels. We collapse these to 3 categories 
                  based on actionable feedback: answers that contain errors (contradictory, irrelevant, non_domain) 
                  are all marked incorrect since they require the same intervention.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="imbalance" className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold text-accent">~15%</p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">~25%</p>
                  <p className="text-sm text-muted-foreground">Partially Correct</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold text-destructive">~60%</p>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Handling Imbalance</h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Class Weights:</strong> Apply inverse frequency weights in loss function</li>
                  <li><strong>Stratified Splits:</strong> Ensure train/val/test maintain class distribution</li>
                  <li><strong>Focal Loss:</strong> Consider for reducing easy negative dominance</li>
                  <li><strong>Evaluation:</strong> Use macro-F1 (not accuracy) as primary metric</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="augmentation" className="mt-4 space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Data Augmentation Strategies</h4>
                <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Synonym Replacement</p>
                    <p>Replace words with WordNet synonyms to simulate paraphrasing variations.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Back-Translation</p>
                    <p>Translate to another language and back to generate natural variations.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Random Deletion</p>
                    <p>Remove random words to simulate incomplete student answers.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Noise Injection</p>
                    <p>Add typos and grammatical errors common in student writing.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h4 className="font-medium text-sm text-accent mb-1">Important Consideration</h4>
                <p className="text-sm text-muted-foreground">
                  Augmentation should preserve the label validity. An augmented correct answer 
                  must still be semantically correct. Validate augmented samples manually.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        </Card>
      </div>

      {/* Model Training Code */}
      <div id="ml-methodology-training">
        <Card>
          <CardHeader>
            <CardTitle>Model Training</CardTitle>
          <CardDescription>Fine-tuning configuration for short-answer grading</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={modelCode} language="python" />
        </CardContent>
        </Card>
      </div>

      {/* Evaluation */}
      <div id="ml-methodology-evaluation">
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Framework</CardTitle>
          <CardDescription>Metrics critical for educational products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock code={evaluationCode} language="python" />
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Primary Metrics</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex justify-between">
                  <span>Macro F1</span>
                  <Badge variant="outline">Target: {">"}0.75</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Quadratic Weighted Kappa</span>
                  <Badge variant="outline">Target: {">"}0.70</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Adjacent Agreement</span>
                  <Badge variant="outline">Target: {">"}0.90</Badge>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Why These Metrics?</h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong>QWK:</strong> Standard in educational assessment, penalizes large errors more</li>
                <li><strong>Macro F1:</strong> Accounts for class imbalance</li>
                <li><strong>Adjacent:</strong> Missing by 1 grade is acceptable, missing by 2 is not</li>
              </ul>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Production Validation */}
      <div id="ml-methodology-pre-production-validation">
        <Card>
          <CardHeader>
            <CardTitle>Pre-Production Validation</CardTitle>
            <CardDescription>Steps before releasing to production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium shrink-0">1</div>
                <div>
                  <h4 className="font-medium text-sm">Cross-Validation</h4>
                  <p className="text-sm text-muted-foreground">5-fold stratified CV on training data to ensure robust performance estimates.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium shrink-0">2</div>
                <div>
                  <h4 className="font-medium text-sm">UA/UQ/UD Evaluation</h4>
                  <p className="text-sm text-muted-foreground">Report performance separately on Unseen Answers (primary), Unseen Questions, and Unseen Domains.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium shrink-0">3</div>
                <div>
                  <h4 className="font-medium text-sm">Error Analysis</h4>
                  <p className="text-sm text-muted-foreground">Manual review of misclassified examples, especially partial vs incorrect confusion.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium shrink-0">4</div>
                <div>
                  <h4 className="font-medium text-sm">SME Review</h4>
                  <p className="text-sm text-muted-foreground">Subject Matter Experts validate a sample of predictions before production release.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium shrink-0">5</div>
                <div>
                  <h4 className="font-medium text-sm">Shadow Mode</h4>
                  <p className="text-sm text-muted-foreground">Run model in production without serving results, compare to manual grades for 1-2 weeks.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post-MVP: LLM Integration */}
      <div id="ml-methodology-llm-integration">
        <Card>
          <CardHeader>
            <CardTitle>Post-MVP: LLM for Justification & Feedback</CardTitle>
          <CardDescription>Hybrid architecture for stretch goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-4">
              For justification and formative feedback features, we propose a hybrid approach:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm">Fast Path (DeBERTa)</h4>
                <p className="text-xs text-muted-foreground">Grade classification in {"<"}100ms</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm">Slow Path (LLM)</h4>
                <p className="text-xs text-muted-foreground">Generate feedback async via LangChain</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Grades returned immediately; feedback delivered via webhook or polling endpoint.
              This preserves latency while enabling rich explanations.
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  )
}
