import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';

// Initialize theme synchronously to avoid flash
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('blogai_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light'; // Default to light
};

// Apply theme class immediately to prevent flash
const initialTheme = getInitialTheme();
if (typeof document !== 'undefined') {
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('blogai_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('blogai_theme', newTheme);
    
    // Apply theme class to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  const handleLogin = (email: string, name: string) => {
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('blogai_user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('blogai_user');
    setCurrentPage('landing');
  };

  return (
    <>
      {currentPage === 'landing' && <LandingPage onGetStarted={handleGetStarted} theme={theme} onToggleTheme={toggleTheme} />}
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} />}
      {currentPage === 'dashboard' && user && <Dashboard user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />}
      <Toaster />
    </>
  );
}