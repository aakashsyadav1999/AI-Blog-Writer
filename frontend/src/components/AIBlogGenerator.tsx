import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Wand2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { aiService } from '../services/api';

interface AIBlogGeneratorProps {
  onBack: () => void;
  onGenerateComplete: (title: string, content: string) => void;
}

export function AIBlogGenerator({ onBack, onGenerateComplete }: AIBlogGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ title: string; content: string } | null>(null);

  const wordCount = prompt.trim().split(/\s+/).filter(word => word.length > 0).length;
  const maxWords = 1000;
  const isOverLimit = wordCount > maxWords;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (isOverLimit) {
      toast.error(`Prompt exceeds ${maxWords} words limit`);
      return;
    }

    setIsGenerating(true);

    try {
      // Call the real AI API
      const response = await aiService.generateArticle(prompt);
      
      // Extract the title and content from the response
      const title = prompt.length > 100 ? prompt.substring(0, 97) + '...' : prompt;
      const content = response.result || response;

      setGeneratedContent({ title, content: typeof content === 'string' ? content : JSON.stringify(content) });
      toast.success('Blog generated successfully!');
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate blog. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseGenerated = () => {
    if (generatedContent) {
      onGenerateComplete(generatedContent.title, generatedContent.content);
    }
  };

  const handleReset = () => {
    setGeneratedContent(null);
    setPrompt('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              AI Blog Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Describe what you want to write about, and AI will generate a complete blog post for you
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!generatedContent ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Info Card */}
              <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 border-2 border-emerald-200 dark:border-emerald-700">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-700 dark:bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-gray-900 dark:text-white font-semibold">
                        How to write a good prompt
                      </h3>
                      <ul className="text-sm text-emerald-800 dark:text-emerald-100 space-y-1">
                        <li>• Be specific about your topic and target audience</li>
                        <li>• Include key points or sections you want covered</li>
                        <li>• Mention the tone (professional, casual, technical, etc.)</li>
                        <li>• Specify any examples or case studies to include</li>
                        <li>• Keep it under {maxWords} words for best results</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Input Area */}
              <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <motion.div 
                  className="w-full max-w-3xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-2 border-gray-200 dark:border-emerald-900/50 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Enter your prompt
                          </label>
                          <Badge 
                            variant={isOverLimit ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {wordCount} / {maxWords} words
                          </Badge>
                        </div>
                        <Textarea
                          placeholder="Example: Write a comprehensive guide about getting started with React hooks for beginners. Include practical examples, common mistakes to avoid, and best practices. The tone should be friendly and educational, targeting developers who are new to React..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="min-h-[350px] resize-y text-base dark:bg-gray-800 dark:border-emerald-800/50 dark:text-gray-100 dark:placeholder:text-gray-500"
                          disabled={isGenerating}
                        />
                        {isOverLimit && (
                          <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Prompt exceeds word limit. Please reduce it to {maxWords} words or less.</span>
                          </div>
                        )}
                      </div>

                      <motion.div 
                        className="flex justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleGenerate}
                          disabled={isGenerating || !prompt.trim() || isOverLimit}
                          size="lg"
                          className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 px-8"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Generating your blog...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-5 h-5 mr-2" />
                              Generate Blog Post
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>

                  {/* Tips Section */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    <p>💡 Tip: The more detailed your prompt, the better the generated content will be</p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Preview Card */}
              <Card className="mb-6 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-700 dark:bg-green-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Blog Generated Successfully!
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Review the content below and edit as needed
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleReset}>
                        Generate New
                      </Button>
                      <Button 
                        onClick={handleUseGenerated}
                        className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                      >
                        Use This Blog
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Content */}
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 pb-4 border-b dark:border-emerald-900/50">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {generatedContent.title}
                    </h2>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
                      {generatedContent.content}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
