# Database Modeling Tools & Resources

## Django Models Created

I've created comprehensive Django models for your AI Blog Writer application with the following entities:

### Core Models:
1. **User** - Custom user model with profile and statistics
2. **BlogPost** - Main blog post model with AI tracking
3. **Category** - Blog post categories
4. **Tag** - Keywords/tags for posts
5. **TopicSuggestion** - AI-generated topic suggestions
6. **PublishingPlatform** - External publishing platforms
7. **PublishedPost** - Track posts published to platforms
8. **AIInteraction** - Track all AI interactions for analytics
9. **UserPreference** - User settings and preferences

### Database Relationships:
- User → BlogPost (One-to-Many)
- User → AIInteraction (One-to-Many)
- User → UserPreference (One-to-One)
- BlogPost → Category (Many-to-One)
- BlogPost → Tag (Many-to-Many)
- BlogPost → PublishedPost (One-to-Many)
- PublishingPlatform → PublishedPost (One-to-Many)
- Category → TopicSuggestion (One-to-Many)

---

## Best Database Modeling & Visualization Tools

### 1. **dbdiagram.io** ⭐ RECOMMENDED
- **URL**: https://dbdiagram.io
- **Features**:
  - Simple DSL syntax for creating diagrams
  - Free tier available
  - Export to SQL, PDF, PNG
  - Real-time collaboration
  - Clean, professional diagrams
- **Best For**: Quick, professional ER diagrams

### 2. **DrawSQL**
- **URL**: https://drawsql.app
- **Features**:
  - Visual drag-and-drop interface
  - Import from existing databases
  - Export to SQL for multiple databases
  - Team collaboration
  - Django-specific templates
- **Best For**: Visual designers who prefer GUI

### 3. **QuickDBD**
- **URL**: https://www.quickdatabasediagrams.com
- **Features**:
  - Text-to-diagram conversion
  - Fast prototyping
  - Export to SQL
  - Free tier available
- **Best For**: Rapid prototyping

### 4. **Lucidchart**
- **URL**: https://www.lucidchart.com
- **Features**:
  - Professional diagramming tool
  - ERD templates
  - Import from databases
  - Team collaboration
  - Integration with many platforms
- **Best For**: Enterprise-level documentation

### 5. **Mermaid (Code-based)**
- **URL**: https://mermaid.js.org
- **Features**:
  - Markdown-based diagrams
  - Free and open-source
  - Integrates with GitHub, GitLab, VS Code
  - Version control friendly
- **Best For**: Developers who prefer code

### 6. **DBeaver (Database Tool)**
- **URL**: https://dbeaver.io
- **Features**:
  - Free database management tool
  - Generate ER diagrams from existing databases
  - Multi-database support
  - SQL editor with autocomplete
- **Best For**: Working with actual databases

### 7. **pgModeler (PostgreSQL)**
- **URL**: https://pgmodeler.io
- **Features**:
  - PostgreSQL-specific modeling
  - Visual design
  - Generate DDL scripts
  - Reverse engineering
- **Best For**: PostgreSQL projects

### 8. **MySQL Workbench**
- **URL**: https://www.mysql.com/products/workbench/
- **Features**:
  - Free official MySQL tool
  - Visual database design
  - Forward/reverse engineering
  - SQL development
- **Best For**: MySQL/MariaDB projects

---

## Quick Start with dbdiagram.io

I've prepared a dbdiagram.io script for your models. Visit https://dbdiagram.io and paste this:

