#!/bin/bash

# Script to start both Django backend and Svelte frontend

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  SmartFit Coach - Starting Application  ${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to terminate child processes when script is interrupted
cleanup() {
    echo -e "\n${RED}Interrupt detected. Shutting down servers...${NC}"
    kill 0
    exit
}

trap cleanup SIGINT SIGTERM

# Start Django Backend
echo -e "${GREEN}[Backend]${NC} Starting Django server..."
cd backend

# Activate virtual environment if exists, otherwise create it
if [ -d "venv" ]; then
    source venv/bin/activate
    echo -e "${GREEN}[Backend]${NC} Virtual environment activated"
else
    echo -e "${RED}[Backend]${NC} Virtual environment not found. Creating it..."
    python3 -m venv venv
    source venv/bin/activate
    echo -e "${GREEN}[Backend]${NC} Virtual environment created and activated"

    # Install dependencies if requirements.txt exists
    if [ -f "requirements.txt" ]; then
        echo -e "${GREEN}[Backend]${NC} Installing dependencies from requirements.txt..."
        pip install -r requirements.txt
        echo -e "${GREEN}[Backend]${NC} Dependencies installed"
    fi
fi

# Start Django
python manage.py runserver &
BACKEND_PID=$!
echo -e "${GREEN}[Backend]${NC} Django server started (PID: $BACKEND_PID)"

cd ..

# Start Svelte Frontend
echo -e "${BLUE}[Frontend]${NC} Starting Svelte server..."
cd frontend

# Check if node_modules exists, otherwise install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}[Frontend]${NC} node_modules not found. Installing dependencies..."
    npm install
    echo -e "${BLUE}[Frontend]${NC} Dependencies installed"
fi

# Start Svelte in dev mode
npm run dev &
FRONTEND_PID=$!
echo -e "${BLUE}[Frontend]${NC} Svelte server started (PID: $FRONTEND_PID)"

cd ..

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Application started successfully!   ${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Backend Django:  http://localhost:8000"
echo -e "Frontend Svelte: http://localhost:5173"
echo -e "\nPress Ctrl+C to terminate both servers\n"

# Wait for processes to finish
wait
