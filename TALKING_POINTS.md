# Interview Talking Points - AutoGrade MVP

## Opening Statement
"AutoGrade MVP is a production-ready ML service that evaluates student responses to scientific questions using a fine-tuned DeBERTa-v3-base model on the SciEntsBank dataset. We target 10K submissions/day with sub-1-second latency at under $700/month. The architecture is designed to scale to 100K+ daily submissions while maintaining high availability and GDPR compliance."

---

## Key Metrics You'll Be Asked About

### Performance
- **Model Accuracy**: 78-82% F1 (macro) on Unseen Answers task
  - *Based on*: DeBERTa-v3 performance on similar NLU tasks + SciEntsBank benchmarks (Dzikovska et al., 2013)
  - *Compared to*: Simple baselines (~65% F1), BERT models (~78% F1), SOTA (~85% F1)
  
- **Latency**: 250-300ms P95 on CPU
  - *Why CPU?*: DeBERTa-v3-base has 86M parameters, needs ~250-300ms inference
  - *GPU option?*: T4 GPU brings it to <100ms but adds ~$200/month
  - *Meets target?*: Yes, <1 second target with room for queueing/overhead
  
- **Throughput**: 10K submissions/day MVP, scales to 100K+
  - *Why 2 ECS tasks?*: High Availability (fail-safe design), not capacity
  - *Auto-scaling*: 70% CPU/80% memory threshold, 2-10 tasks

### Cost
- **MVP**: $695/month for 10K/day capacity
  - ECS Fargate: $260 (2 tasks × 2vCPU/4GB)
  - RDS PostgreSQL: $280 (db.t3.large, Multi-AZ)
  - ElastiCache Redis: $45 (rate limiting + caching)
  - ALB + CloudWatch + Data Transfer: $110
  
- **Scaled (100K/day)**: ~$2,500/month
  - Proportional increase, still economically viable

- **Per-submission cost**: 
  - MVP: ~$2.08/1000 submissions
  - Scaled: ~$0.75/1000 submissions

---

## Technical Deep Dives

### Why DeBERTa-v3?
- **Disentangled attention**: Better semantic similarity between reference & student answers
- **Enhanced mask decoder**: Catches partial matches and paraphrasing
- **Balance**: 86M parameters = accuracy + reasonable latency (250-300ms P95)
- **Fine-tuning efficiency**: Converges in 5-10 epochs (~4-6 hours GPU training)

### Why Not LLMs (GPT-4, Claude)?
- **Latency**: 2-5 seconds (violates <1s target)
- **Cost**: $0.01+ per request (vs $0.002/request for DeBERTa)
- **Dependency**: API availability, rate limits, data privacy concerns
- **Control**: Less control over predictions, harder to debug

### Why FastAPI + PostgreSQL + Redis?
- **FastAPI**: Async-first (handles I/O from ML inference), automatic OpenAPI docs
- **PostgreSQL**: Structured data, ACID compliance for audit trails, relational queries
- **Redis**: Token bucket rate limiting, optional response caching

---

## Architecture Highlights

### High Availability
- **Multi-AZ deployment**: RDS standby in different AZ
- **Minimum 2 ECS tasks**: If one fails, service stays up
- **Auto-healing**: ECS replaces failed tasks automatically
- **Load balancing**: ALB distributes traffic

### Scalability
- **Auto-scaling**: 2-10 tasks based on CPU/memory utilization
- **Stateless**: Tasks don't hold state, easy to add/remove
- **Data**: RDS scales via read replicas, Redis for hot data

### Compliance & Privacy
- **GDPR**: Optional student_id, deletion endpoints, 90-day retention
- **Encryption**: TLS 1.3 in transit, AES-256 at rest
- **Anonymization**: No PII storage (emails, names, etc.)
- **Audit trails**: All submissions logged for compliance

---

## If They Ask About Weaknesses

### "Your accuracy target (78-82%) is below SOTA (85%)"
**Answer**: "That's intentional. SOTA models require massive compute or API dependencies. 78-82% is achievable with fine-tuning in 6 hours and aligns with practical deployment constraints. We can improve to 83-85% post-MVP with model ensembles or LLM integration for feedback."

