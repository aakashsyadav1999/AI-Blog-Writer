from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    BlogPost, Category, Tag, TopicSuggestion, 
    PublishingPlatform, PublishedPost, AIInteraction, UserPreference
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'profile_picture', 'bio', 'total_posts', 'total_drafts',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_posts', 'total_drafts']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'created_at', 'posts_count']
        read_only_fields = ['id', 'created_at']
    
    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model"""
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'created_at', 'posts_count']
        read_only_fields = ['id', 'created_at']
    
    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class BlogPostListSerializer(serializers.ModelSerializer):
    """Serializer for BlogPost list view"""
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'summary', 'featured_image',
            'author', 'category', 'tags', 'status', 'view_count',
            'read_time', 'ai_generated', 'created_at', 'updated_at',
            'published_at'
        ]
        read_only_fields = ['id', 'slug', 'view_count', 'created_at', 'updated_at']


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Serializer for BlogPost detail view"""
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    tag_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'summary', 'featured_image',
            'author', 'category', 'category_id', 'tags', 'tag_ids',
            'status', 'view_count', 'read_time', 'ai_generated',
            'ai_prompt', 'ai_model', 'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = ['id', 'slug', 'view_count', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        category_id = validated_data.pop('category_id', None)
        
        if category_id:
            validated_data['category_id'] = category_id
        
        blog_post = BlogPost.objects.create(**validated_data)
        
        if tag_ids:
            tags = Tag.objects.filter(id__in=tag_ids)
            blog_post.tags.set(tags)
        
        return blog_post
    
    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)
        category_id = validated_data.pop('category_id', None)
        
        if category_id is not None:
            instance.category_id = category_id
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        
        if tag_ids is not None:
            tags = Tag.objects.filter(id__in=tag_ids)
            instance.tags.set(tags)
        
        return instance


class TopicSuggestionSerializer(serializers.ModelSerializer):
    """Serializer for TopicSuggestion model"""
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = TopicSuggestion
        fields = [
            'id', 'title', 'description', 'trend', 'category',
            'related_keywords', 'ai_confidence_score', 'source',
            'times_used', 'created_at', 'expires_at'
        ]
        read_only_fields = ['id', 'times_used', 'created_at']


class PublishingPlatformSerializer(serializers.ModelSerializer):
    """Serializer for PublishingPlatform model"""
    
    class Meta:
        model = PublishingPlatform
        fields = [
            'id', 'name', 'slug', 'api_endpoint', 'icon_url',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class PublishedPostSerializer(serializers.ModelSerializer):
    """Serializer for PublishedPost model"""
    platform = PublishingPlatformSerializer(read_only=True)
    blog_post = BlogPostListSerializer(read_only=True)
    
    class Meta:
        model = PublishedPost
        fields = [
            'id', 'blog_post', 'platform', 'platform_post_id',
            'platform_url', 'published_at', 'metadata'
        ]
        read_only_fields = ['id', 'published_at']


class AIInteractionSerializer(serializers.ModelSerializer):
    """Serializer for AIInteraction model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = AIInteraction
        fields = [
            'id', 'user', 'interaction_type', 'prompt', 'response',
            'blog_post', 'model_used', 'tokens_used', 'response_time',
            'user_rating', 'was_helpful', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class UserPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for UserPreference model"""
    preferred_categories = CategorySerializer(many=True, read_only=True)
    preferred_tags = TagSerializer(many=True, read_only=True)
    auto_publish_platforms = PublishingPlatformSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserPreference
        fields = [
            'id', 'user', 'preferred_categories', 'preferred_tags',
            'writing_style', 'default_tone', 'auto_publish_platforms',
            'preferred_ai_model', 'ai_suggestion_frequency',
            'email_notifications', 'push_notifications',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
