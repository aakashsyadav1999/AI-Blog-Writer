from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    profile_picture = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional fields for blog writer
    total_posts = models.IntegerField(default=0)
    total_drafts = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.username} ({self.email})"


class Category(models.Model):
    """
    Blog post categories
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Tag(models.Model):
    """
    Tags/Keywords for blog posts
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tags'
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class BlogPost(models.Model):
    """
    Main blog post model
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    summary = models.TextField(blank=True, null=True)
    featured_image = models.URLField(blank=True, null=True)
    
    # Relationships
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    tags = models.ManyToManyField(Tag, related_name='posts', blank=True)
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    view_count = models.IntegerField(default=0)
    read_time = models.IntegerField(default=0, help_text='Estimated read time in minutes')
    
    # AI-related fields
    ai_generated = models.BooleanField(default=False)
    ai_prompt = models.TextField(blank=True, null=True, help_text='Original AI prompt used')
    ai_model = models.CharField(max_length=100, blank=True, null=True, help_text='AI model used for generation')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'blog_posts'
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['author', 'status']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Auto-set published_at when status changes to published
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class TopicSuggestion(models.Model):
    """
    AI-generated topic suggestions
    """
    TREND_CHOICES = [
        ('rising', 'Rising'),
        ('hot', 'Hot'),
        ('steady', 'Steady'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    trend = models.CharField(max_length=20, choices=TREND_CHOICES, default='steady')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='suggestions')
    related_keywords = models.JSONField(default=list, help_text='List of related keywords')
    
    # AI metadata
    ai_confidence_score = models.FloatField(default=0.0, help_text='AI confidence score (0-1)')
    source = models.CharField(max_length=100, blank=True, null=True, help_text='Source of the suggestion')
    
    # Usage tracking
    times_used = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True, help_text='When this suggestion becomes outdated')
    
    class Meta:
        db_table = 'topic_suggestions'
        verbose_name = 'Topic Suggestion'
        verbose_name_plural = 'Topic Suggestions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['trend']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.trend})"


class PublishingPlatform(models.Model):
    """
    External platforms where posts can be published
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    api_endpoint = models.URLField(blank=True, null=True)
    icon_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'publishing_platforms'
        verbose_name = 'Publishing Platform'
        verbose_name_plural = 'Publishing Platforms'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class PublishedPost(models.Model):
    """
    Track published posts across different platforms
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='publications')
    platform = models.ForeignKey(PublishingPlatform, on_delete=models.CASCADE, related_name='published_posts')
    platform_post_id = models.CharField(max_length=255, help_text='ID on the external platform')
    platform_url = models.URLField(help_text='URL of the published post')
    published_at = models.DateTimeField(auto_now_add=True)
    
    # Platform-specific metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'published_posts'
        verbose_name = 'Published Post'
        verbose_name_plural = 'Published Posts'
        ordering = ['-published_at']
        unique_together = [['blog_post', 'platform']]
    
    def __str__(self):
        return f"{self.blog_post.title} on {self.platform.name}"


class AIInteraction(models.Model):
    """
    Track AI interactions for analytics and improvement
    """
    INTERACTION_TYPES = [
        ('generation', 'Content Generation'),
        ('suggestion', 'Topic Suggestion'),
        ('optimization', 'Content Optimization'),
        ('summary', 'Summary Generation'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_interactions')
    interaction_type = models.CharField(max_length=50, choices=INTERACTION_TYPES)
    prompt = models.TextField()
    response = models.TextField()
    
    # Related entities
    blog_post = models.ForeignKey(BlogPost, on_delete=models.SET_NULL, null=True, blank=True, related_name='ai_interactions')
    
    # AI metadata
    model_used = models.CharField(max_length=100)
    tokens_used = models.IntegerField(default=0)
    response_time = models.FloatField(help_text='Response time in seconds')
    
    # Feedback
    user_rating = models.IntegerField(null=True, blank=True, help_text='User rating 1-5')
    was_helpful = models.BooleanField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_interactions'
        verbose_name = 'AI Interaction'
        verbose_name_plural = 'AI Interactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['interaction_type']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.interaction_type} at {self.created_at}"


class UserPreference(models.Model):
    """
    User preferences and settings
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    
    # Writing preferences
    preferred_categories = models.ManyToManyField(Category, blank=True, related_name='preferred_by')
    preferred_tags = models.ManyToManyField(Tag, blank=True, related_name='preferred_by')
    writing_style = models.CharField(max_length=50, blank=True, null=True, help_text='Formal, Casual, Technical, etc.')
    default_tone = models.CharField(max_length=50, blank=True, null=True)
    
    # Publishing preferences
    auto_publish_platforms = models.ManyToManyField(PublishingPlatform, blank=True, related_name='auto_publishers')
    
    # AI preferences
    preferred_ai_model = models.CharField(max_length=100, blank=True, null=True)
    ai_suggestion_frequency = models.CharField(max_length=50, default='medium', 
                                               help_text='How often to show AI suggestions')
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_preferences'
        verbose_name = 'User Preference'
        verbose_name_plural = 'User Preferences'
    
    def __str__(self):
        return f"Preferences for {self.user.username}"
