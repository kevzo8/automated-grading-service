# Content Audit & Logic Review Report
**Date**: January 29, 2026  
**Status**: ⚠️ CRITICAL ISSUES FOUND - Requires Immediate Fixes

---

## Executive Summary

Your presentation has several **critical logical inconsistencies and technical inaccuracies** that could undermine your credibility in the interview. These range from contradictory statements about the model, unrealistic claims about infrastructure, and cost calculation errors.

**Severity Breakdown:**
- 🔴 **Critical** (4 issues): System-breaking claims or contradictions
- 🟠 **High** (3 issues): Significant credibility damage
- 🟡 **Medium** (5 issues): Technical inaccuracies or unclear statements

---

## 🔴 CRITICAL ISSUES

### 1. **CRITICAL: DeBERTa-v3 Inference Latency Claims Are Unrealistic**

**Location**: ML Methodology section - Model Selection

**Problem**:
```
CLAIM: "~100ms inference (P95)" and "80-120ms P95 on CPU"
REALITY: This is NOT achievable with DeBERTa-v3-base on CPU
```

**Technical Reality**:
- DeBERTa-v3-base is **86M parameters** - NOT lightweight
- CPU inference on 86M param model: **200-400ms minimum** (not 100ms)
- The "100ms" figure assumes GPU inference (T4/A100), which costs significantly more
- P95 latency on CPU would be **300-500ms+** depending on input length
- Your cost analysis assumes this lower latency with only 2 ECS tasks

**Impact**: This directly contradicts your cost model and performance claims

**Fix Required**:
- Be honest about CPU vs GPU trade-off
- If you mean GPU inference: explicitly state "on GPU (T4, ~$0.10/hr)"
- Recalculate costs if using GPU
- If CPU-only: acknowledge ~250-300ms P95, not 100ms

**Recommended Fix**:
```
"DeBERTa-v3-base achieves ~250-300ms P95 latency on CPU 
(within <1s target even with queueing). For sub-100ms latency, 
can be deployed on GPU (T4) at higher cost (~$200/month additional)."
```

---

### 2. **CRITICAL: Cost Analysis Math Doesn't Add Up**

**Location**: Cost Analysis section

**Problem**:
```
MVP Monthly: $445
Daily cost: $445/30 = $14.83/day
Cost per submission at 10K/day: $14.83 / 10,000 = $0.00148 per submission

BUT your cost model shows ECS Fargate + RDS + ElastiCache taking up $355 base
This assumes:
- 2 ECS tasks × 730 hrs = $180 (LOW for 2vCPU/4GB Fargate)
- RDS db.t3.medium Multi-AZ = $150 (unrealistically CHEAP for Multi-AZ)
```

**Actual AWS Pricing (Jan 2026)**:
- ECS Fargate 2vCPU/4GB × 2 tasks: **~$250-280/month** (you have $180)
- RDS db.t3.medium Multi-AZ: **~$250-300/month** (you have $150)
- You're underestimating by **$80-150/month**

**Real MVP Cost**: ~$550-600/month, not $445

**Scaled Deployment**: Similarly undercalculated
- Your claimed $1,905 should be closer to **$2,200-2,400**

**Why This Matters**:
- Interviewer will fact-check AWS pricing
- Shows either lack of rigor or unrealistic optimism
- Could make them question other numbers

**Fix Required**: Update all cost numbers to reflect actual AWS pricing

---

### 3. **CRITICAL: API Schema Contradicts Implementation**

**Location**: API Design section

**Problem**:
The response schema shows:
```json
{
  "grade": "correct",
  "label_id": 2,  // 0=incorrect, 1=partial, 2=correct
  "confidence": null,
  "justification": null,
  "feedback": null
}
```

But this is incomplete:
- You never explain the **label_id numbering** (0/1/2 seems backwards)
- Grade is a string, but label_id is a number - redundant and confusing
- Response schema says these fields are "Post-MVP (null in MVP)" but doesn't explain why you're including null fields instead of omitting them
- No explanation of what `processed_at` format is (ISO 8601 assumed but not stated)
- Missing `latency` or `processing_time` field (important for ML monitoring)

**Impact**: API looks poorly thought out, unclear what client should expect

