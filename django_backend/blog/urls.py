from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'register', views.RegisterViewSet, basename='register')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'tags', views.TagViewSet, basename='tag')
router.register(r'posts', views.BlogPostViewSet, basename='blogpost')
router.register(r'topics', views.TopicSuggestionViewSet, basename='topicsuggestion')
router.register(r'platforms', views.PublishingPlatformViewSet, basename='publishingplatform')
router.register(r'published', views.PublishedPostViewSet, basename='publishedpost')
router.register(r'ai-interactions', views.AIInteractionViewSet, basename='aiinteraction')
router.register(r'preferences', views.UserPreferenceViewSet, basename='userpreference')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
]
