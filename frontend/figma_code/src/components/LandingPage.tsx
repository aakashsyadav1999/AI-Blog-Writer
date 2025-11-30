import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, BookOpen, Target, Zap, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { AnimatedBackground } from './AnimatedBackground';
import { motion } from 'motion/react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-emerald-700" />
            <span className="text-xl text-emerald-800">BlogAI Writer</span>
          </div>
          <Button variant="outline" onClick={onGetStarted}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          Coming Soon
        </Badge>
        <h1 className="mb-6 max-w-4xl mx-auto text-emerald-950">
          Create Engaging Blog Posts with AI in Minutes
        </h1>
        <p className="mb-8 max-w-2xl mx-auto text-gray-700 text-xl">
          Write manually, let AI assist you, or discover trending topics automatically. 
          Publish to multiple platforms with one click.
        </p>

        {/* Waitlist Form */}
        {!isSubmitted ? (
          <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto mb-12">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
                Join Waitlist
              </Button>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Be the first to know when we launch
            </p>
          </form>
        ) : (
          <div className="max-w-md mx-auto mb-12 p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-700 justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>You're on the list!</span>
            </div>
            <p className="text-sm text-green-600">
              We'll send you an email as soon as BlogAI Writer is ready.
            </p>
          </div>
        )}

        <Button 
          onClick={onGetStarted} 
          size="lg"
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          Try Demo Now
        </Button>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="mb-12 text-center text-gray-900">
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
            <Card className="border-2 hover:shadow-lg transition-shadow hover:border-emerald-200 h-full">
              <CardContent className="pt-6">
                <motion.div 
                  className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <BookOpen className="w-6 h-6 text-emerald-700" />
                </motion.div>
                <h3 className="mb-2 text-gray-900">Flexible Writing Modes</h3>
                <p className="text-gray-600">
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
            <Card className="border-2 hover:shadow-lg transition-shadow hover:border-emerald-200 h-full">
              <CardContent className="pt-6">
                <motion.div 
                  className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Target className="w-6 h-6 text-teal-700" />
                </motion.div>
                <h3 className="mb-2 text-gray-900">Hot Topic Discovery</h3>
                <p className="text-gray-600">
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
            <Card className="border-2 hover:shadow-lg transition-shadow hover:border-emerald-200 h-full">
              <CardContent className="pt-6">
                <motion.div 
                  className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Zap className="w-6 h-6 text-green-700" />
                </motion.div>
                <h3 className="mb-2 text-gray-900">Multi-Platform Publishing</h3>
                <p className="text-gray-600">
                  Publish to WordPress, Medium, Dev.to, and other platforms with a single click.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl my-16 relative z-10">
        <h2 className="mb-12 text-center text-gray-900">
          How It Works
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-700 text-white rounded-full flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="mb-2 text-gray-900">Sign Up & Login</h3>
              <p className="text-gray-600">
                Create your account and access your personalized dashboard.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-700 text-white rounded-full flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="mb-2 text-gray-900">Choose Your Writing Method</h3>
              <p className="text-gray-600">
                Write manually, get AI suggestions, or let AI discover hot topics for you.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-700 text-white rounded-full flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="mb-2 text-gray-900">Publish Everywhere</h3>
              <p className="text-gray-600">
                Select your target platforms and publish your content with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-16 text-center relative z-10">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl p-12 text-white">
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h2 className="mb-4">Ready to Transform Your Content Creation?</h2>
          <p className="mb-8 text-emerald-100 max-w-2xl mx-auto">
            Join our waitlist and be among the first to experience the future of blog writing.
          </p>
          <Button 
            onClick={onGetStarted} 
            size="lg"
            variant="secondary"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        <p>© 2024 BlogAI Writer. All rights reserved.</p>
      </footer>
    </div>
  );
}
