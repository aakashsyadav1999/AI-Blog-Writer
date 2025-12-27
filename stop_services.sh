#!/bin/bash

# AI Blog Writer - Stop All Services

echo "Stopping all services..."

# Read PIDs from file if it exists
if [ -f .service_pids ]; then
    while IFS= read -r pid
    do
        if ps -p $pid > /dev/null; then
            echo "Stopping process $pid..."
            kill $pid
        fi
    done < .service_pids
    rm .service_pids
fi

# Fallback: Kill by port
echo "Cleaning up any remaining processes on ports..."
lsof -ti:8001 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "All services stopped."

