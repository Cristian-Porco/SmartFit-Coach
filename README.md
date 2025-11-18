# SmartFit Coach

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.0-green?logo=django&logoColor=white)
![SvelteKit](https://img.shields.io/badge/SvelteKit-2.0-orange?logo=svelte&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-AI-purple?logo=chainlink&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

A web application that leverages AI and machine learning to create personalized workout and nutrition plans. Built with Django, PostgreSQL, LangChain, LLM, and SvelteKit to ensure high performance, a modern user experience, and a scalable, secure architecture.

## Overview

In today's context, where physical well-being and nutrition play an increasingly central role in people's lives, technology has enabled an innovative approach to managing training and diet. The growing adoption of artificial intelligence (AI) has opened new opportunities to improve the effectiveness and personalization of fitness and nutrition programs, meeting the needs of users with diverse goals and requirements.

**SmartFit Coach** was created with the intent to revolutionize how people manage their training and nutrition journey. It is a management application designed for gyms, personal trainers, and individual users, combining advanced monitoring tools with personalized suggestions to optimize performance and overall well-being.

Thanks to AI integration, SmartFit Coach can analyze data related to physical parameters, progress, and eating habits, offering adaptive workout routines and nutritional plans. The goal is to provide constant and dynamic support, improving motivation and maximizing results.

This document explores in detail the application's features, the benefits for different types of users, and the technologies that make it possible. With a data-driven and personalization-focused approach, SmartFit Coach positions itself as an essential ally for anyone looking to improve their fitness intelligently and effectively.

**[Complete Thesis Documentation (Italian)](thesis.pdf)** - Detailed academic documentation of the project in Italian.

## Features

- **AI-Powered Personalization**: Uses advanced language models to generate customized fitness and nutrition plans
- **Machine Learning Integration**: Leverages LangChain and LLM for intelligent recommendations
- **Modern Tech Stack**: Django REST backend with SvelteKit frontend
- **Scalable Architecture**: Designed for performance and growth
- **Secure**: Built with security best practices

## Technology Stack

### Backend
- **Django**: Python web framework for robust backend development
- **PostgreSQL**: Reliable and powerful database system
- **LangChain**: Framework for building LLM-powered applications
- **LLM Integration**: Advanced language models for personalized content generation

### Frontend
- **SvelteKit**: Modern, reactive JavaScript framework
- **Vite**: Fast build tool and development server
- **Three.js**: 3D graphics and visualizations
- **Chart.js**: Data visualization
- **D3.js**: Advanced data-driven graphics

## Project Structure

```
SmartFit-Coach/
├── backend/                 # Django backend application
│   ├── SmartFit_Coach_BE/  # Main Django project
│   ├── data/               # Data files and datasets
│   ├── media/              # User uploaded media
│   ├── venv/               # Python virtual environment
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   └── db.sqlite3          # SQLite database (development)
│
├── frontend/               # SvelteKit frontend application
│   ├── src/               # Source code
│   ├── static/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
│
├── run.sh                 # Script to start both backend and frontend
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Getting Started

### Prerequisites

- **Python 3.8+**: Required for Django backend
- **Node.js 16+**: Required for SvelteKit frontend
- **npm**: Node package manager

### Quick Start

The easiest way to start the application is using the provided startup script:

```bash
./run.sh
```

This script will automatically:
1. Create a Python virtual environment if it doesn't exist
2. Install backend dependencies from `requirements.txt`
3. Install frontend dependencies from `package.json`
4. Start the Django development server on port 8000
5. Start the Svelte development server on port 5173

### Accessing the Application

Once both servers are running, you can access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin-2cqXiJ2wUi6Lw3ZiGf1s4Ak37m8ziov0/

### Default Administrator Credentials

```
Username: root
Password: root
```

⚠️ **Important**: Change these credentials in production environments!

## Manual Setup

If you prefer to set up the environments manually:

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Stopping the Application

If you used `run.sh` to start the application, simply press `Ctrl+C` in the terminal. The script will gracefully shut down both servers.

## Development

### Backend Development

- Django admin interface available at `/admin`
- REST API endpoints documented in the backend code
- Database migrations: `python manage.py makemigrations && python manage.py migrate`

### Frontend Development

- Hot module replacement enabled by default
- Component files in `frontend/src/`
- Build for production: `npm run build`

## Environment Variables

The backend requires OpenAI API credentials to enable AI-powered features. Configure the `.env` file in the backend directory:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create the `.env` file:
   ```bash
   touch .env
   ```

3. Add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

⚠️ **Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.