\`\`\`dbml
Table users {
  id uuid [pk]
  username varchar [unique, not null]
  email varchar [unique, not null]
  password varchar [not null]
  first_name varchar
  last_name varchar
  profile_picture varchar
  bio text
  total_posts integer [default: 0]
  total_drafts integer [default: 0]
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

Table categories {
  id uuid [pk]
  name varchar [unique, not null]
  slug varchar [unique, not null]
  description text
  created_at timestamp [not null]
}

Table tags {
  id uuid [pk]
  name varchar [unique, not null]
  slug varchar [unique, not null]
  created_at timestamp [not null]
}

Table blog_posts {
  id uuid [pk]
  author_id uuid [ref: > users.id]
  category_id uuid [ref: > categories.id]
  title varchar [not null]
  slug varchar [unique, not null]
  content text [not null]
  summary text
  featured_image varchar
  status varchar [not null, default: 'draft']
  view_count integer [default: 0]
  read_time integer [default: 0]
  ai_generated boolean [default: false]
  ai_prompt text
  ai_model varchar
  created_at timestamp [not null]
  updated_at timestamp [not null]
  published_at timestamp
}

Table blog_post_tags {
  blog_post_id uuid [ref: > blog_posts.id]
  tag_id uuid [ref: > tags.id]
  
  indexes {
    (blog_post_id, tag_id) [pk]
  }
}

Table topic_suggestions {
  id uuid [pk]
  title varchar [not null]
  description text [not null]
  trend varchar [not null]
  category_id uuid [ref: > categories.id]
  related_keywords json
  ai_confidence_score float [default: 0.0]
  source varchar
  times_used integer [default: 0]
  created_at timestamp [not null]
  expires_at timestamp
}

Table publishing_platforms {
  id uuid [pk]
  name varchar [unique, not null]
  slug varchar [unique, not null]
  api_endpoint varchar
  icon_url varchar
  is_active boolean [default: true]
  created_at timestamp [not null]
}

Table published_posts {
  id uuid [pk]
  blog_post_id uuid [ref: > blog_posts.id]
  platform_id uuid [ref: > publishing_platforms.id]
  platform_post_id varchar [not null]
  platform_url varchar [not null]
  metadata json
  published_at timestamp [not null]
  
  indexes {
    (blog_post_id, platform_id) [unique]
  }
}

Table ai_interactions {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  blog_post_id uuid [ref: > blog_posts.id]
  interaction_type varchar [not null]
  prompt text [not null]
  response text [not null]
  model_used varchar [not null]
  tokens_used integer [default: 0]
  response_time float [not null]
  user_rating integer
  was_helpful boolean
  created_at timestamp [not null]
}

Table user_preferences {
  id uuid [pk]
  user_id uuid [ref: - users.id]
  writing_style varchar
  default_tone varchar
  preferred_ai_model varchar
  ai_suggestion_frequency varchar [default: 'medium']
  email_notifications boolean [default: true]
  push_notifications boolean [default: false]
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

Table user_preferred_categories {
  user_preference_id uuid [ref: > user_preferences.id]
  category_id uuid [ref: > categories.id]
  
  indexes {
    (user_preference_id, category_id) [pk]
  }
}

Table user_preferred_tags {
  user_preference_id uuid [ref: > user_preferences.id]
  tag_id uuid [ref: > tags.id]
  
  indexes {
    (user_preference_id, tag_id) [pk]
  }
}

Table user_auto_publish_platforms {
  user_preference_id uuid [ref: > user_preferences.id]
  platform_id uuid [ref: > publishing_platforms.id]
  
  indexes {
    (user_preference_id, platform_id) [pk]
  }
}
\`\`\`

---

## Setting Up Django with the Models

1. **Initialize Django Project** (if not already done):
\`\`\`bash
cd django_backend
django-admin startproject blog_project .
python manage.py startapp blog
\`\`\`

2. **Move models.py** to your Django app:
\`\`\`bash
mv models.py blog/models.py
\`\`\`

3. **Configure Settings** (blog_project/settings.py):
\`\`\`python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog',  # Add your app
]

AUTH_USER_MODEL = 'blog.User'  # Use custom user model
\`\`\`

4. **Create Migrations**:
\`\`\`bash
python manage.py makemigrations
python manage.py migrate
\`\`\`

5. **Create Superuser**:
\`\`\`bash
python manage.py createsuperuser
\`\`\`

---

## Database Options

### Development:
- **SQLite** (Default, included with Django)
- **PostgreSQL** (Recommended for production-like dev)

### Production:
- **PostgreSQL** ⭐ RECOMMENDED
  - Best for Django
  - JSONB support for JSON fields
  - Full-text search
  - Scalable

- **MySQL/MariaDB**
  - Good alternative
  - Wide hosting support

- **Cloud Options**:
  - AWS RDS (PostgreSQL/MySQL)
  - Google Cloud SQL
  - Azure Database
  - Supabase (PostgreSQL)
  - PlanetScale (MySQL)

---

## VS Code Extensions for Database Work

1. **SQLTools** - Database management in VS Code
2. **PostgreSQL** - PostgreSQL support
3. **Django** - Django development support
4. **Python** - Essential for Django development

---

## Next Steps

1. ✅ Models created - Ready to use
2. 📊 Create ER diagram on dbdiagram.io (script provided above)
3. 🚀 Initialize Django project
4. 🔧 Configure database settings
5. 📝 Create and run migrations
6. 🎨 Register models in admin.py
7. 🔐 Set up authentication
8. 🌐 Create API endpoints (Django REST Framework)

Would you like help with any of these next steps?
