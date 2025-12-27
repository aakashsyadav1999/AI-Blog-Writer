import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Wand2, 
  Sparkles,
  Eye,
  Upload,
  Loader2,
  AlertCircle,
  Maximize2,
  Bold,
  Italic,
  Underline,
  Link2,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  X,
  Highlighter,
  Type
} from 'lucide-react';
import { toast } from 'sonner';
import { blogService, categoryService, tagService, aiService } from '../services/api';
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
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(post?.tags?.map(t => t.id) || []);
  const [newTagsInput, setNewTagsInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerateFromTitle = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await aiService.generateArticle(title);
      setContent(response.result);
      toast.success('Content generated successfully!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to generate content';
      toast.error(errorMsg);
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

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

  // Rich text formatting functions
  const insertFormatting = (before: string, after: string = '', placeholder: string = 'text') => {
    const textarea = contentRef.current;
    console.log('insertFormatting called', { textarea, hasRef: !!textarea });
    
    if (!textarea) {
      console.error('Textarea ref is null');
      toast.error('Please click in the editor first');
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    console.log('Selection:', { start, end, selectedText });
    
    // Check if the selected text already has the formatting (toggle functionality)
    const beforeStart = Math.max(0, start - before.length);
    const afterEnd = Math.min(content.length, end + after.length);
    const textBefore = content.substring(beforeStart, start);
    const textAfter = content.substring(end, afterEnd);
    
    if (textBefore === before && textAfter === after && selectedText) {
      // Remove formatting
      const newText = content.substring(0, beforeStart) + selectedText + content.substring(afterEnd);
      setContent(newText);
      
      setTimeout(() => {
        if (textarea) {
          textarea.focus();
          // Select the unformatted text
          textarea.setSelectionRange(beforeStart, beforeStart + selectedText.length);
        }
      }, 10);
      return;
    }
    
    // Add formatting
    const textToInsert = selectedText || placeholder;
    const before_text = content.substring(0, start);
    const after_text = content.substring(end);
    const newText = before_text + before + textToInsert + after + after_text;
    
    console.log('Setting new content');
    setContent(newText);
    
    // Focus and set selection after state updates
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        if (selectedText) {
          // If text was selected, place cursor after the formatted text
          const newPos = start + before.length + textToInsert.length + after.length;
          textarea.setSelectionRange(newPos, newPos);
        } else {
          // If no text was selected, select the placeholder
          const startPos = start + before.length;
          const endPos = startPos + textToInsert.length;
          textarea.setSelectionRange(startPos, endPos);
        }
      }
    }, 10);
  };

  const insertHeading = (level: number) => {
    const textarea = contentRef.current;
    if (!textarea) {
      toast.error('Editor not ready');
      return;
    }
    
    const start = textarea.selectionStart;
    const hashes = '#'.repeat(level);
    const placeholder = 'Heading';
    
    const before_text = content.substring(0, start);
    const after_text = content.substring(start);
    const newText = before_text + hashes + ' ' + placeholder + after_text;
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      const startPos = start + hashes.length + 1;
      const endPos = startPos + placeholder.length;
      textarea.setSelectionRange(startPos, endPos);
    }, 10);
  };

  const insertBold = () => {
    insertFormatting('**', '**', 'bold text');
  };
  
  const insertItalic = () => {
    insertFormatting('*', '*', 'italic text');
  };
  
  const insertUnderline = () => {
    insertFormatting('<u>', '</u>', 'underlined text');
  };
  
  const insertHighlight = () => {
    insertFormatting('<mark>', '</mark>', 'highlighted text');
  };
  
  const insertCode = () => {
    insertFormatting('`', '`', 'code');
  };
  
  const insertQuote = () => {
    const textarea = contentRef.current;
    if (!textarea) {
      toast.error('Editor not ready');
      return;
    }
    
    const start = textarea.selectionStart;
    const placeholder = 'quote';
    
    const before_text = content.substring(0, start);
    const after_text = content.substring(start);
    const newText = before_text + '> ' + placeholder + after_text;
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      const startPos = start + 2;
      const endPos = startPos + placeholder.length;
      textarea.setSelectionRange(startPos, endPos);
    }, 10);
  };
  
  const insertBulletList = () => {
    const textarea = contentRef.current;
    if (!textarea) {
      toast.error('Editor not ready');
      return;
    }
    
    const start = textarea.selectionStart;
    const placeholder = 'list item';
    
    const before_text = content.substring(0, start);
    const after_text = content.substring(start);
    const newText = before_text + '- ' + placeholder + after_text;
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      const startPos = start + 2;
      const endPos = startPos + placeholder.length;
      textarea.setSelectionRange(startPos, endPos);
    }, 10);
  };
  
  const insertNumberedList = () => {
    const textarea = contentRef.current;
    if (!textarea) {
      toast.error('Editor not ready');
      return;
    }
    
    const start = textarea.selectionStart;
    const placeholder = 'list item';
    
    const before_text = content.substring(0, start);
    const after_text = content.substring(start);
    const newText = before_text + '1. ' + placeholder + after_text;
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      const startPos = start + 3;
      const endPos = startPos + placeholder.length;
      textarea.setSelectionRange(startPos, endPos);
    }, 10);
  };

  const handleInsertLink = () => {
    if (!linkUrl || !linkText) {
      toast.error('Please provide both URL and text');
      return;
    }
    insertFormatting(`[${linkText}](${linkUrl})`);
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleInsertImage = () => {
    if (!imageUrl) {
      toast.error('Please provide image URL');
      return;
    }
    const altText = imageAlt || 'image';
    insertFormatting(`![${altText}](${imageUrl})\n\n`);
    setShowImageDialog(false);
    setImageUrl('');
    setImageAlt('');
  };

  const renderPreview = () => {
    if (!content) return '<p class="text-gray-500 dark:text-gray-400">No content yet...</p>';
    
    // Split content into lines for processing
    let lines = content.split('\n');
    let html: string[] = [];
    let inList = false;
    let listType = ''; // 'ul' or 'ol'
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Skip empty lines
      if (!line.trim()) {
        if (inList) {
          html.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        html.push('<br/>');
        continue;
      }
      
      // Process images first (they should be on their own line)
      if (line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)) {
        if (inList) {
          html.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        line = line.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-md my-4" />');
        html.push(line);
        continue;
      }
      
      // Process headers
      if (line.match(/^### /)) {
        if (inList) {
          html.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        line = line.replace(/^### (.*)$/, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">$1</h3>');
        html.push(line);
        continue;
      }
      if (line.match(/^## /)) {
        if (inList) {
          html.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        line = line.replace(/^## (.*)$/, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">$1</h2>');
        html.push(line);
        continue;
      }
      if (line.match(/^# /)) {
        if (inList) {
          html.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        line = line.replace(/^# (.*)$/, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">$1</h1>');
        html.push(line);
        continue;
      }
      
      // Process blockquotes
      if (line.match(/^> /)) {
        if (inList) {
          html.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        line = line.replace(/^> (.*)$/, '<blockquote class="border-l-4 border-emerald-500 pl-4 italic text-gray-700 dark:text-gray-300 my-4">$1</blockquote>');
        html.push(line);
        continue;
      }
      
      // Process bullet lists
      if (line.match(/^[\-\*] /)) {
        if (!inList || listType !== 'ul') {
          if (inList) html.push(`</${listType}>`);
          html.push('<ul class="list-disc list-inside my-4 space-y-2 ml-4">');
          inList = true;
          listType = 'ul';
        }
        let listItemText = line.replace(/^[\-\*] /, '');
        // Apply inline formatting to list item text
        listItemText = listItemText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-600 dark:text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
        listItemText = listItemText.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
        listItemText = listItemText.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
        listItemText = listItemText.replace(/<u>(.*?)<\/u>/g, '<u class="underline">$1</u>');
        listItemText = listItemText.replace(/<mark>(.*?)<\/mark>/g, '<mark class="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">$1</mark>');
        listItemText = listItemText.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>');
        html.push(`<li class="text-gray-700 dark:text-gray-300">${listItemText}</li>`);
        continue;
      }
      
      // Process numbered lists
      if (line.match(/^\d+\. /)) {
        if (!inList || listType !== 'ol') {
          if (inList) html.push(`</${listType}>`);
          html.push('<ol class="list-decimal list-inside my-4 space-y-2 ml-4">');
          inList = true;
          listType = 'ol';
        }
        let listItemText = line.replace(/^\d+\. /, '');
        // Apply inline formatting to list item text
        listItemText = listItemText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-600 dark:text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
        listItemText = listItemText.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
        listItemText = listItemText.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
        listItemText = listItemText.replace(/<u>(.*?)<\/u>/g, '<u class="underline">$1</u>');
        listItemText = listItemText.replace(/<mark>(.*?)<\/mark>/g, '<mark class="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">$1</mark>');
        listItemText = listItemText.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>');
        html.push(`<li class="text-gray-700 dark:text-gray-300">${listItemText}</li>`);
        continue;
      }
      
      // Close list if we're in one and hit regular text
      if (inList) {
        html.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      
      // Process inline formatting for regular paragraphs
      // Links (process before bold/italic to avoid conflicts)
      line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-600 dark:text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      // Images inline
      line = line.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="inline-block max-w-full h-auto rounded-lg shadow-md" />');
      
      // Bold (must process before italic to avoid conflicts)
      line = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
      
      // Italic (process after bold)
      line = line.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
      
      // Underline
      line = line.replace(/<u>(.*?)<\/u>/g, '<u class="underline">$1</u>');
      
      // Highlight
      line = line.replace(/<mark>(.*?)<\/mark>/g, '<mark class="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">$1</mark>');
      
      // Inline code
      line = line.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>');
      
      // Wrap in paragraph
      html.push(`<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${line}</p>`);
    }
    
    // Close list if still open
    if (inList) {
      html.push(`</${listType}>`);
    }
    
    return html.join('\n');
  };

  return (
    <>
      <motion.div 
        className="max-w-5xl mx-auto px-4 py-8 min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onCancel} className="dark:text-gray-300 dark:hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving} className="dark:border-emerald-800 dark:hover:bg-emerald-950">
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button onClick={handlePublish} className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700" disabled={isSaving}>
              <Upload className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="dark:bg-emerald-950/30 dark:border-emerald-900/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="dark:text-gray-100">
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
                      <Label htmlFor="title" className="dark:text-gray-200">Title</Label>
                      <div className="flex gap-2">
                        <Input
                          id="title"
                          placeholder="Enter your blog post title..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="dark:bg-gray-900 dark:border-emerald-900 dark:text-gray-100 flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateFromTitle}
                          disabled={isGenerating || !title.trim()}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 dark:from-emerald-700 dark:to-teal-700"
                          title="Generate content from title using AI"
                        >
                          {isGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Wand2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {title && !content && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Click the magic wand to generate content from your title
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary" className="dark:text-gray-200">Summary</Label>
                      <Input
                        id="summary"
                        placeholder="Brief summary of your post..."
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="dark:bg-gray-900 dark:border-emerald-900 dark:text-gray-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="dark:text-gray-200">
                        Category
                        {categories.length === 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            (Enter categories separated by spaces)
                          </span>
                        )}
                      </Label>
                      {categories.length > 0 ? (
                        <Select value={categoryId || undefined} onValueChange={setCategoryId}>
                          <SelectTrigger className="dark:bg-gray-900 dark:border-emerald-900 dark:text-gray-100">
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
                      ) : (
                        <Input
                          id="category"
                          placeholder="e.g., Technology Programming AI (separate by spaces)"
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          className="dark:bg-gray-900 dark:border-emerald-900 dark:text-gray-100"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags" className="dark:text-gray-200">
                        Tags
                        {tags.length === 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            (Enter tags separated by spaces)
                          </span>
                        )}
                      </Label>
                      {tags.length > 0 ? (
                        <>
                          <Select value={selectedTags[0] || undefined} onValueChange={(value: string) => {
                            if (value && !selectedTags.includes(value)) {
                              setSelectedTags([...selectedTags, value]);
                            }
                          }}>
                            <SelectTrigger className="dark:bg-gray-900 dark:border-emerald-900 dark:text-gray-100">
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
                        </>
                      ) : (
                        <>
                          <Input
                            id="tags"
                            placeholder="e.g., python django rest-api backend (separate by spaces)"
                            value={newTagsInput}
                            onChange={(e) => {
                              setNewTagsInput(e.target.value);
                              // Convert space-separated tags to array
                              const tagsArray = e.target.value
                                .split(' ')
                                .map(tag => tag.trim())
                                .filter(tag => tag.length > 0);
                              setCustomTags(tagsArray);
                            }}
                            className="dark:bg-gray-900 dark:border-emerald-900 dark:text-gray-100"
                          />
                          {customTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {customTags.map((tag, index) => (
                                <Badge 
                                  key={index} 
                                  variant="secondary" 
                                  className="cursor-pointer" 
                                  onClick={() => {
                                    const newTags = customTags.filter((_, i) => i !== index);
                                    setCustomTags(newTags);
                                    setNewTagsInput(newTags.join(' '));
                                  }}
                                >
                                  {tag} ×
                                </Badge>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="content" className="dark:text-gray-200">Content</Label>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {content.length} characters | {content.split(/\s+/).filter(w => w).length} words | {Math.ceil(content.split(/\s+/).filter(w => w).length / 200)} min read
                        </div>
                      </div>
                      
                      {/* Rich Text Toolbar */}
                      <Card className="p-2 dark:bg-gray-900 dark:border-emerald-900">
                        <div className="flex flex-wrap gap-1">
                          <Button variant="ghost" size="sm" onClick={() => insertHeading(1)} title="Heading 1">
                            <Heading1 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => insertHeading(2)} title="Heading 2">
                            <Heading2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => insertHeading(3)} title="Heading 3">
                            <Heading3 className="w-4 h-4" />
                          </Button>
                          <Separator orientation="vertical" className="h-8 mx-1" />
                          <Button variant="ghost" size="sm" onClick={insertBold} title="Bold">
                            <Bold className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={insertItalic} title="Italic">
                            <Italic className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={insertUnderline} title="Underline">
                            <Underline className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={insertHighlight} title="Highlight">
                            <Highlighter className="w-4 h-4" />
                          </Button>
                          <Separator orientation="vertical" className="h-8 mx-1" />
                          <Button variant="ghost" size="sm" onClick={insertBulletList} title="Bullet List">
                            <List className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={insertNumberedList} title="Numbered List">
                            <ListOrdered className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={insertQuote} title="Quote">
                            <Quote className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={insertCode} title="Code">
                            <Code className="w-4 h-4" />
                          </Button>
                          <Separator orientation="vertical" className="h-8 mx-1" />
                          <Button variant="ghost" size="sm" onClick={() => setShowLinkDialog(true)} title="Insert Link">
                            <Link2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setShowImageDialog(true)} title="Insert Image">
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>

                      <Textarea
                        ref={contentRef}
                        id="content"
                        placeholder="Start writing your blog post... Use the toolbar above for formatting!"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[600px] font-mono dark:bg-gray-900 dark:border-emerald-900 dark:text-gray-100 text-base leading-relaxed resize-y"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="prose prose-emerald max-w-none dark:prose-invert">
                      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{title || 'Untitled Post'}</h1>
                      {summary && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 italic mb-6">{summary}</p>
                      )}
                      <Separator className="my-6" />
                      <div 
                        className="blog-preview-content"
                        dangerouslySetInnerHTML={{ __html: renderPreview() }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="dark:bg-emerald-950/30 dark:border-emerald-900/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
                  <Sparkles className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">✍️ Structure</p>
                  <p className="text-xs">Use headings to organize your content into scannable sections</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">🎯 Focus</p>
                  <p className="text-xs">Keep each section focused on one main idea</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">📊 Visual Content</p>
                  <p className="text-xs">Add images and highlights to break up text and emphasize key points</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">🔗 Links</p>
                  <p className="text-xs">Include relevant links to provide additional context and resources</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">📝 CTA</p>
                  <p className="text-xs">End with a clear call-to-action for your readers</p>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-emerald-950/30 dark:border-emerald-900/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
                  <Type className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  Formatting Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-gray-600 dark:text-gray-400 font-mono">
                <p><strong className="text-gray-700 dark:text-gray-300"># Heading 1</strong></p>
                <p><strong className="text-gray-700 dark:text-gray-300">## Heading 2</strong></p>
                <p><strong className="text-gray-700 dark:text-gray-300">**bold**</strong></p>
                <p><strong className="text-gray-700 dark:text-gray-300">*italic*</strong></p>
                <p><strong className="text-gray-700 dark:text-gray-300">[link](url)</strong></p>
                <p><strong className="text-gray-700 dark:text-gray-300">![alt](image-url)</strong></p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-emerald-900">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-text" className="dark:text-gray-200">Link Text</Label>
              <Input
                id="link-text"
                placeholder="Enter link text..."
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="dark:bg-gray-800 dark:border-emerald-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url" className="dark:text-gray-200">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="dark:bg-gray-800 dark:border-emerald-900 dark:text-gray-100"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
              <Button onClick={handleInsertLink} className="bg-emerald-700 hover:bg-emerald-800">Insert Link</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-emerald-900">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url" className="dark:text-gray-200">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="dark:bg-gray-800 dark:border-emerald-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-alt" className="dark:text-gray-200">Alt Text (Optional)</Label>
              <Input
                id="image-alt"
                placeholder="Description of the image"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="dark:bg-gray-800 dark:border-emerald-900 dark:text-gray-100"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowImageDialog(false)}>Cancel</Button>
              <Button onClick={handleInsertImage} className="bg-emerald-700 hover:bg-emerald-800">Insert Image</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Editor Dialog */}
      <AnimatePresence>
        {isFullscreen && (
          <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
            <DialogContent className="max-w-[95vw] h-[95vh] dark:bg-gray-900 dark:border-emerald-900 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b dark:border-emerald-900">
                  <DialogTitle className="dark:text-gray-100">Fullscreen Editor</DialogTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Rich Text Toolbar */}
                <div className="p-2 border-b dark:border-emerald-900 bg-gray-50 dark:bg-gray-800">
                  <div className="flex flex-wrap gap-1">
                    <Button variant="ghost" size="sm" onClick={() => insertHeading(1)} title="Heading 1">
                      <Heading1 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertHeading(2)} title="Heading 2">
                      <Heading2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertHeading(3)} title="Heading 3">
                      <Heading3 className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-8 mx-1" />
                    <Button variant="ghost" size="sm" onClick={insertBold} title="Bold">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={insertItalic} title="Italic">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={insertUnderline} title="Underline">
                      <Underline className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={insertHighlight} title="Highlight">
                      <Highlighter className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-8 mx-1" />
                    <Button variant="ghost" size="sm" onClick={insertBulletList} title="Bullet List">
                      <List className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={insertNumberedList} title="Numbered List">
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={insertQuote} title="Quote">
                      <Quote className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={insertCode} title="Code">
                      <Code className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-8 mx-1" />
                    <Button variant="ghost" size="sm" onClick={() => setShowLinkDialog(true)} title="Insert Link">
                      <Link2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowImageDialog(true)} title="Insert Image">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-hidden">
                  <Textarea
                    ref={contentRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your blog post... Use the toolbar above for formatting!"
                    className="w-full h-full resize-none font-mono dark:bg-gray-900 dark:border-emerald-900 dark:text-gray-100 text-base"
                  />
                </div>

                <div className="p-4 border-t dark:border-emerald-900 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {content.length} characters | {content.split(/\s+/).filter(w => w).length} words
                  </span>
                  <Button onClick={() => setIsFullscreen(false)} className="bg-emerald-700 hover:bg-emerald-800">
                    Done Editing
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
