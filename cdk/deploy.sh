#!/bin/bash
set -e  # Exit immediately on error

# Parse arguments
SKIP_FRONTEND=false
SKIP_BACKEND=false

for arg in "$@"; do
  case $arg in
    --frontend)
      SKIP_BACKEND=true
      ;;
    --backend)
      SKIP_FRONTEND=true
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Usage: $0 [--frontend | --backend]"
      exit 1
      ;;
  esac
done

# Frontend build
if [ "$SKIP_FRONTEND" = false ]; then
  echo "Building frontend..."
  cd ../frontend
  npm run build || { echo "Frontend build failed"; exit 1; }
  cd - > /dev/null
else
  echo "Skipping frontend build."
fi

# Backend build
if [ "$SKIP_BACKEND" = false ]; then
  echo "Building python_backend..."
  cd ../python_backend
  make build || { echo "Python backend build failed"; exit 1; }
  cd - > /dev/null
else
  echo "Skipping backend build."
fi

# CDK deploy
echo "Deploying CDK stack..."
cdk deploy --all
