#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Node.js API Gateway Setup${NC}"
echo "================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Kill any existing process on port 3000
echo -e "${YELLOW}Cleaning up port 3000...${NC}"
pkill -f "node server.js" 2>/dev/null || true
lsof -i :3000 2>/dev/null | awk 'NR>1 {print $2}' | xargs kill -9 2>/dev/null || true
sleep 2

# Check if MySQL is running
echo -e "${YELLOW}Checking MySQL connection...${NC}"
if timeout 3 bash -c "</dev/tcp/localhost/3306" 2>/dev/null; then
    echo -e "${GREEN}✓ MySQL is running${NC}"
else
    echo -e "${YELLOW}⚠ MySQL is not running on localhost:3306${NC}"
    echo -e "${YELLOW}To use Docker:${NC}"
    echo "  cd docker/php_admin_mysql"
    echo "  docker-compose up -d"
    echo ""
fi

echo -e "${YELLOW}Starting server...${NC}"
echo ""
npm run dev
