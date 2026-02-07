# FILLIN_PROJECT_NAME - FILLIN_APP_DESCRIPTION

## Setup — Replace FILLIN Placeholders

This is a template repo. All project-specific values are marked with `FILLIN_*` placeholders. Search the entire codebase for `FILLIN` and replace each placeholder with real values. Ask the user for any values you don't know.

| Placeholder | Description |
|---|---|
| `FILLIN_PROJECT_PREFIX` | CDK stack name prefix (e.g. `"Myapp"`) |
| `FILLIN_PROJECT_NAME` | Lowercase project name (e.g. `"myapp"`) |
| `FILLIN_DOMAIN` | Production domain (e.g. `"myapp.com"`) |
| `FILLIN_AWS_ACCOUNT_ID` | Your AWS account ID |
| `FILLIN_AWS_REGION` | AWS region (e.g. `"us-west-2"`) |
| `FILLIN_HOSTED_ZONE_ID` | Route53 hosted zone ID |
| `FILLIN_JWT_SECRET` | Secret key for signing JWTs (generate a random 64+ char string) |
| `FILLIN_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `FILLIN_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `FILLIN_API_URL` | Backend API Gateway URL (set after first deploy) |
| `FILLIN_APP_NAME` | Display name in the UI (e.g. `"My App"`) |
| `FILLIN_APP_TITLE` | HTML page title |
| `FILLIN_APP_DESCRIPTION` | Meta description |
| `FILLIN_APP_OG_DESCRIPTION` | OpenGraph description |
| `FILLIN_APP_TAGLINE` | Landing page tagline |

After replacing all placeholders, update this CLAUDE.md itself to reflect the actual project name and description.

## Project Structure

```
FILLIN_PROJECT_NAME/
├── frontend/           # React + Vite + Chakra UI
├── python_backend/     # Python Lambda backend
├── cdk/                # AWS CDK infrastructure
├── brand-assets/       # Logo and brand files
└── CLAUDE.md
```

## Brand Assets

Logo files go in `brand-assets/`.
Generated favicon/icon sizes go in `frontend/public/`.

## Packages

### Frontend (frontend/)
React 19 application using Vite + Chakra UI v3 + React Router v7, deployed to FILLIN_DOMAIN

```bash
cd frontend
npm install
npm run dev      # Dev server on localhost:5173
npm run build    # Build for production (outputs to build/client/)
```

**Key Dependencies:**
- `@chakra-ui/react` (v3) - UI component library
- `react-router` (v7) - Framework mode with file-based routing
- `@react-router/dev` - React Router dev/build tooling
- `react-icons` - Icon library
- `framer-motion` - Animations (required by Chakra)

Structure:
```
frontend/
├── app/
│   ├── root.jsx           # Root layout (ChakraProvider, ErrorBoundary)
│   ├── routes.ts          # Route definitions
│   └── routes/
│       ├── home.jsx       # Landing page (SSG pre-rendered)
│       ├── admin.jsx      # Admin dashboard (protected)
│       ├── oauth-callback.jsx  # OAuth callback handler
│       └── profile.jsx    # /{username} public page
├── src/
│   ├── api/
│   │   └── client.js      # API client (all backend calls)
│   ├── components/        # Reusable components
│   ├── context/           # React contexts (Auth, etc.)
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   └── config.js          # Environment config (API URL)
├── public/                # Static assets
├── package.json
├── vite.config.js
├── react-router.config.ts # SSR disabled, SSG for landing page
└── eslint.config.js
```

### Python Backend (python_backend/)
Python Lambda function served via API Gateway

```bash
cd python_backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
make test        # Run tests
make lint        # Run linting
make build       # Build deployment.zip for Lambda
```

**Key Dependencies:**
- `boto3` / `botocore` - AWS SDK (DynamoDB, S3)
- `aws-lambda-powertools` - Logging, tracing utilities
- `PyJWT` - JWT token creation/validation
- `bcrypt` - Password hashing
- `requests` - HTTP client for OAuth

