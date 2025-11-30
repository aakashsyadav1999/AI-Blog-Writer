import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Base API URL - Change this if your Django backend runs on a different port
const API_BASE_URL = 'http://localhost:8000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        
        if (!refreshToken) {
          // No refresh token, logout user
          authService.logout();
          return Promise.reject(error);
        }

        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        
        // Store new access token
        localStorage.setItem(ACCESS_TOKEN_KEY, access);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  // Register new user
  async register(username: string, email: string, password1: string, password2: string) {
    const response = await api.post('/api/auth/registration/', {
      username,
      email,
      password1,
      password2,
    });
    
    // Store tokens and user data
    if (response.data.access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Login user
  async login(username: string, password: string) {
    const response = await api.post('/api/auth/login/', {
      username,
      password,
    });
    
    // Store tokens and user data
    if (response.data.access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout user
  async logout() {
    try {
      await api.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      // Redirect to login page
      window.location.href = '/login';
    }
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/api/users/me/');
    localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    return response.data;
  },

  // Update user profile
  async updateProfile(data: any) {
    const response = await api.patch('/api/users/update_profile/', data);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    return response.data;
  },

  // Get stored user data
  getStoredUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },
};

// Blog Posts service
export const blogService = {
  // Get all posts
  async getPosts(params?: any) {
    const response = await api.get('/api/posts/', { params });
    return response.data;
  },

  // Get single post by slug
  async getPost(slug: string) {
    const response = await api.get(`/api/posts/${slug}/`);
    return response.data;
  },

  // Get current user's posts
  async getMyPosts(params?: any) {
    const response = await api.get('/api/posts/my_posts/', { params });
    return response.data;
  },

  // Create new post
  async createPost(data: any) {
    const response = await api.post('/api/posts/', data);
    return response.data;
  },

  // Update post
  async updatePost(slug: string, data: any) {
    const response = await api.patch(`/api/posts/${slug}/`, data);
    return response.data;
  },

  // Delete post
  async deletePost(slug: string) {
    const response = await api.delete(`/api/posts/${slug}/`);
    return response.data;
  },

  // Publish post
  async publishPost(slug: string) {
    const response = await api.post(`/api/posts/${slug}/publish/`);
    return response.data;
  },

  // Unpublish post
  async unpublishPost(slug: string) {
    const response = await api.post(`/api/posts/${slug}/unpublish/`);
    return response.data;
  },

  // Increment view count
  async incrementView(slug: string) {
    const response = await api.post(`/api/posts/${slug}/increment_view/`);
    return response.data;
  },
};

// Categories service
export const categoryService = {
  // Get all categories
  async getCategories(params?: any) {
    const response = await api.get('/api/categories/', { params });
    return response.data;
  },

  // Get single category
  async getCategory(slug: string) {
    const response = await api.get(`/api/categories/${slug}/`);
    return response.data;
  },

  // Create category
  async createCategory(data: any) {
    const response = await api.post('/api/categories/', data);
    return response.data;
  },
};

// Tags service
export const tagService = {
  // Get all tags
  async getTags(params?: any) {
    const response = await api.get('/api/tags/', { params });
    return response.data;
  },

  // Get single tag
  async getTag(slug: string) {
    const response = await api.get(`/api/tags/${slug}/`);
    return response.data;
  },

  // Create tag
  async createTag(data: any) {
    const response = await api.post('/api/tags/', data);
    return response.data;
  },
};

// Topic Suggestions service
export const topicService = {
  // Get all topic suggestions
  async getTopics(params?: any) {
    const response = await api.get('/api/topics/', { params });
    return response.data;
  },

  // Mark topic as used
  async useTopic(id: string) {
    const response = await api.post(`/api/topics/${id}/use/`);
    return response.data;
  },

  // Create topic suggestion
  async createTopic(data: any) {
    const response = await api.post('/api/topics/', data);
    return response.data;
  },
};

// AI Interactions service
export const aiService = {
  // Get all AI interactions
  async getInteractions(params?: any) {
    const response = await api.get('/api/ai-interactions/', { params });
    return response.data;
  },

  // Create AI interaction
  async createInteraction(data: any) {
    const response = await api.post('/api/ai-interactions/', data);
    return response.data;
  },

  // Rate AI interaction
  async rateInteraction(id: string, rating: number, wasHelpful: boolean) {
    const response = await api.post(`/api/ai-interactions/${id}/rate/`, {
      rating,
      was_helpful: wasHelpful,
    });
    return response.data;
  },
};

// User Preferences service
export const preferencesService = {
  // Get current user's preferences
  async getPreferences() {
    const response = await api.get('/api/preferences/my_preferences/');
    return response.data;
  },

  // Update preferences
  async updatePreferences(data: any) {
    const response = await api.patch('/api/preferences/update_preferences/', data);
    return response.data;
  },
};

export default api;
