#!/bin/bash

echo "🛑 Killing all Node processes..."
pkill -9 node 2>/dev/null
echo "✓ All Node processes killed"
echo ""
echo "Waiting 3 seconds..."
sleep 3
echo ""
echo "✓ Ready! Now run: npm run dev"
