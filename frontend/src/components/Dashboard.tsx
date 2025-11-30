import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { BlogEditor } from './BlogEditor';
import { AIAssistant } from './AIAssistant';
import { AIBlogGenerator } from './AIBlogGenerator';
import { AnimatedBackground } from './AnimatedBackground';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { blogService } from '../services/api';
import { BlogPost as APIBlogPost } from '../types/api';
import { toast } from 'sonner';
import { 
  Sparkles, 
  LogOut, 
  PlusCircle, 
  FileText, 
  TrendingUp,
  User,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface DashboardProps {
  user: { email: string; name: string };
  onLogout: () => void;
  onGoHome: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Dashboard({ user, onLogout, onGoHome, theme, onToggleTheme }: DashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'editor' | 'ai-topics' | 'ai-generator'>('overview');
  const [posts, setPosts] = useState<APIBlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<APIBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Fetch user's posts from Django API
      const response = await blogService.getMyPosts({
        ordering: '-created_at'
      });
      
      setPosts(response.results || response);
      toast.success('Posts loaded successfully');
    } catch (err: any) {
      console.error('Failed to fetch posts:', err);
      
      if (err.request && !err.response) {
        setError('Cannot connect to server. Please ensure Django backend is running on port 8000.');
        toast.error('Server connection failed');
      } else {
        setError('Failed to load posts');
        toast.error('Failed to load posts');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setActiveView('editor');
  };

  const handleEditPost = (post: APIBlogPost) => {
    setEditingPost(post);
    setActiveView('editor');
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      await blogService.deletePost(slug);
      toast.success('Post deleted successfully!');
      
      // Refresh posts list
      await fetchMyPosts();
    } catch (err: any) {
      console.error('Failed to delete post:', err);
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-emerald-900/30 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => {
              setActiveView('overview');
              onGoHome();
            }}>
              <Sparkles className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
              <span className="text-xl text-emerald-800 dark:text-emerald-300">BlogAI Writer</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name}</span>
              </div>
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
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
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Total Posts', value: posts.length },
                { label: 'Published', value: posts.filter(p => p.status === 'published').length },
                { label: 'Drafts', value: posts.filter(p => p.status === 'draft').length }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardDescription>{stat.label}</CardDescription>
                      <CardTitle className="text-3xl">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stat.value}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-emerald-300 dark:hover:border-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/30 h-full"
                    onClick={handleCreateNew}
                  >
                    <CardContent className="pt-6">
                      <PlusCircle className="w-8 h-8 text-emerald-700 dark:text-emerald-400 mb-3" />
                      <h3 className="mb-2 text-gray-900 dark:text-gray-100">Write New Post</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Start writing from scratch or use a template
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-emerald-300 dark:hover:border-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/30 h-full"
                    onClick={() => setActiveView('ai-generator')}
                  >
                    <CardContent className="pt-6">
                      <Sparkles className="w-8 h-8 text-teal-700 dark:text-teal-400 mb-3" />
                      <h3 className="mb-2 text-gray-900 dark:text-gray-100">AI-Assisted Writing</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Let AI help you write engaging content
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-emerald-300 dark:hover:border-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/30 h-full"
                    onClick={() => setActiveView('ai-topics')}
                  >
                    <CardContent className="pt-6">
                      <TrendingUp className="w-8 h-8 text-green-700 dark:text-green-400 mb-3" />
                      <h3 className="mb-2 text-gray-900 dark:text-gray-100">Discover Hot Topics</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI-powered topic suggestions based on trends
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Recent Posts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900 dark:text-gray-100">Your Posts</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={fetchMyPosts}
                    disabled={isLoading}
                    className="dark:border-emerald-800 dark:hover:bg-emerald-950"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button onClick={handleCreateNew} className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Loader2 className="w-12 h-12 text-emerald-700 dark:text-emerald-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400">Loading your posts...</p>
                  </CardContent>
                </Card>
              ) : posts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No posts yet</p>
                    <Button onClick={handleCreateNew} className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                      Create Your First Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Card className="hover:shadow-lg transition-all dark:bg-emerald-950/30 dark:border-emerald-900/30">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-gray-900 dark:text-gray-100">{post.title}</h3>
                                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                    {post.status}
                                  </Badge>
                                  {post.ai_generated && (
                                    <Badge variant="outline" className="text-purple-600 dark:text-purple-400">
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      AI
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                  {post.summary || 'No summary available'}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{post.view_count} views</span>
                                  {post.read_time > 0 && (
                                    <>
                                      <span>•</span>
                                      <span>{post.read_time} min read</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditPost(post)}
                                    className="dark:border-emerald-800 dark:hover:bg-emerald-950"
                                  >
                                    Edit
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeletePost(post.slug)}
                                    className="dark:border-red-800 dark:hover:bg-red-950 hover:border-red-600 hover:text-red-600"
                                  >
                                    Delete
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeView === 'editor' && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BlogEditor 
              post={editingPost}
              onCancel={() => {
                setActiveView('overview');
                fetchMyPosts(); // Refresh posts when returning
              }}
              previousPosts={posts}
            />
          </motion.div>
        )}

        {activeView === 'ai-topics' && (
          <motion.div
            key="ai-topics"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <AIAssistant 
              previousPosts={posts}
              onSelectTopic={(title, content) => {
                setEditingPost({
                  id: Date.now().toString(),
                  slug: '',
                  title,
                  content,
                  summary: '',
                  author: { id: '', username: user.name, email: user.email, first_name: '', last_name: '', profile_picture: '', bio: '', total_posts: 0, total_drafts: 0, created_at: '', updated_at: '' },
                  category: undefined,
                  tags: [],
                  status: 'draft',
                  view_count: 0,
                  read_time: 0,
                  ai_generated: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  published_at: undefined
                });
                setActiveView('editor');
              }}
              onBack={() => setActiveView('overview')}
            />
          </motion.div>
        )}

        {activeView === 'ai-generator' && (
          <motion.div
            key="ai-generator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AIBlogGenerator 
              onBack={() => setActiveView('overview')}
              onGenerateComplete={(title, content) => {
                setEditingPost({
                  id: Date.now().toString(),
                  slug: '',
                  title,
                  content,
                  summary: '',
                  author: { id: '', username: user.name, email: user.email, first_name: '', last_name: '', profile_picture: '', bio: '', total_posts: 0, total_drafts: 0, created_at: '', updated_at: '' },
                  category: undefined,
                  tags: [],
                  status: 'draft',
                  view_count: 0,
                  read_time: 0,
                  ai_generated: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  published_at: undefined
                });
                setActiveView('editor');
              }}
            />
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}