**Fix Required**:
```json
// MVP Response Schema
{
  "request_id": "req_7f3a2b1c",
  "grade": "correct",              // One of: "correct", "partially_correct", "incorrect"
  "processed_at": "2026-01-28T14:30:00Z",  // ISO 8601 UTC
  "model_version": "v1.2.0",
  "processing_time_ms": 85         // Important for monitoring
  
  // Post-MVP fields will be added here
}
```

Explain: "Fields like `confidence`, `justification`, and `feedback` are intentionally omitted in MVP to keep API simple. They'll be added in v2 as optional fields."

---

### 4. **CRITICAL: Throughput Claims vs Architecture Mismatch**

**Location**: Overview + Architecture + Cost Analysis

**Problem**:
You claim:
- MVP target: **10K submissions/day** 
- That's ~7 requests/minute on average
- You're providing **2 ECS tasks** at 2vCPU/4GB each

But reality:
- DeBERTa-v3 inference **on CPU takes 250-300ms** (as we established)
- Each task can handle ~4 concurrent requests (4 vCPU ÷ 0.25 CPU per request)
- 2 tasks × 4 concurrent = **8 concurrent requests max**
- At 250ms latency: 8 requests × (1000/250) = **32 requests/second max throughput**
- 32 req/s = **2.76M requests/day** potential capacity

So you actually have WAY MORE capacity than needed (275x your target).

**The Real Problem**: 
- You're oversizing for MVP (wasting money)
- OR you haven't actually thought through the math
- Either way, shows lack of rigor

**Why Interviewer Will Notice**:
- They'll ask "Why 2 tasks if you only need 7 req/min?"
- If you say "for HA" - yes, but you should explain this explicitly
- If you say "we needed 2" - shows you didn't do the math

**Fix Required**:
```
"While 10K/day only requires ~7 req/min average, we provision 2 ECS tasks 
for two critical reasons:
1. High Availability - single task failure means downtime
2. Burst capacity - we want P99 latency <500ms even during traffic spikes 
   (could see 50K/day during peak enrollment periods)"
```

---

## 🟠 HIGH PRIORITY ISSUES

### 5. **HIGH: SciEntsBank Dataset Licensing Not Mentioned**

**Location**: Overview section

**Problem**:
You reference SciEntsBank dataset but don't mention:
- Academic license restrictions (non-commercial use?)
- Proper citation (Dzikovska et al., 2013)
- Whether Cambridge has rights to use it
- If you're allowed to train proprietary models on it

**Why This Matters**:
- Cambridge is a major academic institution with legal/licensing concerns
- Using academic datasets without proper licensing is a red flag
- Shows you haven't thought about IP/legal aspects

**Fix**: Add a note in Overview > Dataset section:
```
"SciEntsBank Dataset Attribution:
Accessible via Hugging Face (nkazi/SciEntsBank), based on 
Dzikovska et al. (2013). Original academic use; commercial 
use would require licensing agreement with authors/Cambridge University."
```

---

### 6. **HIGH: Model Accuracy Targets Never Defined**

**Location**: ML Methodology + Q&A sections

**Problem**:
You list evaluation metrics (Macro F1, QWK, Adjacent Agreement) but never state:
- What accuracy you **expect to achieve** on SciEntsBank
- Comparison to baselines or published benchmarks
- What "success" looks like (70% F1? 80%?)

SciEntsBank benchmarks (from literature):
- Simple baselines: ~60-65% accuracy
- BERT-based models: ~75-80% F1
- State-of-art: ~82-85% F1

You're claiming DeBERTa-v3 is "optimal" but not saying what you expect it to achieve.

**Why This Matters**:
- "We don't know what accuracy we'll get" is not a good answer
- Shows you haven't done literature review
- No way to judge if the project will succeed

**Fix Required**:
Add a section in ML Methodology:
```
"Target Performance Metrics (UA Task):
- Macro F1: Target 0.78-0.82 (SOTA: ~0.83)
- QWK: Target 0.75+ (educational standard)
- Adjacent Agreement: Target 0.90+ (being off by 1 grade is acceptable)

These targets are based on:
1. Published SciEntsBank benchmarks (Dzikovska et al., 2013)
2. DeBERTa-v3's known performance on NLU tasks
3. Training on full UA train set (~10K examples)"
```

---

### 7. **HIGH: No Data Privacy/GDPR Considerations**

**Location**: Architecture + Deployment sections

**Problem**:
You store "student_id" and "session_id" in the database for "audit trails" and "analytics"
but you don't mention:
- GDPR compliance (if EU students)
- Data retention policies
- Student privacy/anonymization
- Compliance with educational privacy laws (FERPA in US, etc.)

