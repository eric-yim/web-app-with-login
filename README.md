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

Give your AI coding agent this repo URL and ask it to clone and customize:

```
Clone https://github.com/eric-yim/web-app-with-login.git and customize it for my project.
```

All project-specific values are marked with `FILLIN_*` placeholders. Your agent will search for these and replace them with your values:

| Placeholder | Description |
|---|---|
| `FILLIN_PROJECT_PREFIX` | CDK stack name prefix (e.g. `"Myapp"`) |
| `FILLIN_PROJECT_NAME` | Lowercase project name (e.g. `"myapp"`) |
| `FILLIN_DOMAIN` | Production domain (e.g. `"myapp.com"`) |
| `FILLIN_AWS_ACCOUNT_ID` | Your AWS account ID |
| `FILLIN_AWS_REGION` | AWS region (e.g. `"us-west-2"`) |
| `FILLIN_HOSTED_ZONE_ID` | Route53 hosted zone ID |
| `FILLIN_JWT_SECRET` | Secret key for signing JWTs |
| `FILLIN_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `FILLIN_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `FILLIN_API_URL` | Backend API Gateway URL (set after first deploy) |
| `FILLIN_APP_NAME` | Display name in the UI (e.g. `"My App"`) |
| `FILLIN_APP_TITLE` | HTML page title |
| `FILLIN_APP_DESCRIPTION` | Meta description |
| `FILLIN_APP_OG_DESCRIPTION` | OpenGraph description |
| `FILLIN_APP_TAGLINE` | Landing page tagline |
