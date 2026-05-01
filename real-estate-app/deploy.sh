#!/bin/bash

echo "🚀 Real Estate App - Quick Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Step 1: Checking prerequisites...${NC}"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Not a git repository. Please run 'git init' first.${NC}"
    exit 1
fi

# Check if code is committed
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Warning: You have uncommitted changes.${NC}"
    echo -e "${YELLOW}Please commit your changes before deploying.${NC}"
    echo ""
    echo "Run these commands:"
    echo "  git add ."
    echo "  git commit -m 'Prepare for deployment'"
    echo "  git push origin main"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}Step 2: Pushing code to GitHub...${NC}"
git push origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to push to GitHub. Please check your git configuration.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Code pushed to GitHub successfully!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Go to https://railway.app and create a new project"
echo "2. Connect your GitHub repository"
echo "3. Railway will auto-deploy your backend"
echo "4. Set environment variables in Railway dashboard (see .env.production)"
echo "5. Go to https://vercel.com and deploy your frontend"
echo "6. Update CORS_ORIGIN and FRONTEND_URL in Railway with your Vercel URL"
echo ""
echo -e "${GREEN}🎉 Ready for deployment!${NC}"