### "250-300ms latency seems slow"
**Answer**: "That's the inference time. Total API latency is ~300-400ms including serialization and DB writes. For <100ms, we offer GPU deployment (+$200/month). Most educational use cases (batch grading, feedback loops) are fine with 300-500ms."

### "DeBERTa on SciEntsBank hasn't been published"
**Answer**: "You're right - DeBERTa hasn't been specifically benchmarked on SciEntsBank in my knowledge. Our 78-82% target is a conservative estimate based on: (1) DeBERTa performance on similar semantic similarity tasks, (2) published BERT baselines on SciEntsBank (~76-78%), (3) DeBERTa's known improvement over BERT (2-4% typically). We're planning to publish results post-MVP."

### "What about model drift/accuracy degradation?"
**Answer**: "We monitor prediction distribution in CloudWatch (% correct/partial/incorrect per hour). Large deviations trigger alerts. We also log confidence scores (post-MVP) and collect SME feedback for continuous retraining. Shadow mode (1-2 weeks) before production handles any drift issues."

---

## The API You're Serving

### Simple & Clean
```
POST /v1/grade

Request:
{
  "question": "...",
  "reference_answer": "...",
  "student_answer": "...",
  "metadata": {...}  // optional
}

Response:
{
  "request_id": "req_...",
  "grade": "correct|partially_correct|incorrect",
  "processed_at": "2026-01-28T14:30:00Z",
  "processing_time_ms": 245,
  "model_version": "v1.2.0"
}
```

### Rate Limiting
- Free: 100 req/hour
- Pro: 10,000 req/hour
- Enterprise: Custom
- HTTP 429 when exceeded

---

## Timeline Realism

**Proposal Timeline** (assuming approval):
- **Month 1-2**: Infrastructure, data pipeline, model baseline
- **Month 3**: FastAPI service, databases, auth
- **Month 4**: Integration, load testing, optimization
- **Month 5**: Staging deployment, SME validation
- **Month 6**: Production launch, team handoff

**Key milestone**: Month 2 baseline should hit 78-82% F1 target

---

## Closing Statement
"AutoGrade MVP demonstrates a pragmatic approach to production ML: realistic latency/accuracy tradeoffs, transparent costs, proper engineering (HA, monitoring, compliance), and a clear path to 100K daily submissions. We're not pushing for maximum accuracy at any cost—we're building a service Cambridge can deploy, maintain, and scale."

---

## If They Pull Up the Playground

"This is a keyword-matching heuristic for demo purposes—not the actual model. The real DeBERTa-v3 model will understand semantic paraphrasing, implicit relationships, and common misconceptions that this heuristic misses. We've chosen to be transparent about this limitation rather than hide it."

**If playground grades incorrectly**: "That's actually illustrating the value of the DeBERTa model. This heuristic would fail in production, which is why we need the actual transformer."

---

## Questions You Should Ask Them

If there's time, show you're thinking strategically:
1. "What's your target timeline for MVP launch?"
2. "Are there specific science domains beyond what SciEntsBank covers?"
3. "What's the expected volume growth? Should we plan for 100K/day from day one?"
4. "Do you need interpretability (why was this marked incorrect)?"
5. "Any FERPA or international privacy requirements beyond GDPR?"

---

## Things NOT to Say

- ❌ "DeBERTa is 100ms on CPU" (you fixed this - it's 250-300ms)
- ❌ "We don't know how accurate the model will be" (you now have targets)
- ❌ "The playground is exactly like the real model" (it's a heuristic demo)
- ❌ "We haven't thought about privacy" (you have - GDPR section added)
- ❌ "MVP costs $445/month" (realistic: $695/month)
- ❌ "2 tasks because we needed it" (it's for HA, not capacity)
- ❌ "The project is already completed" (timeline is all "upcoming")

---

## Success Metrics

You nailed the interview if they say:
- "This shows real production experience"
- "The cost breakdown is realistic"
- "You've clearly thought about compliance"
- "The accuracy targets are well-grounded"
- "This architecture would actually work at scale"

**You're ready. Go get them!** 💪
