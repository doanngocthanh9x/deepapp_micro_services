#!/bin/bash

echo "🔍 Finding process on port 3000..."
echo ""

# Try to find and kill using different methods
echo "Method 1: pkill by command..."
pkill -9 -f "node.*server" 2>/dev/null && echo "✓ Killed node server processes" || echo "  No processes found"

echo ""
echo "Method 2: Killing all node processes..."
pkill -9 node 2>/dev/null && echo "✓ Killed all node processes" || echo "  No node processes found"

echo ""
echo "Waiting for port to be freed..."
sleep 3

echo ""
echo "✓ Cleanup complete!"
echo ""
echo "Checking if port 3000 is free..."
if nc -z localhost 3000 2>/dev/null; then
    echo "❌ Port 3000 still in use"
else
    echo "✅ Port 3000 is free"
fi

echo ""
echo "Starting server..."
cd /workspaces/deepapp_micro_services/services/node-api-gateway
npm run dev