Structure:
```
python_backend/src/python_backend/
├── __init__.py
├── handler.py         # Lambda entry point
├── router.py          # Action-based request routing
├── auth.py            # Google OAuth handlers
├── db.py              # DynamoDB operations
├── logging_config.py  # Logging setup
└── utils.py           # JWT, CORS, response helpers
```

### CDK Infrastructure (cdk/)
AWS CDK TypeScript project for deploying all infrastructure

```bash
cd cdk
npm install
npm run build    # Compile TypeScript
cdk synth        # Synthesize CloudFormation
cdk deploy --all # Deploy all stacks to AWS
```

Structure:
```
cdk/
├── bin/
│   └── cdk-main.ts       # Entry point - instantiates stacks
├── lib/
│   ├── certificate.ts    # CertificateStack (ACM certificate in us-east-1)
│   ├── frontend.ts       # FrontendStack (S3 + CloudFront + Route53)
│   └── backend.ts        # BackendStack (Lambda + API Gateway + DynamoDB)
├── deploy.sh
├── cdk.json
├── package.json
└── tsconfig.json
```

Stacks:
- **FILLIN_PROJECT_PREFIX CertificateStack**: ACM certificate with DNS validation (deployed to us-east-1 for CloudFront)
- **FILLIN_PROJECT_PREFIX FrontendStack**: S3 bucket, CloudFront distribution (with SPA fallback), Route53 A record for FILLIN_DOMAIN
- **FILLIN_PROJECT_PREFIX BackendStack**: Lambda function, API Gateway REST API, UsersTable (DynamoDB)

## Domain
- Production: FILLIN_DOMAIN (Route53 hosted zone configured)

## Deployment

### Prerequisites
1. AWS CLI configured with credentials
2. CDK bootstrapped in target account/region
3. Domain registered and hosted zone created in Route53

### Build & Deploy
```bash
cd cdk
./deploy.sh            # Build all and deploy
./deploy.sh --frontend # Skip backend, deploy frontend only
./deploy.sh --backend  # Skip frontend, deploy backend only
```

---

## Architecture & Design Decisions

### Overview
FILLIN_APP_DESCRIPTION. Users sign in via Google OAuth and access a protected dashboard.

### Authentication
- **Google OAuth** for user authentication
- **JWT tokens** for session management, stored in localStorage
- OAuth flow: Frontend redirects to Google → Google redirects to `/oauth/callback` → Backend validates, creates JWT → Frontend stores token

### URL Structure
- `/` - Landing page (public)
- `/admin` - Dashboard (requires auth)
- `/{username}` - Public profile page

### DynamoDB Schema
All tables use PAY_PER_REQUEST billing. **No table scans allowed.**

**UsersTable** (PK: `userEmail`)
- Stores user profile data
- GSI on `username` for public profile lookups

### API Design
Single Lambda with action-based routing via `POST /api`:
```json
{
  "action": "getMe",
  "payload": { ... }
}
```

**Auth Actions** (public):
- `googleAuthUrl`, `googleCallback` - Google OAuth flow

**User Actions:**
- `getPublicProfile` (public), `getMe` (auth required)


### Frontend Routes
Using React Router v7 framework mode:
- `/` → Landing page (SSG pre-rendered)
- `/oauth/callback` → OAuth callback handler
- `/admin` → Dashboard (protected)
- `/:username` → Public profile page

### Implementation Details

**JWT Configuration**
- 30-day expiry for tokens
- Signed with HS256 algorithm
- Contains `email` and `exp` claims

**React Router v7 Framework Mode**
- Routes defined in `app/routes.ts`
- Root layout in `app/root.jsx` (ChakraProvider wrapping)
- SSR disabled, SSG for landing page only
- Build output in `build/client/` (deployed to S3)

**Frontend State Management**
- AuthContext for global auth state
- JWT token stored in localStorage