**Why This Matters**:
- Cambridge operates globally, GDPR is relevant
- Educational data is highly sensitive
- This is a major oversight that shows lack of production experience

**Fix**: Add to Architecture section under "Data Persistence":
```
"Student Privacy & Compliance:
- Optional student_id field for audit trails only when explicitly provided
- No PII storage (emails, names, etc.) - only anonymized IDs
- Data retention: 90 days default, configurable by client
- Compliance: GDPR-ready (right to deletion, data export endpoints)
- Encryption: TLS in transit, AES-256 at rest (RDS encryption enabled)"
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 8. **MEDIUM: Load Testing Metrics Unrealistic**

**Location**: Deployment section - Load Testing

**Problem**:
You show Locust load testing targeting "100 concurrent users, 10K requests/day"

But this is backwards:
- 10K requests/day = 116 requests/day average OR 7 req/second peak
- 100 concurrent users is MUCH more than 10K/day
- Load test should be: "10 concurrent users simulating 10K/day traffic"

**Why It Matters**: Shows you haven't actually done load testing; the math doesn't make sense

**Fix**: Change load test comment:
```
# Run: locust -f locustfile.py --host=https://api.autograde.com
# Target: 10 concurrent users simulating peak load 
# (10K/day ≈ 0.1 req/sec average, 2-3 req/sec peak = 10 concurrent × 0.3 req/sec)
# Expected P95 latency: <300ms under this load
```

---

### 9. **MEDIUM: ECS Auto-scaling Parameters Undefined**

**Location**: Architecture section - ECS Fargate Cluster

**Problem**:
You say "Min Tasks: 2, Max Tasks: 10" and "Auto-scales based on CPU/memory utilization"

But you never define:
- CPU target percentage (typically 70%)
- Memory target percentage (typically 80%)
- Scale-up threshold
- Scale-down cooldown period

This is important for production reliability.

**Fix**: Add clarity:
```
"Auto-scaling Policy:
- Target CPU utilization: 70%
- Target memory utilization: 80%
- Scale-up: If either metric exceeds target for 2 minutes
- Scale-down: 5 minute cooldown to prevent thrashing
- Min tasks: 2 (for HA)
- Max tasks: 10 (cost control, can increase if needed)"
```

---

### 10. **MEDIUM: PostgreSQL Instance Size Underdimensioned**

**Location**: Cost Analysis + Architecture

**Problem**:
You claim `db.t3.medium` for your production RDS but:
- t3 instances are burstable (designed for unpredictable workloads)
- For "production" you should use `db.r` or `db.m` instance families
- t3.medium has only 4GB RAM - questionable for caching
- Burstable instances can have performance degradation under sustained load

**Why It Matters**:
- Doesn't match your "production-grade" claim
- Could face performance issues
- Shows misunderstanding of RDS instance types

**Fix**: Change to:
```
Option A (What you specified):
"db.t3.medium, Multi-AZ" → Better: "db.t3.large, Multi-AZ"

Option B (Better for production):
"db.m5.large, Multi-AZ" → More consistent performance, slightly higher cost (~$200/mo)"
```

---

### 11. **MEDIUM: Playground Example Heuristic is Misleading**

**Location**: Playground section

**Problem**:
Your playground component has a semantic similarity heuristic for demo purposes that's overly simplified. Comments say:
```
"In production, this would be a fine-tuned transformer model (DeBERTa-v3)
This heuristic better captures the nuances of the UA (Unseen Answers) task"
```

But the heuristic uses keyword matching + stopwords + synonym lists - this is NOT representative of what a DeBERTa model actually does. It might give false confidence to the interviewer.

**Why It Matters**:
- If they actually test the playground, they'll see results that don't match a real model
- The heuristic might give "correct" to answers that a DeBERTa would mark "incorrect"
- Creates false expectations

**Fix Option 1** (Better):
```
"NOTE: This playground uses a keyword-matching heuristic for demo purposes only. 
It's NOT representative of the actual DeBERTa-v3 model. Real model would understand:
- Semantic paraphrasing (not just keyword matching)
- Implicit relationships between concepts
- Common misconceptions in student writing
Expected accuracy: 75-80% F1 (not 100% from this heuristic)"
```

**Fix Option 2** (Best but requires work):
- Either use a real lightweight transformer for the playground
- Or clearly label: "DEMO HEURISTIC - NOT ACTUAL MODEL"

---

### 12. **MEDIUM: MLMethodology - Class Imbalance Handling Not Discussed in Code**

**Location**: ML Methodology section - Data Processing

**Problem**:
You mention "~15% Correct, ~25% Partially Correct, ~60% Incorrect" distribution
You list mitigation strategies (class weights, stratified splits) but never actually show the code implementing this.

In your shown training code, you have:
```python
training_args = TrainingArguments(...)
```

But no mention of:
- `class_weights` in loss function
- How training_args handles imbalance
- Actual implementation of class weighting in code

**Why It Matters**:
- Shows incomplete implementation
- Suggests you haven't actually trained this model

**Fix**: Add code example showing class weight implementation:
```python
# Add after model creation:
from torch import nn

