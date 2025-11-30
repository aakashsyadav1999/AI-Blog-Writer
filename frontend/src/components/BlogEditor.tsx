import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Wand2, 
  Sparkles,
  Eye,
  Upload,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { blogService, categoryService, tagService } from '../services/api';
import type { BlogPost as APIBlogPost, BlogPostCreate, Category, Tag } from '../types/api';
import { Alert, AlertDescription } from './ui/alert';

interface BlogEditorProps {
  post: APIBlogPost | null;
  onCancel: () => void;
  previousPosts: APIBlogPost[];
}

export function BlogEditor({ post, onCancel, previousPosts }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [summary, setSummary] = useState(post?.summary || '');
  const [categoryId, setCategoryId] = useState(post?.category?.id || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(post?.tags?.map(t => t.id) || []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [error, setError] = useState('');

  useEffect(() => {
    // Temporarily disabled to debug
    // fetchCategories();
    // fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await tagService.getTags();
      setTags(response);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error('Please add a title');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (post) {
        await blogService.updatePost(post.slug, {
          title,
          content,
          summary,
          category_id: categoryId || undefined,
          tag_ids: selectedTags,
          status: 'draft'
        });
        toast.success('Draft updated successfully');
      } else {
        const postData: BlogPostCreate = {
          title,
          content: content || 'Draft content',
          summary,
          category_id: categoryId || undefined,
          tag_ids: selectedTags,
          status: 'draft',
          ai_generated: false
        };
        await blogService.createPost(postData);
        toast.success('Draft saved successfully');
      }
      onCancel();
    } catch (err: any) {
      console.error('Save error:', err);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to save';
      setError(errorMsg);
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please add title and content');
      return;
    }
    if (!summary.trim()) {
      toast.error('Please add a summary before publishing');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (post) {
        await blogService.updatePost(post.slug, {
          title,
          content,
          summary,
          category_id: categoryId || undefined,
          tag_ids: selectedTags,
          status: 'published'
        });
        await blogService.publishPost(post.slug);
      } else {
        const postData: BlogPostCreate = {
          title,
          content,
          summary,
          category_id: categoryId || undefined,
          tag_ids: selectedTags,
          status: 'published',
          ai_generated: false
        };
        await blogService.createPost(postData);
      }
      toast.success('Published successfully!');
      onCancel();
    } catch (err: any) {
      console.error('Publish error:', err);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to publish';
      setError(errorMsg);
      toast.error('Failed to publish post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button onClick={handlePublish} className="bg-emerald-700 hover:bg-emerald-800" disabled={isSaving}>
            <Upload className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
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
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as 'write' | 'preview')}>
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
                    <Label htmlFor="summary">Summary</Label>
                    <Input
                      id="summary"
                      placeholder="Brief summary of your post..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={categoryId || undefined} onValueChange={setCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Select value={selectedTags[0] || undefined} onValueChange={(value: string) => {
                      if (value && !selectedTags.includes(value)) {
                        setSelectedTags([...selectedTags, value]);
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add tags" />
                      </SelectTrigger>
                      <SelectContent>
                        {tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map((tagId) => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <Badge 
                            key={tagId} 
                            variant="secondary" 
                            className="cursor-pointer" 
                            onClick={() => setSelectedTags(selectedTags.filter(id => id !== tagId))}
                          >
                            {tag.name} ×
                          </Badge>
                        ) : null;
                      })}
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
                  <div className="prose max-w-none dark:prose-invert">
                    <h1>{title || 'Untitled Post'}</h1>
                    {summary && (
                      <p className="text-gray-600 dark:text-gray-400 italic">{summary}</p>
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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>✍️ Keep paragraphs short and scannable</p>
              <p>🎯 Focus on one main idea per section</p>
              <p>📊 Use data and examples to support points</p>
              <p>🔗 Include relevant internal links</p>
              <p>📝 End with a clear call-to-action</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
