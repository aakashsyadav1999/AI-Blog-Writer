# Django Backend Integration Guide

## Overview
This guide explains how to set up and use the Django REST API backend with JWT authentication for your AI Blog Writer application.

## Backend Setup

### 1. Install Dependencies

First, you need to install the Python dependencies. Navigate to the Django backend directory:

```bash
cd django_backend
```

Then install the packages using pip (you may need to set up a virtual environment first):

```bash
# Create virtual environment (if not already created)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Run Migrations

Apply the database migrations to create all the necessary tables:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Superuser (Optional)

Create an admin user to access the Django admin panel:

```bash
python manage.py createsuperuser
```

### 4. Start the Development Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

---

## API Endpoints

### Authentication

#### Register New User
- **POST** `/api/auth/registration/`
- **Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password1": "securepassword123",
    "password2": "securepassword123"
  }
  ```

#### Login
- **POST** `/api/auth/login/`
- **Body:**
  ```json
  {
    "username": "john_doe",
    "password": "securepassword123"
  }
  ```
- **Response:**
  ```json
  {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGci...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci...",
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
  ```

#### Refresh Token
- **POST** `/api/auth/token/refresh/`
- **Body:**
  ```json
  {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci..."
  }
  ```

#### Logout
- **POST** `/api/auth/logout/`
- **Headers:** `Authorization: Bearer <access_token>`

#### Get Current User
- **GET** `/api/users/me/`
- **Headers:** `Authorization: Bearer <access_token>`

### Blog Posts

#### List All Posts
- **GET** `/api/posts/`
- Query Parameters:
  - `status`: draft | published | archived
  - `author`: username
  - `category`: category slug
  - `tag`: tag slug
  - `ai_generated`: true | false
  - `search`: search term
  - `ordering`: created_at | -created_at | view_count | -view_count

#### Get Single Post
- **GET** `/api/posts/{slug}/`

#### Create Post
- **POST** `/api/posts/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:**
  ```json
  {
    "title": "My First Blog Post",
    "content": "This is the content...",
    "summary": "A brief summary",
    "featured_image": "https://example.com/image.jpg",
    "category_id": "uuid",
    "tag_ids": ["uuid1", "uuid2"],
    "status": "draft",
    "ai_generated": false,
    "read_time": 5
  }
  ```

#### Update Post
- **PUT/PATCH** `/api/posts/{slug}/`
- **Headers:** `Authorization: Bearer <access_token>`

#### Delete Post
- **DELETE** `/api/posts/{slug}/`
- **Headers:** `Authorization: Bearer <access_token>`

#### Get My Posts
- **GET** `/api/posts/my_posts/`
- **Headers:** `Authorization: Bearer <access_token>`

#### Publish Post
- **POST** `/api/posts/{slug}/publish/`
- **Headers:** `Authorization: Bearer <access_token>`

#### Unpublish Post
- **POST** `/api/posts/{slug}/unpublish/`
- **Headers:** `Authorization: Bearer <access_token>`

#### Increment View Count
- **POST** `/api/posts/{slug}/increment_view/`

### Categories

#### List All Categories
- **GET** `/api/categories/`

#### Create Category
- **POST** `/api/categories/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:**
  ```json
  {
    "name": "Technology",
    "slug": "technology",
    "description": "Tech-related posts"
  }
  ```

### Tags

#### List All Tags
- **GET** `/api/tags/`

#### Create Tag
- **POST** `/api/tags/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:**
  ```json
  {
    "name": "AI",
    "slug": "ai"
  }
  ```

### Topic Suggestions

#### List Topic Suggestions
- **GET** `/api/topics/`
- **Headers:** `Authorization: Bearer <access_token>`

#### Mark Topic as Used
- **POST** `/api/topics/{id}/use/`
- **Headers:** `Authorization: Bearer <access_token>`

### AI Interactions

#### Create AI Interaction
- **POST** `/api/ai-interactions/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:**
  ```json
  {
    "interaction_type": "generation",
    "prompt": "Write about AI",
    "response": "AI is...",
    "model_used": "gpt-4",
    "tokens_used": 150,
    "response_time": 2.5
  }
  ```

#### Rate AI Interaction
- **POST** `/api/ai-interactions/{id}/rate/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:**
  ```json
  {
    "rating": 5,
    "was_helpful": true
  }
  ```

### User Preferences

#### Get My Preferences
- **GET** `/api/preferences/my_preferences/`
- **Headers:** `Authorization: Bearer <access_token>`

#### Update Preferences
- **PUT/PATCH** `/api/preferences/update_preferences/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:**
  ```json
  {
    "writing_style": "formal",
    "default_tone": "professional",
    "email_notifications": true,
    "push_notifications": false
  }
  ```

---

## Frontend Integration

### Using the API Service

The frontend includes an `api.ts` service file that handles all API calls with automatic token management.

#### Example: Login

```typescript
import api from '@/services/api';

const handleLogin = async (username: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login/', {
      username,
      password
    });
    
    // Tokens are automatically stored
    console.log('Logged in:', response.data.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### Example: Fetch Posts

```typescript
import api from '@/services/api';

const fetchPosts = async () => {
  try {
    const response = await api.get('/api/posts/', {
      params: {
        status: 'published',
        ordering: '-created_at'
      }
    });
    
    console.log('Posts:', response.data.results);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }
};
```

#### Example: Create Post

```typescript
import api from '@/services/api';

const createPost = async (postData: any) => {
  try {
    const response = await api.post('/api/posts/', postData);
    console.log('Post created:', response.data);
  } catch (error) {
    console.error('Failed to create post:', error);
  }
};
```

---

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

---

## Authentication Flow

1. **User Registration:** User signs up via `/api/auth/registration/`
2. **User Login:** User logs in via `/api/auth/login/`, receives access and refresh tokens
3. **Access Protected Resources:** Frontend includes access token in `Authorization` header
4. **Token Refresh:** When access token expires, frontend automatically refreshes it using refresh token
5. **Logout:** User logs out via `/api/auth/logout/`

---

## Database Schema

The database includes the following models:
- **User:** Custom user model with profile information
- **Category:** Blog post categories
- **Tag:** Tags for blog posts
- **BlogPost:** Main blog post model
- **TopicSuggestion:** AI-generated topic suggestions
- **PublishingPlatform:** External publishing platforms
- **PublishedPost:** Track published posts
- **AIInteraction:** Log AI interactions
- **UserPreference:** User settings and preferences

---

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` to:
- Manage users
- Create/edit categories and tags
- Moderate blog posts
- View AI interactions
- Manage publishing platforms

---

## Troubleshooting

### CORS Errors
If you encounter CORS errors, ensure:
1. The backend is running on `http://localhost:8000`
2. The frontend is running on `http://localhost:5173`
3. CORS settings in `settings.py` include your frontend URL

### Authentication Errors
If JWT authentication fails:
1. Check that tokens are being stored correctly in localStorage
2. Verify the token hasn't expired
3. Ensure the Authorization header format is `Bearer <token>`

### Migration Errors
If migrations fail:
1. Delete the `db.sqlite3` file
2. Delete all migration files except `__init__.py` in `blog/migrations/`
3. Run `python manage.py makemigrations` again
4. Run `python manage.py migrate`

---

## Next Steps

1. Install dependencies: `pip install -r requirements.txt`
2. Run migrations: `python manage.py migrate`
3. Create superuser: `python manage.py createsuperuser`
4. Start backend: `python manage.py runserver`
5. Update frontend to use the API
6. Test authentication flow
7. Implement blog CRUD operations in frontend
