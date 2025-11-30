// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  bio?: string;
  total_posts: number;
  total_drafts: number;
  created_at: string;
  updated_at: string;
}

export interface UserRegistration {
  username: string;
  email: string;
  password1: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  posts_count: number;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  posts_count: number;
}

// Blog Post Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  featured_image?: string;
  author: User;
  category?: Category;
  tags: Tag[];
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  read_time: number;
  ai_generated: boolean;
  ai_prompt?: string;
  ai_model?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface BlogPostCreate {
  title: string;
  content: string;
  summary?: string;
  featured_image?: string;
  category_id?: string;
  tag_ids?: string[];
  status?: 'draft' | 'published' | 'archived';
  read_time?: number;
  ai_generated?: boolean;
  ai_prompt?: string;
  ai_model?: string;
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {}

// Topic Suggestion Types
export interface TopicSuggestion {
  id: string;
  title: string;
  description: string;
  trend: 'rising' | 'hot' | 'steady';
  category?: Category;
  related_keywords: string[];
  ai_confidence_score: number;
  source?: string;
  times_used: number;
  created_at: string;
  expires_at?: string;
}

// Publishing Platform Types
export interface PublishingPlatform {
  id: string;
  name: string;
  slug: string;
  api_endpoint?: string;
  icon_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface PublishedPost {
  id: string;
  blog_post: BlogPost;
  platform: PublishingPlatform;
  platform_post_id: string;
  platform_url: string;
  published_at: string;
  metadata: Record<string, any>;
}

// AI Interaction Types
export interface AIInteraction {
  id: string;
  user: User;
  interaction_type: 'generation' | 'suggestion' | 'optimization' | 'summary';
  prompt: string;
  response: string;
  blog_post?: string;
  model_used: string;
  tokens_used: number;
  response_time: number;
  user_rating?: number;
  was_helpful?: boolean;
  created_at: string;
}

export interface AIInteractionCreate {
  interaction_type: 'generation' | 'suggestion' | 'optimization' | 'summary';
  prompt: string;
  response: string;
  blog_post?: string;
  model_used: string;
  tokens_used: number;
  response_time: number;
}

// User Preferences Types
export interface UserPreference {
  id: string;
  user: string;
  preferred_categories: Category[];
  preferred_tags: Tag[];
  writing_style?: string;
  default_tone?: string;
  auto_publish_platforms: PublishingPlatform[];
  preferred_ai_model?: string;
  ai_suggestion_frequency: string;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferenceUpdate {
  writing_style?: string;
  default_tone?: string;
  preferred_ai_model?: string;
  ai_suggestion_frequency?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
