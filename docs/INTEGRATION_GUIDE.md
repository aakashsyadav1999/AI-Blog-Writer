# AI Blog Writer - Full Stack Integration Guide

## Overview

This project consists of three main components that work together:

1. **AI/ML Backend** (FastAPI) - Port 8001
2. **Django Backend** (Django REST Framework) - Port 8000
3. **Frontend** (React + Vite) - Port 5173

## Architecture

```
┌─────────────┐
│   Frontend  │ (React/TypeScript)
│  Port 5173  │
└──────┬──────┘
       │ HTTP Requests
       ▼
┌─────────────┐
│   Django    │ (Backend API)
│  Port 8000  │
└──────┬──────┘
       │ Proxies AI Requests
       ▼
┌─────────────┐
│   FastAPI   │ (AI/ML Service)
│  Port 8001  │
└─────────────┘
```

## Integration Points

### 1. AI/ML Backend (FastAPI)

**Endpoints:**
- `POST /api/v1/generate` - Generate article from title
- `POST /api/v1/improve` - Improve text readability
- `POST /api/v1/summarize` - Summarize text
- `POST /api/v1/batch` - Process batch of items
- `GET /api/v1/health` - Health check

**Location:** `/ai_ml_backend/src/fastapi_app.py`

### 2. Django Backend (Proxy Layer)

**AI Proxy Endpoints:**
- `POST /api/ai/generate/` - Proxies to FastAPI generate endpoint
- `POST /api/ai/improve/` - Proxies to FastAPI improve endpoint
- `POST /api/ai/summarize/` - Proxies to FastAPI summarize endpoint
- `POST /api/ai/batch/` - Proxies to FastAPI batch endpoint
- `GET /api/ai/health/` - Proxies to FastAPI health check

**Features:**
- Authentication required (JWT)
- Automatic logging of AI interactions
- Error handling and retry logic

**Location:** 
- Views: `/django_backend/blog/views.py`
- Service Client: `/django_backend/blog/ai_service.py`
- URLs: `/django_backend/blog/urls.py`

### 3. Frontend (React)

**AI Service Methods:**
```typescript
import { aiService } from './services/api';

// Generate article
const result = await aiService.generateArticle("My Title");

// Improve text
const improved = await aiService.improveText("Some text");

// Summarize text
const summary = await aiService.summarizeText("Long text");

// Batch process
const batch = await aiService.batchProcess([
  { title: "Title 1", action: "generate" },
  { title: "Text 2", action: "improve" }
]);

// Health check
const health = await aiService.healthCheck();
```

**Location:** `/frontend/src/services/api.ts`

## Quick Start

### Option 1: Using the Startup Script (Recommended)

```bash
# Make the script executable
chmod +x start_services.sh stop_services.sh

# Start all services
./start_services.sh

# Stop all services
./stop_services.sh
```

### Option 2: Manual Startup

**Terminal 1 - AI/ML Backend:**
```bash
cd ai_ml_backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn src.fastapi_app:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Django Backend:**
```bash
cd django_backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Django Backend (.env)

```env
AI_BACKEND_URL=http://localhost:8001
DEBUG=True
SECRET_KEY=your-secret-key
```

### AI/ML Backend (.env)

```env
# Add your Google Cloud/AI credentials here if needed
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

## Testing the Integration

### 1. Check Services are Running

```bash
# AI/ML Backend
curl http://localhost:8001/api/v1/health

# Django Backend
curl http://localhost:8000/api/ai/health/

# Frontend
curl http://localhost:5173
```

### 2. Test AI Generation (with authentication)

```bash
# First, login to get a token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_user","password":"your_pass"}'

# Use the token to generate content
curl -X POST http://localhost:8000/api/ai/generate/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"title":"How to Build a Blog with AI"}'
```

### 3. Using Frontend

1. Open browser to `http://localhost:5173`
2. Login with your credentials
3. Use the AI Blog Generator component
4. The AI features will automatically use the integrated backend

## API Request/Response Examples

### Generate Article

**Request:**
```json
POST /api/ai/generate/
{
  "title": "The Future of AI in Web Development"
}
```

**Response:**
```json
{
  "status": "success",
  "action": "generate",
  "result": "# The Future of AI in Web Development\n\nArtificial Intelligence..."
}
```

### Improve Text

**Request:**
```json
POST /api/ai/improve/
{
  "text": "AI is good. It helps people."
}
```

**Response:**
```json
{
  "status": "success",
  "action": "improve",
  "result": "Artificial Intelligence represents a transformative technology..."
}
```

### Summarize Text

**Request:**
```json
POST /api/ai/summarize/
{
  "text": "Long article content here..."
}
```

**Response:**
```json
{
  "status": "success",
  "action": "summarize",
  "result": "This article discusses..."
}
```

## Database Models

The Django backend logs all AI interactions in the `AIInteraction` model:

```python
AIInteraction:
  - user (ForeignKey)
  - interaction_type (generate/improve/summarize/batch)
  - request_data (JSON)
  - response_data (JSON)
  - user_rating (optional)
  - was_helpful (optional)
  - created_at
```

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port
lsof -ti:8001 | xargs kill -9
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### AI Service Connection Error

1. Check if AI/ML backend is running: `curl http://localhost:8001/api/v1/health`
2. Check Django settings: `AI_BACKEND_URL` in `settings.py`
3. Check CORS configuration in FastAPI
4. Check logs: `/ai_ml_backend/logs/`

### Authentication Issues

1. Verify JWT token is being sent in headers
2. Check token expiration (default: 60 minutes)
3. Try refreshing token: `POST /api/auth/token/refresh/`

## Production Deployment

### Environment-Specific Configuration

**AI/ML Backend:**
- Update `AI_BACKEND_URL` in Django settings
- Configure proper CORS origins
- Use environment variables for sensitive data
- Set up proper logging

**Django Backend:**
- Set `DEBUG=False`
- Configure allowed hosts
- Use production database (PostgreSQL)
- Set up HTTPS
- Configure static files serving

**Frontend:**
- Update `API_BASE_URL` in `api.ts`
- Build production bundle: `npm run build`
- Serve with Nginx/Apache

## Monitoring

### Health Checks

```bash
# Check all services
curl http://localhost:8001/api/v1/health
curl http://localhost:8000/api/ai/health/
curl http://localhost:5173
```

### Logs

- **AI/ML Backend:** `/ai_ml_backend/logs/`
- **Django Backend:** Console output or configured logging
- **Frontend:** Browser console

## Development Tips

1. **Hot Reload:** All services support hot reload for development
2. **API Documentation:** Visit `http://localhost:8001/docs` for FastAPI Swagger docs
3. **Django Admin:** Visit `http://localhost:8000/admin` for database management
4. **Browser DevTools:** Use Network tab to debug API calls

## Contributing

When adding new AI endpoints:

1. Add endpoint to FastAPI (`ai_ml_backend/src/controllers/controller.py`)
2. Add proxy endpoint to Django (`django_backend/blog/views.py`)
3. Add URL route (`django_backend/blog/urls.py`)
4. Add service method to frontend (`frontend/src/services/api.ts`)
5. Update this documentation

## License

See LICENSE file for details.

