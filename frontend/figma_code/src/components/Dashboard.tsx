import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BlogEditor } from './BlogEditor';
import { AIAssistant } from './AIAssistant';
import { AnimatedBackground } from './AnimatedBackground';
import { 
  Sparkles, 
  LogOut, 
  PlusCircle, 
  FileText, 
  TrendingUp,
  User
} from 'lucide-react';

interface DashboardProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  status: 'draft' | 'published';
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'editor' | 'ai-topics'>('overview');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem('blogai_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with sample posts
      const samplePosts: BlogPost[] = [
        {
          id: '1',
          title: 'Getting Started with React Hooks',
          content: 'React Hooks have revolutionized the way we write components...',
          summary: 'An introduction to React Hooks and their benefits',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'published'
        },
        {
          id: '2',
          title: 'The Future of Web Development',
          content: 'As we look ahead, several trends are shaping web development...',
          summary: 'Exploring upcoming trends in web development',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          status: 'draft'
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('blogai_posts', JSON.stringify(samplePosts));
    }
  }, []);

  const handleCreateNew = () => {
    setEditingPost(null);
    setActiveView('editor');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setActiveView('editor');
  };

  const handleSavePost = (post: BlogPost) => {
    const updatedPosts = editingPost
      ? posts.map(p => p.id === post.id ? post : p)
      : [...posts, post];
    setPosts(updatedPosts);
    localStorage.setItem('blogai_posts', JSON.stringify(updatedPosts));
    setActiveView('overview');
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('blogai_posts', JSON.stringify(updatedPosts));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="bg-white border-b relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-emerald-700" />
              <span className="text-xl text-emerald-800">BlogAI Writer</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name}</span>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Posts</CardDescription>
                  <CardTitle className="text-3xl">{posts.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Published</CardDescription>
                  <CardTitle className="text-3xl">
                    {posts.filter(p => p.status === 'published').length}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Drafts</CardDescription>
                  <CardTitle className="text-3xl">
                    {posts.filter(p => p.status === 'draft').length}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="mb-4 text-gray-900">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-emerald-300"
                  onClick={handleCreateNew}
                >
                  <CardContent className="pt-6">
                    <PlusCircle className="w-8 h-8 text-emerald-700 mb-3" />
                    <h3 className="mb-2 text-gray-900">Write New Post</h3>
                    <p className="text-sm text-gray-600">
                      Start writing from scratch or use a template
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-emerald-300"
                  onClick={() => setActiveView('editor')}
                >
                  <CardContent className="pt-6">
                    <Sparkles className="w-8 h-8 text-teal-700 mb-3" />
                    <h3 className="mb-2 text-gray-900">AI-Assisted Writing</h3>
                    <p className="text-sm text-gray-600">
                      Let AI help you write engaging content
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-emerald-300"
                  onClick={() => setActiveView('ai-topics')}
                >
                  <CardContent className="pt-6">
                    <TrendingUp className="w-8 h-8 text-green-700 mb-3" />
                    <h3 className="mb-2 text-gray-900">Discover Hot Topics</h3>
                    <p className="text-sm text-gray-600">
                      AI-powered topic suggestions based on trends
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Posts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900">Your Posts</h2>
                <Button onClick={handleCreateNew} className="bg-emerald-700 hover:bg-emerald-800">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>

              {posts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No posts yet</p>
                    <Button onClick={handleCreateNew} className="bg-emerald-700 hover:bg-emerald-800">
                      Create Your First Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-gray-900">{post.title}</h3>
                              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                {post.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{post.summary}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditPost(post)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'editor' && (
          <BlogEditor 
            post={editingPost}
            onSave={handleSavePost}
            onCancel={() => setActiveView('overview')}
            previousPosts={posts}
          />
        )}

        {activeView === 'ai-topics' && (
          <AIAssistant 
            previousPosts={posts}
            onSelectTopic={(title, content) => {
              setEditingPost({
                id: Date.now().toString(),
                title,
                content,
                summary: '',
                createdAt: new Date().toISOString(),
                status: 'draft'
              });
              setActiveView('editor');
            }}
            onBack={() => setActiveView('overview')}
          />
        )}
      </div>
    </div>
  );
}
