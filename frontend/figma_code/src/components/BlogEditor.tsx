import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { PublishModal } from './PublishModal';
import { 
  ArrowLeft, 
  Save, 
  Wand2, 
  Sparkles,
  Eye,
  Upload
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  status: 'draft' | 'published';
}

interface BlogEditorProps {
  post: BlogPost | null;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
  previousPosts: BlogPost[];
}

export function BlogEditor({ post, onSave, onCancel, previousPosts }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [summary, setSummary] = useState(post?.summary || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setSummary(post.summary);
    }
  }, [post]);

  const handleSaveDraft = () => {
    if (!title.trim()) {
      toast.error('Please add a title');
      return;
    }

    const savedPost: BlogPost = {
      id: post?.id || Date.now().toString(),
      title,
      content,
      summary,
      createdAt: post?.createdAt || new Date().toISOString(),
      status: 'draft'
    };

    onSave(savedPost);
    toast.success('Draft saved successfully');
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please add title and content');
      return;
    }
    setShowPublishModal(true);
  };

  const handlePublishConfirm = (platforms: string[]) => {
    const publishedPost: BlogPost = {
      id: post?.id || Date.now().toString(),
      title,
      content,
      summary,
      createdAt: post?.createdAt || new Date().toISOString(),
      status: 'published'
    };

    onSave(publishedPost);
    toast.success(`Published to ${platforms.join(', ')}`);
    setShowPublishModal(false);
  };

  const handleAIImprove = async () => {
    if (!content.trim()) {
      toast.error('Please add some content first');
      return;
    }

    setIsGenerating(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const improvements = [
      '\n\n## Key Takeaways\n- This approach increases engagement\n- Readers find it more accessible\n- SEO benefits are significant',
      '\n\n**Pro Tip:** Consider adding relevant examples to illustrate your points and make the content more relatable to your audience.',
      '\n\n### Conclusion\nBy implementing these strategies, you\'ll see improved results and better audience engagement.'
    ];

    const randomImprovement = improvements[Math.floor(Math.random() * improvements.length)];
    setContent(content + randomImprovement);
    setIsGenerating(false);
    toast.success('Content improved with AI suggestions');
  };

  const handleGenerateSummary = async () => {
    if (!content.trim()) {
      toast.error('Please add content first');
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI summary generation
    const words = content.split(' ').slice(0, 15).join(' ');
    setSummary(`${words}...`);
    setIsGenerating(false);
    toast.success('Summary generated');
  };

  const handleAIExpand = async () => {
    if (!title.trim()) {
      toast.error('Please add a title first');
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2500));

    const expansions = [
      `${title} is a topic that has gained significant attention in recent years. Let's explore the key aspects that make this subject so important.\n\n## Understanding the Basics\n\nTo fully grasp this concept, we need to start with the fundamentals. ${title.toLowerCase()} represents a shift in how we approach modern challenges.\n\n## Practical Applications\n\nIn real-world scenarios, this can be applied in various ways...`,
      
      `When discussing ${title.toLowerCase()}, it's essential to consider both the benefits and challenges involved.\n\n### The Current Landscape\n\nThe industry has seen remarkable changes, and understanding these trends is crucial for success.\n\n### Best Practices\n\nExperts recommend the following approaches...`,
      
      `${title} has revolutionized the way we think about innovation and progress.\n\n## Why It Matters\n\nThis topic is relevant because it addresses fundamental questions about efficiency, scalability, and user experience.\n\n## Getting Started\n\nFor beginners, here are the essential steps...`
    ];

    const randomExpansion = expansions[Math.floor(Math.random() * expansions.length)];
    setContent(randomExpansion);
    setIsGenerating(false);
    toast.success('Content generated by AI');
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handlePublish} className="bg-emerald-700 hover:bg-emerald-800">
              <Upload className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {post ? 'Edit Post' : 'Create New Post'}
                  </CardTitle>
                  <Badge variant="secondary">
                    {post?.status || 'draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="write" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter your blog post title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary">Summary (Optional)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="summary"
                          placeholder="Brief summary of your post..."
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleGenerateSummary}
                          disabled={isGenerating}
                        >
                          <Wand2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Start writing your blog post..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[400px] font-mono"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="prose max-w-none">
                      <h1>{title || 'Untitled Post'}</h1>
                      {summary && (
                        <p className="text-gray-600 italic">{summary}</p>
                      )}
                      <div className="whitespace-pre-wrap">
                        {content || 'No content yet...'}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-emerald-700" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleAIExpand}
                  disabled={isGenerating}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate from Title'}
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleAIImprove}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Processing...' : 'Improve Content'}
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Summary'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>✍️ Keep paragraphs short and scannable</p>
                <p>🎯 Focus on one main idea per section</p>
                <p>📊 Use data and examples to support points</p>
                <p>🔗 Include relevant internal links</p>
                <p>📝 End with a clear call-to-action</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublishConfirm}
      />
    </>
  );
}
