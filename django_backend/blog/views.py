from django.shortcuts import render
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.db.models import Q

from .models import (
    BlogPost, Category, Tag, TopicSuggestion,
    PublishingPlatform, PublishedPost, AIInteraction, UserPreference
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer,
    BlogPostListSerializer, BlogPostDetailSerializer,
    CategorySerializer, TagSerializer, TopicSuggestionSerializer,
    PublishingPlatformSerializer, PublishedPostSerializer,
    AIInteractionSerializer, UserPreferenceSerializer
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User operations"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class RegisterViewSet(viewsets.GenericViewSet):
    """ViewSet for user registration"""
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request):
        """Register a new user"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category operations"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class TagViewSet(viewsets.ModelViewSet):
    """ViewSet for Tag operations"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']


class BlogPostViewSet(viewsets.ModelViewSet):
    """ViewSet for BlogPost operations"""
    queryset = BlogPost.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'summary']
    ordering_fields = ['created_at', 'updated_at', 'published_at', 'view_count']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        return BlogPostDetailSerializer
    
    def get_queryset(self):
        queryset = BlogPost.objects.all()
        user = self.request.user
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        elif not user.is_authenticated:
            # Only show published posts to unauthenticated users
            queryset = queryset.filter(status='published')
        
        # Filter by author
        author_param = self.request.query_params.get('author', None)
        if author_param:
            queryset = queryset.filter(author__username=author_param)
        
        # Filter by category
        category_param = self.request.query_params.get('category', None)
        if category_param:
            queryset = queryset.filter(category__slug=category_param)
        
        # Filter by tag
        tag_param = self.request.query_params.get('tag', None)
        if tag_param:
            queryset = queryset.filter(tags__slug=tag_param)
        
        # Filter by AI-generated
        ai_generated = self.request.query_params.get('ai_generated', None)
        if ai_generated is not None:
            queryset = queryset.filter(ai_generated=ai_generated.lower() == 'true')
        
        return queryset.select_related('author', 'category').prefetch_related('tags')
    
    def perform_create(self, serializer):
        # Auto-generate slug from title
        title = serializer.validated_data.get('title')
        slug = slugify(title)
        
        # Ensure unique slug
        original_slug = slug
        counter = 1
        while BlogPost.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1
        
        serializer.save(author=self.request.user, slug=slug)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, slug=None):
        """Publish a blog post"""
        blog_post = self.get_object()
        
        if blog_post.author != request.user:
            return Response(
                {"error": "You don't have permission to publish this post"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        blog_post.status = 'published'
        blog_post.save()
        
        serializer = self.get_serializer(blog_post)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def unpublish(self, request, slug=None):
        """Unpublish a blog post"""
        blog_post = self.get_object()
        
        if blog_post.author != request.user:
            return Response(
                {"error": "You don't have permission to unpublish this post"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        blog_post.status = 'draft'
        blog_post.save()
        
        serializer = self.get_serializer(blog_post)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def increment_view(self, request, slug=None):
        """Increment view count for a blog post"""
        blog_post = self.get_object()
        blog_post.view_count += 1
        blog_post.save(update_fields=['view_count'])
        return Response({"view_count": blog_post.view_count})
    
    @action(detail=False, methods=['get'])
    def my_posts(self, request):
        """Get current user's blog posts"""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        queryset = self.get_queryset().filter(author=request.user)
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TopicSuggestionViewSet(viewsets.ModelViewSet):
    """ViewSet for TopicSuggestion operations"""
    queryset = TopicSuggestion.objects.all()
    serializer_class = TopicSuggestionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'trend', 'ai_confidence_score']
    
    @action(detail=True, methods=['post'])
    def use(self, request, pk=None):
        """Mark a topic suggestion as used"""
        suggestion = self.get_object()
        suggestion.times_used += 1
        suggestion.save(update_fields=['times_used'])
        return Response({"times_used": suggestion.times_used})


class PublishingPlatformViewSet(viewsets.ModelViewSet):
    """ViewSet for PublishingPlatform operations"""
    queryset = PublishingPlatform.objects.filter(is_active=True)
    serializer_class = PublishingPlatformSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'


class PublishedPostViewSet(viewsets.ModelViewSet):
    """ViewSet for PublishedPost operations"""
    queryset = PublishedPost.objects.all()
    serializer_class = PublishedPostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by blog post
        blog_post_id = self.request.query_params.get('blog_post', None)
        if blog_post_id:
            queryset = queryset.filter(blog_post_id=blog_post_id)
        
        # Filter by platform
        platform_slug = self.request.query_params.get('platform', None)
        if platform_slug:
            queryset = queryset.filter(platform__slug=platform_slug)
        
        return queryset.select_related('blog_post', 'platform')


class AIInteractionViewSet(viewsets.ModelViewSet):
    """ViewSet for AIInteraction operations"""
    queryset = AIInteraction.objects.all()
    serializer_class = AIInteractionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own AI interactions
        return super().get_queryset().filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Rate an AI interaction"""
        interaction = self.get_object()
        rating = request.data.get('rating')
        was_helpful = request.data.get('was_helpful')
        
        if rating is not None:
            interaction.user_rating = rating
        if was_helpful is not None:
            interaction.was_helpful = was_helpful
        
        interaction.save()
        serializer = self.get_serializer(interaction)
        return Response(serializer.data)


class UserPreferenceViewSet(viewsets.ModelViewSet):
    """ViewSet for UserPreference operations"""
    queryset = UserPreference.objects.all()
    serializer_class = UserPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own preferences
        return super().get_queryset().filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_preferences(self, request):
        """Get current user's preferences"""
        preference, created = UserPreference.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(preference)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_preferences(self, request):
        """Update current user's preferences"""
        preference, created = UserPreference.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(preference, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

