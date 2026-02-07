# Web App with Login

A ready-to-deploy starter template for building a web application with Google OAuth login. Includes a React frontend, Python Lambda backend, and AWS CDK infrastructure — all wired together.

## What's Included

- **Frontend** — React 19 + Vite + Chakra UI v3 + React Router v7 (framework mode)
  - Google OAuth login modal
  - Auth context with JWT token management
  - Protected admin dashboard
  - Public profile pages (`/:username`)
  - SSG pre-rendered landing page

- **Python Backend** — AWS Lambda + API Gateway
  - Google OAuth flow (auth URL generation, callback handling)
  - JWT token creation and verification
  - DynamoDB user storage
  - Action-based API routing (`POST /api`)
  - Tests included

- **CDK Infrastructure** — AWS CDK (TypeScript)
  - S3 + CloudFront for frontend hosting
  - ACM certificate with DNS validation
  - Route53 DNS records
  - Lambda + API Gateway for backend
  - DynamoDB users table
  - One-command deploy script

## Getting Started

Give your AI coding agent this repo URL:

```
Clone https://github.com/eric-yim/web-app-with-login.git and read CLAUDE.md
```

`CLAUDE.md` contains the full placeholder reference table and project documentation. Your agent will know exactly what to do.
