# AutoGrade MVP - Automated Short-Answer Grading Service

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/kgvega-4207s-projects/automated-grading-service)

## Overview

A production-ready ML service MVP that evaluates student responses to scientific questions by comparing against reference answers. Built as an interview presentation for Cambridge University Press & Assessment.

### Key Features

- **3-Way Classification**: Correct, Partially Correct, Incorrect
- **SciEntsBank Dataset**: Optimized for Unseen Answers (UA) task
- **Production Architecture**: FastAPI, PyTorch/Transformers, AWS deployment
- **Scalable Design**: 10K/day MVP target, designed for 100K+ throughput
- **Real-time Processing**: <1s P95 latency target

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS, shadcn/ui
- **Backend** (Documented): FastAPI, SQLAlchemy, Pydantic
- **ML Stack** (Documented): PyTorch, Transformers (DeBERTa-v3), scikit-learn
- **Infrastructure**: AWS ECS, RDS PostgreSQL, ElastiCache, CloudWatch

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Deployment

The project is automatically deployed to Vercel on push to main branch.

Live Demo: [https://vercel.com/kgvega-4207s-projects/automated-grading-service](https://vercel.com/kgvega-4207s-projects/automated-grading-service)

## Project Structure

- `/app` - Next.js application pages and layouts
- `/components` - React components including sections and UI elements
- `/components/sections` - Documentation sections (Architecture, ML Methodology, API Design, etc.)
- `/lib` - Utility functions
- `/public` - Static assets

## License

Created by Kevin Vega for Cambridge University Press & Assessment interview process.