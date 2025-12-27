#!/bin/bash

# AI Blog Writer - Integration Startup Script
# This script starts all three services: AI/ML Backend, Django Backend, and Frontend

echo "=========================================="
echo "AI Blog Writer - Starting All Services"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}Warning: Port $1 is already in use${NC}"
        return 1
    fi
    return 0
}

# Check required ports
echo -e "${BLUE}Checking ports...${NC}"
check_port 8001 || echo "  AI/ML Backend port (8001) in use"
check_port 8000 || echo "  Django Backend port (8000) in use"
check_port 5173 || echo "  Frontend port (5173) in use"
echo ""

# Start AI/ML Backend (FastAPI)
echo -e "${GREEN}1. Starting AI/ML Backend (FastAPI on port 8001)...${NC}"
cd ai_ml_backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
python -m uvicorn src.fastapi_app:app --host 0.0.0.0 --port 8001 --reload &
AI_PID=$!
echo "AI/ML Backend started (PID: $AI_PID)"
deactivate
cd ..
echo ""

# Wait a moment for AI backend to start
sleep 2

# Start Django Backend
echo -e "${GREEN}2. Starting Django Backend (port 8000)...${NC}"
cd django_backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
echo "Running migrations..."
python manage.py migrate > /dev/null 2>&1
python manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!
echo "Django Backend started (PID: $DJANGO_PID)"
deactivate
cd ..
echo ""

# Wait a moment for Django to start
sleep 3

# Start Frontend (React/Vite)
echo -e "${GREEN}3. Starting Frontend (Vite on port 5173)...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install > /dev/null 2>&1
fi
npm run dev &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"
cd ..
echo ""

echo "=========================================="
echo -e "${GREEN}All services started successfully!${NC}"
echo "=========================================="
echo ""
echo "Services:"
echo "  🤖 AI/ML Backend:  http://localhost:8001"
echo "  🔧 Django Backend: http://localhost:8000"
echo "  🌐 Frontend:       http://localhost:5173"
echo ""
echo "API Documentation:"
echo "  FastAPI Docs:      http://localhost:8001/docs"
echo "  Django Admin:      http://localhost:8000/admin"
echo ""
echo "Process IDs:"
echo "  AI/ML Backend:  $AI_PID"
echo "  Django Backend: $DJANGO_PID"
echo "  Frontend:       $FRONTEND_PID"
echo ""
echo "To stop all services, run: ./stop_services.sh"
echo "Or press Ctrl+C and run: pkill -P $$"
echo ""

# Save PIDs to file for stop script
echo "$AI_PID" > .service_pids
echo "$DJANGO_PID" >> .service_pids
echo "$FRONTEND_PID" >> .service_pids

# Wait for user to stop
wait

