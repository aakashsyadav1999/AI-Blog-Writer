import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, BookOpen, Target, Zap, CheckCircle2, Mail, Users, FileText, Clock, Star, TrendingUp, PlusCircle, Edit3 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';
import { AnimatedBackground } from './AnimatedBackground';

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
      const waitlist = JSON.parse(localStorage.getItem('blogai_waitlist') || '[]');
      waitlist.push({ email, date: new Date().toISOString() });
      localStorage.setItem('blogai_waitlist', JSON.stringify(waitlist));
      setIsSubmitted(true);
      toast.success('You\'re on the waitlist! We\'ll notify you soon.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-50 border-b border-gray-200/50 dark:border-emerald-800/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
              <span className="text-lg text-gray-900 dark:text-white font-medium">BlogAI Writer</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <Button 
                variant="ghost" 
                onClick={onGetStarted}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                Sign In
              </Button>
              <Button 
                onClick={onGetStarted}
                className="bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Now Available for Everyone
            </Badge>
            
            <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white font-bold tracking-tight">
              Write Better Blogs
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">Faster Than Ever</span>
            </h1>
            
            <p className="mb-10 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The all-in-one AI writing assistant that helps you research, write, and publish 
              engaging content in minutes, not hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-emerald-500 text-white hover:bg-emerald-600 h-12 px-8 transition-all"
              >
                Start Writing for Free
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 h-12 px-8 transition-all"
              >
                View Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Free 14-day trial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Cancel anytime
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-y border-gray-200/50 dark:border-emerald-900/20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: Users, value: '10,000+', label: 'Active Writers' },
            { icon: FileText, value: '1M+', label: 'Posts Generated' },
            { icon: Clock, value: '500k Hrs', label: 'Time Saved' },
            { icon: Star, value: '4.9/5', label: 'Happy Users' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl text-gray-900 dark:text-white font-semibold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 dark:text-white font-bold mb-4">
            Quick Actions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to create amazing content, all in one place.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: PlusCircle,
              title: 'Write New Post',
              desc: 'Start writing from scratch or use a template'
            },
            {
              icon: Sparkles,
              title: 'AI-Assisted Writing',
              desc: 'Let AI help you write engaging content'
            },
            {
              icon: TrendingUp,
              title: 'Discover Hot Topics',
              desc: 'AI-powered topic suggestions based on trends'
            }
          ].map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="cursor-pointer"
              onClick={onGetStarted}
            >
              <Card className="h-full !bg-white dark:!bg-slate-800/90 border-gray-200 dark:border-emerald-500/30 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 hover:bg-gray-50 dark:hover:!bg-slate-700/90 transition-all shadow-sm dark:shadow-none backdrop-blur-sm">
                <CardContent className="p-8">
                  <action.icon className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mb-4" />
                  <h3 className="text-lg text-gray-900 dark:text-white font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-200 leading-relaxed">{action.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 dark:text-white font-bold mb-4">
            Everything You Need to Scale
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful features designed to help you create high-quality content consistently.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: BookOpen,
              title: 'Flexible Writing Modes',
              desc: 'Write from scratch, use AI assistance, or let AI generate content based on your ideas.'
            },
            {
              icon: Target,
              title: 'SEO Optimization',
              desc: 'Built-in SEO tools ensure your content ranks high and reaches the right audience.'
            },
            {
              icon: Zap,
              title: 'Multi-Platform Publishing',
              desc: 'Publish to WordPress, Medium, Dev.to, and other platforms with a single click.'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full !bg-white dark:!bg-slate-800/90 border-gray-200 dark:border-emerald-500/30 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 transition-all shadow-sm dark:shadow-none backdrop-blur-sm">
                <CardContent className="p-8">
                  <feature.icon className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mb-4" />
                  <h3 className="text-lg text-gray-900 dark:text-white font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-200 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-y border-gray-200/50 dark:border-emerald-900/20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 dark:text-white font-bold mb-4">
            Loved by Content Creators
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            See what our users have to say about their experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              quote: "This tool has completely transformed how I write. I can produce high-quality content 5x faster.",
              author: "Sarah J.",
              role: "Tech Blogger"
            },
            {
              quote: "The SEO suggestions are spot on. My organic traffic has doubled since I started using BlogAI.",
              author: "Mike T.",
              role: "Marketing Director"
            },
            {
              quote: "Finally, an AI writer that understands nuance and tone. It feels like writing with a pro editor.",
              author: "Emily R.",
              role: "Freelance Writer"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full !bg-white dark:!bg-slate-800/90 border-gray-200 dark:border-emerald-500/30 shadow-sm dark:shadow-none backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex gap-0.5 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-white mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="text-gray-900 dark:text-white font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 dark:text-white font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that works best for you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: 'Starter',
              price: '$0',
              desc: 'Perfect for trying out BlogAI',
              features: ['5 AI-generated posts/mo', 'Basic SEO tools', '1 User seat', 'Email support'],
              cta: 'Start for Free',
              popular: false
            },
            {
              name: 'Pro',
              price: '$29',
              desc: 'For serious content creators',
              features: ['Unlimited AI posts', 'Advanced SEO analysis', 'Priority support', 'Custom brand voice', 'Team collaboration'],
              cta: 'Get Pro',
              popular: true
            },
            {
              name: 'Team',
              price: '$99',
              desc: 'Best for agencies and teams',
              features: ['Everything in Pro', '10 User seats', 'Advanced analytics', 'API Access', 'Dedicated support'],
              cta: 'Contact Sales',
              popular: false
            }
          ].map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-emerald-500 text-white border-0 px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card className={`h-full ${plan.popular ? '!bg-emerald-50 dark:!bg-emerald-900/40 border-emerald-500/50 dark:border-emerald-400/50' : '!bg-white dark:!bg-slate-800/90 border-gray-200 dark:border-emerald-500/30'} shadow-sm dark:shadow-none backdrop-blur-sm`}>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-lg text-gray-900 dark:text-white font-semibold mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{plan.desc}</p>
                  </div>
                  <div className="mb-8">
                    <span className="text-4xl text-gray-900 dark:text-white font-bold">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-300">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10'
                    } transition-all`}
                    onClick={onGetStarted}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/40 dark:to-teal-900/40 border border-emerald-500/30 dark:border-emerald-400/30 rounded-2xl p-12 lg:p-16 text-center backdrop-blur-sm">
          <h2 className="text-3xl lg:text-4xl text-gray-900 dark:text-white font-bold mb-6">
            Ready to Transform Your Content?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of writers who are creating better content faster with BlogAI Writer.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-emerald-500 text-white hover:bg-emerald-600 h-12 px-10 transition-all"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200/50 dark:border-emerald-900/20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <Sparkles className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-gray-900 dark:text-white font-medium">BlogAI Writer</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Empowering writers with AI to create meaningful content.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white text-sm mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white text-sm mb-4">Resources</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-200/50 dark:border-emerald-900/20">
            <p className="text-sm text-gray-500">© 2024 BlogAI Writer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}