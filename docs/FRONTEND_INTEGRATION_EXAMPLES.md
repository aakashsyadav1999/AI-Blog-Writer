# Frontend Integration Examples

## ✅ Login Page (Already Integrated!)

The LoginPage component now uses the Django API. Here's what was done:

### Key Changes:

1. **Import the API service:**
```typescript
import { authService } from '../services/api';
```

2. **Updated state variables:**
- Changed from `loginEmail` to `loginUsername` (Django uses username)
- Added signup fields for Django registration

3. **Login Handler:**
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);
  
  try {
    // Call Django API
    const response = await authService.login(loginUsername, loginPassword);
    
    // Success - tokens stored automatically
    const user = response.user;
    toast.success(`Welcome back, ${user.username}!`);
    onLogin(user.email, user.username);
    
  } catch (err: any) {
    // Handle errors
    if (err.response) {
      const errorMessage = err.response.data?.detail || 'Invalid credentials';
      setError(errorMessage);
      toast.error(errorMessage);
    } else if (err.request) {
      setError('Cannot connect to server');
      toast.error('Server connection failed');
    }
  } finally {
    setIsLoading(false);
  }
};
```

4. **Signup Handler:**
```typescript
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);
  
  try {
    // Call Django API
    await authService.register(
      signupUsername,
      signupEmail,
      signupPassword,
      signupPassword2
    );
    
    // User automatically logged in
    toast.success('Account created!');
    const user = authService.getStoredUser();
    onLogin(user.email, user.username);
    
  } catch (err: any) {
    // Extract Django validation errors
    if (err.response?.data) {
      const errors = err.response.data;
      let errorMessage = '';
      
      if (errors.username) {
        errorMessage = `Username: ${errors.username[0]}`;
      } else if (errors.email) {
        errorMessage = `Email: ${errors.email[0]}`;
      }
      
      setError(errorMessage);
    }
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📝 How to Integrate Dashboard (Fetch Blog Posts)

Here's how to update your Dashboard component to fetch real posts from Django:

### 1. Import the service:
```typescript
import { blogService } from '../services/api';
import type { BlogPost } from '../types/api';
```

### 2. Add state for posts:
```typescript
const [posts, setPosts] = useState<BlogPost[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
```

### 3. Fetch posts on component mount:
```typescript
useEffect(() => {
  fetchPosts();
}, []);

const fetchPosts = async () => {
  setIsLoading(true);
  setError('');
  
  try {
    // Fetch published posts from API
    const response = await blogService.getPosts({
      status: 'published',
      ordering: '-created_at',
      page: 1
    });
    
    setPosts(response.results);
  } catch (err: any) {
    console.error('Failed to fetch posts:', err);
    setError('Failed to load posts');
    toast.error('Failed to load posts');
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Fetch user's own posts:
```typescript
const fetchMyPosts = async () => {
  setIsLoading(true);
  
  try {
    const response = await blogService.getMyPosts({
      ordering: '-created_at'
    });
    
    setPosts(response.results);
  } catch (err: any) {
    console.error('Failed to fetch my posts:', err);
    toast.error('Failed to load your posts');
  } finally {
    setIsLoading(false);
  }
};
```

### 5. Display posts in UI:
```typescript
{isLoading ? (
  <div className="flex justify-center p-8">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
) : error ? (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
) : (
  <div className="grid gap-4">
    {posts.map((post) => (
      <Card key={post.id}>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            By {post.author.username} • {new Date(post.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{post.summary}</p>
        </CardContent>
      </Card>
    ))}
  </div>
)}
```

---

## ✏️ How to Integrate BlogEditor (Create/Update Posts)

### 1. Import services:
```typescript
import { blogService, categoryService, tagService } from '../services/api';
import type { BlogPostCreate, Category, Tag } from '../types/api';
```

### 2. Add state:
```typescript
const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [summary, setSummary] = useState('');
const [categoryId, setCategoryId] = useState('');
const [selectedTags, setSelectedTags] = useState<string[]>([]);
const [categories, setCategories] = useState<Category[]>([]);
const [tags, setTags] = useState<Tag[]>([]);
const [isLoading, setIsLoading] = useState(false);
```

### 3. Fetch categories and tags:
```typescript
useEffect(() => {
  fetchCategories();
  fetchTags();
}, []);

const fetchCategories = async () => {
  try {
    const response = await categoryService.getCategories();
    setCategories(response);
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
};

const fetchTags = async () => {
  try {
    const response = await tagService.getTags();
    setTags(response);
  } catch (err) {
    console.error('Failed to fetch tags:', err);
  }
};
```

### 4. Create new post:
```typescript
const handleSaveDraft = async () => {
  setIsLoading(true);
  
  try {
    const postData: BlogPostCreate = {
      title,
      content,
      summary,
      category_id: categoryId || undefined,
      tag_ids: selectedTags,
      status: 'draft',
      ai_generated: false,
    };
    
    const newPost = await blogService.createPost(postData);
    
    toast.success('Draft saved!');
    console.log('Created post:', newPost);
    
  } catch (err: any) {
    console.error('Save error:', err);
    toast.error('Failed to save draft');
  } finally {
    setIsLoading(false);
  }
};
```

### 5. Publish post:
```typescript
const handlePublish = async () => {
  setIsLoading(true);
  
  try {
    // First create the post
    const postData: BlogPostCreate = {
      title,
      content,
      summary,
      category_id: categoryId || undefined,
      tag_ids: selectedTags,
      status: 'published',
      ai_generated: false,
    };
    
    const newPost = await blogService.createPost(postData);
    
    toast.success('Post published!');
    
  } catch (err: any) {
    console.error('Publish error:', err);
    toast.error('Failed to publish post');
  } finally {
    setIsLoading(false);
  }
};
```

### 6. Update existing post:
```typescript
const handleUpdatePost = async (slug: string) => {
  setIsLoading(true);
  
  try {
    const updates = {
      title,
      content,
      summary,
      category_id: categoryId || undefined,
      tag_ids: selectedTags,
    };
    
    const updatedPost = await blogService.updatePost(slug, updates);
    
    toast.success('Post updated!');
    
  } catch (err: any) {
    console.error('Update error:', err);
    toast.error('Failed to update post');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🤖 How to Integrate AI Assistant

### 1. Import AI service:
```typescript
import { aiService, topicService } from '../services/api';
import type { AIInteractionCreate, TopicSuggestion } from '../types/api';
```

### 2. Fetch topic suggestions:
```typescript
const [topics, setTopics] = useState<TopicSuggestion[]>([]);

const fetchTopics = async () => {
  try {
    const response = await topicService.getTopics({
      trend: 'hot',
      ordering: '-ai_confidence_score'
    });
    
    setTopics(response.results);
  } catch (err) {
    console.error('Failed to fetch topics:', err);
  }
};
```

### 3. Log AI interaction:
```typescript
const logAIInteraction = async (
  type: 'generation' | 'suggestion' | 'optimization',
  prompt: string,
  response: string
) => {
  try {
    const interaction: AIInteractionCreate = {
      interaction_type: type,
      prompt: prompt,
      response: response,
      model_used: 'gpt-4', // or your AI model
      tokens_used: 150,
      response_time: 2.5,
    };
    
    await aiService.createInteraction(interaction);
  } catch (err) {
    console.error('Failed to log AI interaction:', err);
  }
};
```

### 4. Use topic suggestion:
```typescript
const handleUseTopic = async (topicId: string, topicTitle: string) => {
  try {
    // Mark topic as used
    await topicService.useTopic(topicId);
    
    // Set as blog post title
    setTitle(topicTitle);
    
    toast.success('Topic applied!');
  } catch (err) {
    console.error('Failed to use topic:', err);
  }
};
```

---

## 🔐 How to Check Authentication

### In any component:
```typescript
import { authService } from '../services/api';

// Check if user is logged in
const isLoggedIn = authService.isAuthenticated();

// Get current user data
const currentUser = authService.getStoredUser();

// Get fresh user data from server
const fetchCurrentUser = async () => {
  try {
    const user = await authService.getCurrentUser();
    console.log('Current user:', user);
  } catch (err) {
    console.error('Not authenticated');
  }
};
```

---

## 🚪 How to Implement Logout

```typescript
import { authService } from '../services/api';

const handleLogout = async () => {
  try {
    await authService.logout();
    // Automatically redirects to login page and clears tokens
  } catch (err) {
    console.error('Logout error:', err);
    // Still clear local data even if API call fails
    authService.logout();
  }
};
```

---

## 🛡️ Error Handling Pattern

Always follow this error handling pattern:

```typescript
try {
  // Make API call
  const response = await someService.someMethod();
  
  // Success
  toast.success('Success!');
  
} catch (err: any) {
  console.error('Error:', err);
  
  if (err.response) {
    // Server responded with error (4xx, 5xx)
    const errorMessage = err.response.data?.detail 
      || err.response.data?.message
      || 'An error occurred';
    
    toast.error(errorMessage);
    setError(errorMessage);
    
  } else if (err.request) {
    // Request made but no response (network error, server down)
    const message = 'Cannot connect to server. Please ensure Django backend is running.';
    toast.error(message);
    setError(message);
    
  } else {
    // Something else happened
    toast.error('An unexpected error occurred');
    setError('An unexpected error occurred');
  }
} finally {
  setIsLoading(false);
}
```

---

## 📊 Common API Patterns

### Pagination:
```typescript
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const fetchPosts = async (pageNum: number) => {
  const response = await blogService.getPosts({
    page: pageNum,
    page_size: 10
  });
  
  setPosts(response.results);
  setHasMore(!!response.next);
};
```

### Search:
```typescript
const [searchQuery, setSearchQuery] = useState('');

const handleSearch = async () => {
  const response = await blogService.getPosts({
    search: searchQuery,
    ordering: '-created_at'
  });
  
  setPosts(response.results);
};
```

### Filtering:
```typescript
const fetchPostsByCategory = async (categorySlug: string) => {
  const response = await blogService.getPosts({
    category: categorySlug,
    status: 'published'
  });
  
  setPosts(response.results);
};
```

---

## 🎯 Quick Reference

### Authentication:
- `authService.login(username, password)` - Login
- `authService.register(username, email, password1, password2)` - Register
- `authService.logout()` - Logout
- `authService.getCurrentUser()` - Get user profile
- `authService.isAuthenticated()` - Check if logged in

### Blog Posts:
- `blogService.getPosts(params)` - List posts
- `blogService.getPost(slug)` - Get single post
- `blogService.createPost(data)` - Create post
- `blogService.updatePost(slug, data)` - Update post
- `blogService.deletePost(slug)` - Delete post
- `blogService.publishPost(slug)` - Publish post
- `blogService.getMyPosts(params)` - Get user's posts

### Categories & Tags:
- `categoryService.getCategories()` - List categories
- `tagService.getTags()` - List tags
- `categoryService.createCategory(data)` - Create category
- `tagService.createTag(data)` - Create tag

### AI Features:
- `topicService.getTopics(params)` - Get topic suggestions
- `topicService.useTopic(id)` - Mark topic as used
- `aiService.createInteraction(data)` - Log AI interaction
- `aiService.rateInteraction(id, rating, helpful)` - Rate interaction

---

## 💡 Pro Tips

1. **Always use try-catch** for API calls
2. **Show loading states** during API calls
3. **Display user-friendly error messages**
4. **Check backend is running** before debugging frontend issues
5. **Log errors to console** for debugging
6. **Use TypeScript types** from `types/api.ts` for type safety
7. **Store minimal data** in localStorage (tokens are handled automatically)
8. **Refresh data** after mutations (create, update, delete)

---

Now you have the complete pattern! Just follow these examples for any component you want to integrate with Django! 🚀
