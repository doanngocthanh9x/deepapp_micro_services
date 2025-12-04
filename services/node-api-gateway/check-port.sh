#!/bin/bash

# Check port status
PORT=${1:-3000}

echo "Checking port $PORT..."
echo ""

# Check if port is in use
if nc -z localhost $PORT 2>/dev/null; then
    echo "❌ Port $PORT is IN USE"
    echo ""
    echo "Finding process..."
    if command -v lsof &> /dev/null; then
        echo ""
        lsof -i :$PORT
    fi
else
    echo "✅ Port $PORT is FREE"
fi

echo ""
echo "Usage: bash check-port.sh [PORT_NUMBER]"
echo "Example: bash check-port.sh 3000"
