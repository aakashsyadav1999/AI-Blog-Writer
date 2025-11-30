from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Category, Tag, BlogPost, TopicSuggestion,
    PublishingPlatform, PublishedPost, AIInteraction, UserPreference
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'total_posts', 'total_drafts', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields': ('profile_picture', 'bio', 'total_posts', 'total_drafts')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'total_posts', 'total_drafts']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'ai_generated', 'view_count', 'created_at']
    list_filter = ['status', 'ai_generated', 'category', 'created_at']
    search_fields = ['title', 'content', 'summary']
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ['author']
    filter_horizontal = ['tags']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'slug', 'author', 'content', 'summary', 'featured_image')
        }),
        ('Classification', {
            'fields': ('category', 'tags', 'status')
        }),
        ('AI Info', {
            'fields': ('ai_generated', 'ai_prompt', 'ai_model'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('view_count', 'read_time', 'published_at'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(TopicSuggestion)
class TopicSuggestionAdmin(admin.ModelAdmin):
    list_display = ['title', 'trend', 'category', 'ai_confidence_score', 'times_used', 'created_at']
    list_filter = ['trend', 'category', 'created_at']
    search_fields = ['title', 'description']


@admin.register(PublishingPlatform)
class PublishingPlatformAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(PublishedPost)
class PublishedPostAdmin(admin.ModelAdmin):
    list_display = ['blog_post', 'platform', 'platform_post_id', 'published_at']
    list_filter = ['platform', 'published_at']
    search_fields = ['blog_post__title', 'platform_post_id']
    raw_id_fields = ['blog_post']


@admin.register(AIInteraction)
class AIInteractionAdmin(admin.ModelAdmin):
    list_display = ['user', 'interaction_type', 'model_used', 'tokens_used', 'user_rating', 'created_at']
    list_filter = ['interaction_type', 'model_used', 'was_helpful', 'created_at']
    search_fields = ['user__username', 'prompt']
    raw_id_fields = ['user', 'blog_post']
    date_hierarchy = 'created_at'


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'writing_style', 'default_tone', 'email_notifications', 'push_notifications']
    list_filter = ['writing_style', 'email_notifications', 'push_notifications']
    search_fields = ['user__username']
    raw_id_fields = ['user']
    filter_horizontal = ['preferred_categories', 'preferred_tags', 'auto_publish_platforms']