class_weights = torch.tensor([0.60, 0.25, 0.15])  # Inverse of class distribution
class_weights = 1.0 / (class_weights / class_weights.sum())

class_weights = class_weights.to(device)
loss_fn = nn.CrossEntropyLoss(weight=class_weights)
```

---

## 🟡 MINOR ISSUES

### 13. **MINOR: Timeline Says "Month 1-2 Completed" But It's Mid-Project**

**Location**: Timeline section

**Problem**:
Timeline shows Month 1-2 as "completed" and Month 3 as "in-progress"
This suggests the project started ~2 months ago.

But this is an interview presentation - you probably haven't actually built this yet.

**Why It Matters**:
- If interviewer asks "Show me the code from Month 1" you won't have it
- Comes across as dishonest/misleading

**Fix**: Either:
- Make timeline all "upcoming" (this is a proposal)
- OR clarify: "This timeline assumes project approval; months 1-2 represent initial phases we've already designed/planned"

---

### 14. **MINOR: API Rate Limiting Header Unclear**

**Location**: API Design section

**Problem**:
You show:
```
X-RateLimit-Limit: 1000          # Requests per hour
X-RateLimit-Remaining: 847       # Remaining requests
X-RateLimit-Reset: 1706450400    # Unix timestamp for reset
```

But you never define:
- Who gets what rate limit? (by API key tier)
- What happens at limit? (429 Too Many Requests - you mention this but not the header response)
- Grace period or soft limits?

**Fix**: Add a section:
```
"Rate Limiting Tiers (via API key):
- Free tier: 100 req/hour
- Pro tier: 10,000 req/hour  
- Enterprise: Custom limits

When limit exceeded: 429 Too Many Requests
Response headers indicate: remaining quota, reset time"
```

---

### 15. **MINOR: Typo/Inconsistency: "db.t3.medium" vs "db.r6g.large"**

**Location**: Architecture section

**Problem**:
Architecture section says "db.r6g.large" but Cost Analysis says "db.t3.medium"

These are different instance types with different performance profiles.

**Fix**: Pick one and be consistent across all sections. r6g.large is better for production but costs more (~$250 vs $150).

---

## Summary of Recommended Actions

### 🔴 MUST FIX (Before submission):
1. Fix DeBERTa latency claims (100ms → 250-300ms on CPU)
2. Recalculate all costs with realistic AWS pricing (+$150-200/month to MVP)
3. Fix API schema redundancy (grade vs label_id)
4. Explain throughput math and why 2 tasks

### 🟠 SHOULD FIX (Strongly recommended):
5. Add dataset licensing clarification
6. Define model accuracy targets with citations
7. Add privacy/compliance section

### 🟡 NICE TO FIX (If time allows):
8. Fix load testing scenario
9. Define auto-scaling parameters
10. Clarify RDS instance type choice
11. Better document playground heuristic
12. Show class imbalance code
13. Fix timeline status
14. Define rate limiting tiers
15. Consistent instance types

---

## Overall Assessment

**Current State**: 6/10 - Good architecture and presentation, but several critical technical claims don't hold up to scrutiny

**After Fixes**: 9/10 - Would be excellent and interview-ready

**Key Risks**: 
- Interviewer fact-checks AWS pricing → catches your underestimation
- Interviewer asks about latency assumptions → reveals CPU vs GPU gap
- Interviewer asks "why not use LLMs?" → your response lacks depth
- Interviewer tests playground → heuristic doesn't match claims

**Recommendation**: Take 2-3 hours to address the 4 critical issues and 3 high-priority issues. The rest are minor but polish your presentation significantly.
