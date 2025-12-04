#!/bin/bash

# Simple port cleanup - kill all node processes
echo "Killing all Node.js processes..."
pkill -9 node 2>/dev/null
sleep 2

echo "✓ Done! Port should be free now."
echo ""
echo "Run: npm run dev"
