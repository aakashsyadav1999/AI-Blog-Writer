import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from './AnimatedBackground';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { Alert, AlertDescription } from './ui/alert';

interface LoginPageProps {
  onLogin: (email: string, name: string) => void;
  onGoHome: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function LoginPage({ onLogin, onGoHome, theme, onToggleTheme }: LoginPageProps) {
  // Login form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form states
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPassword2, setSignupPassword2] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!loginUsername || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call Django API login endpoint
      const response = await authService.login(loginUsername, loginPassword);
      
      // Success! User data is automatically stored in localStorage by authService
      const user = response.user;
      toast.success(`Welcome back, ${user.username}!`);
      
      // Pass user data to parent component
      onLogin(user.email, user.username);
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle different error types
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data?.detail 
          || err.response.data?.non_field_errors?.[0]
          || 'Invalid username or password';
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err.request) {
        // Request made but no response (server down, network error)
        setError('Cannot connect to server. Please ensure the Django backend is running.');
        toast.error('Server connection failed');
      } else {
        // Something else happened
        setError('An unexpected error occurred');
        toast.error('Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!signupUsername || !signupEmail || !signupPassword || !signupPassword2) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (signupPassword !== signupPassword2) {
      setError('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call Django API registration endpoint
      await authService.register(
        signupUsername,
        signupEmail,
        signupPassword,
        signupPassword2
      );
      
      // Success! User is automatically logged in by authService
      toast.success('Account created successfully! Welcome!');
      
      // Get the user data
      const user = authService.getStoredUser();
      onLogin(user.email, user.username);
      
    } catch (err: any) {
      console.error('Signup error:', err);
      
      if (err.response?.data) {
        // Extract error messages from Django response
        const errors = err.response.data;
        let errorMessage = '';
        
        if (errors.username) {
          errorMessage = `Username: ${errors.username[0]}`;
        } else if (errors.email) {
          errorMessage = `Email: ${errors.email[0]}`;
        } else if (errors.password1 || errors.password) {
          errorMessage = errors.password1?.[0] || errors.password?.[0];
        } else if (errors.non_field_errors) {
          errorMessage = errors.non_field_errors[0];
        } else {
          errorMessage = 'Registration failed. Please check your information.';
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err.request) {
        setError('Cannot connect to server. Please ensure the Django backend is running.');
        toast.error('Server connection failed');
      } else {
        setError('An unexpected error occurred');
        toast.error('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 flex items-center justify-center px-4 relative">
      <AnimatedBackground />
      
      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div 
          className="flex items-center justify-center gap-2 mb-8 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onGoHome}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <Sparkles className="w-10 h-10 text-emerald-700 dark:text-emerald-400" />
          </motion.div>
          <span className="text-2xl text-emerald-800 dark:text-emerald-300">BlogAI Writer</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-700 hover:bg-emerald-800"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Connected to Django backend at localhost:8000
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname">First Name</Label>
                      <Input
                        id="signup-firstname"
                        type="text"
                        placeholder="John"
                        value={signupFirstName}
                        onChange={(e) => setSignupFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname">Last Name</Label>
                      <Input
                        id="signup-lastname"
                        type="text"
                        placeholder="Doe"
                        value={signupLastName}
                        onChange={(e) => setSignupLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username *</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="johndoe"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500">Minimum 8 characters</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password2">Confirm Password *</Label>
                    <Input
                      id="signup-password2"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword2}
                      onChange={(e) => setSignupPassword2(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-700 hover:bg-emerald-800"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Your account will be stored in the Django backend
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  );
}