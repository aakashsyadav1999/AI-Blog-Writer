import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, BookOpen, Target, Zap, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from './AnimatedBackground';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onGetStarted: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function LandingPage({ onGetStarted, theme, onToggleTheme }: LandingPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Store waitlist email in localStorage
      const waitlist = JSON.parse(localStorage.getItem('blogai_waitlist') || '[]');
      waitlist.push({ email, date: new Date().toISOString() });
      localStorage.setItem('blogai_waitlist', JSON.stringify(waitlist));
      setIsSubmitted(true);
      toast.success('You\'re on the waitlist! We\'ll notify you soon.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <Sparkles className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xl text-emerald-800 dark:text-emerald-300">BlogAI Writer</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Button variant="outline" onClick={onGetStarted}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/30">
            Coming Soon
          </Badge>
        </motion.div>
        <motion.h1 
          className="mb-6 max-w-4xl mx-auto text-emerald-950 dark:text-emerald-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Create Engaging Blog Posts with AI in Minutes
        </motion.h1>
        <motion.p 
          className="mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300 text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Write manually, let AI assist you, or discover trending topics automatically. 
          Publish to multiple platforms with one click.
        </motion.p>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
        {!isSubmitted ? (
          <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto mb-12">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 dark:bg-emerald-950/50 dark:border-emerald-800/50 dark:placeholder:text-gray-500"
              />
              <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                Join Waitlist
              </Button>
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Be the first to know when we launch
            </p>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto mb-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50"
          >
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>You're on the list!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-500">
              We'll send you an email as soon as BlogAI Writer is ready.
            </p>
          </motion.div>
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onGetStarted} 
            size="lg"
            className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            Try Demo Now
          </Button>
        </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="mb-12 text-center text-gray-900 dark:text-gray-100">
          Everything You Need to Create Amazing Content
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="border-2 hover:shadow-lg transition-shadow hover:border-emerald-200 dark:hover:border-emerald-700 h-full dark:bg-emerald-950/30 dark:border-emerald-900/30">
              <CardContent className="pt-6">
                <motion.div 
                  className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <BookOpen className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                </motion.div>
                <h3 className="mb-2 text-gray-900 dark:text-gray-100">Flexible Writing Modes</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Write from scratch, use AI assistance, or let AI generate content based on your ideas.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="border-2 hover:shadow-lg transition-shadow hover:border-emerald-200 dark:hover:border-emerald-700 h-full dark:bg-emerald-950/30 dark:border-emerald-900/30">
              <CardContent className="pt-6">
                <motion.div 
                  className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Target className="w-6 h-6 text-teal-700 dark:text-teal-400" />
                </motion.div>
                <h3 className="mb-2 text-gray-900 dark:text-gray-100">Hot Topic Discovery</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  AI analyzes your previous posts and suggests trending topics in your niche.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="border-2 hover:shadow-lg transition-shadow hover:border-emerald-200 dark:hover:border-emerald-700 h-full dark:bg-emerald-950/30 dark:border-emerald-900/30">
              <CardContent className="pt-6">
                <motion.div 
                  className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Zap className="w-6 h-6 text-green-700 dark:text-green-400" />
                </motion.div>
                <h3 className="mb-2 text-gray-900 dark:text-gray-100">Multi-Platform Publishing</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Publish to WordPress, Medium, Dev.to, and other platforms with a single click.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white/50 dark:bg-emerald-950/20 rounded-3xl my-16 relative z-10">
        <h2 className="mb-12 text-center text-gray-900 dark:text-gray-100">
          How It Works
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-8">
          {[
            {
              number: 1,
              title: 'Sign Up & Login',
              description: 'Create your account and access your personalized dashboard.'
            },
            {
              number: 2,
              title: 'Choose Your Writing Method',
              description: 'Write manually, get AI suggestions, or let AI discover hot topics for you.'
            },
            {
              number: 3,
              title: 'Publish Everywhere',
              description: 'Select your target platforms and publish your content with one click.'
            }
          ].map((step, index) => (
            <motion.div
              key={step.number}
              className="flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div 
                className="w-10 h-10 bg-emerald-700 dark:bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {step.number}
              </motion.div>
              <div>
                <h3 className="mb-2 text-gray-900 dark:text-gray-100">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-16 text-center relative z-10">
        <motion.div 
          className="bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-800 dark:to-teal-800 rounded-2xl p-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Mail className="w-12 h-12 mx-auto mb-4" />
          </motion.div>
          <h2 className="mb-4">Ready to Transform Your Content Creation?</h2>
          <p className="mb-8 text-emerald-100 dark:text-emerald-200 max-w-2xl mx-auto">
            Join our waitlist and be among the first to experience the future of blog writing.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onGetStarted} 
              size="lg"
              variant="secondary"
            >
              Get Started Now
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© 2024 BlogAI Writer. All rights reserved.</p>
      </footer>
    </div>
  );
}