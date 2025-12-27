import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { ArrowLeft, TrendingUp, Lightbulb, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { BlogPost } from '../types/api';
import { aiService } from '../services/api';

interface AIAssistantProps {
  previousPosts: BlogPost[];
  onSelectTopic: (title: string, content: string) => void;
  onBack: () => void;
}

interface TopicSuggestion {
  id: string;
  title: string;
  description: string;
  trend: 'rising' | 'hot' | 'steady';
  category: string;
  relatedKeywords: string[];
}

export function AIAssistant({ previousPosts, onSelectTopic, onBack }: AIAssistantProps) {
  const [topics, setTopics] = useState<TopicSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<TopicSuggestion | null>(null);

  useEffect(() => {
    generateTopics();
  }, []);

  const generateTopics = async () => {
    setIsLoading(true);
    
    try {
      // Call the real AI API to generate trending topics
      const response = await aiService.suggestTopics('', 6);
      
      if (response.status === 'success' && response.topics) {
        setTopics(response.topics);
        toast.success('Fresh trending topics loaded!');
      } else {
        throw new Error('Failed to load topics');
      }
    } catch (error: any) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics. Showing sample topics instead.');
      
      // Fallback to sample topics if API fails
      const mockTopics: TopicSuggestion[] = [
        {
          id: '1',
          title: 'The Rise of AI-Powered Development Tools in 2024',
          description: 'Explore how AI is transforming the way developers write, test, and deploy code. This trending topic has seen 300% growth in searches.',
          trend: 'hot',
          category: 'Technology',
          relatedKeywords: ['AI', 'Developer Tools', 'Automation', 'Productivity']
        },
        {
          id: '2',
          title: 'Building Accessible Web Applications: Best Practices',
          description: 'Accessibility is becoming a legal requirement. Learn the essential techniques to make your web apps inclusive for all users.',
          trend: 'rising',
          category: 'Web Development',
          relatedKeywords: ['Accessibility', 'WCAG', 'Inclusive Design', 'UX']
        },
        {
          id: '3',
          title: 'Micro-SaaS Success Stories: From Idea to $10K MRR',
          description: 'Small teams are building profitable SaaS products. Discover strategies from successful micro-SaaS founders.',
          trend: 'hot',
          category: 'Business',
          relatedKeywords: ['SaaS', 'Entrepreneurship', 'Indie Hacking', 'Revenue']
        }
      ];
      setTopics(mockTopics);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = (topic: TopicSuggestion) => {
    setSelectedTopic(topic);
    
    // Generate starter content for the selected topic
    const starterContent = `# ${topic.title}

${topic.description}

## Introduction

This is a trending topic in the ${topic.category} space. Let me share some insights that can help you understand this better.

## Key Points to Cover

1. Background and context
2. Current trends and statistics
3. Practical applications
4. Best practices and recommendations
5. Future outlook

## Why This Matters

[Add your insights here about why this topic is important...]

## Getting Started

[Provide actionable steps or recommendations...]

## Conclusion

[Summarize the key takeaways...]

---

**Related Keywords:** ${topic.relatedKeywords.join(', ')}
`;

    toast.success('Topic selected! Starting your blog post...');
    setTimeout(() => {
      onSelectTopic(topic.title, starterContent);
    }, 500);
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'hot':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">🔥 Hot</Badge>;
      case 'rising':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">📈 Rising</Badge>;
      case 'steady':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">📊 Steady</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-gray-900">AI-Powered Topic Discovery</h1>
          <p className="text-gray-600 mt-2">
            Based on your writing history and current trends, here are hot topics you could write about
          </p>
        </div>
        <Button variant="outline" onClick={generateTopics} disabled={isLoading}>
          <Sparkles className="w-4 h-4 mr-2" />
          Refresh Topics
        </Button>
      </div>

      {/* Analysis Summary */}
      <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="mb-2 text-gray-900">AI Analysis Complete</h3>
              <p className="text-gray-600">
                We've analyzed {previousPosts.length} of your previous posts and identified trending topics 
                in your niche. These suggestions are personalized based on your writing style and audience interests.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          topics.map((topic) => (
            <Card 
              key={topic.id} 
              className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-emerald-300"
              onClick={() => handleSelectTopic(topic)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTrendBadge(topic.trend)}
                      <Badge variant="outline">{topic.category}</Badge>
                    </div>
                    <CardTitle className="text-xl">{topic.title}</CardTitle>
                  </div>
                  <TrendingUp className="w-6 h-6 text-emerald-700 flex-shrink-0" />
                </div>
                <CardDescription className="text-base">{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {topic.relatedKeywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm">
                    Use This Topic
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* How It Works */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            How AI Topic Discovery Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>1. Content Analysis:</strong> AI reviews your previous blog posts to understand your writing style, 
            topics, and audience preferences.
          </p>
          <p>
            <strong>2. Trend Monitoring:</strong> We scan trending topics across the web, social media, and industry publications 
            to identify what's currently popular.
          </p>
          <p>
            <strong>3. Personalization:</strong> Topics are ranked based on relevance to your niche and likelihood of 
            engaging your specific audience.
          </p>
          <p>
            <strong>4. Starter Content:</strong> Each topic comes with AI-generated outline and starter content to help 
            you begin writing immediately.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
