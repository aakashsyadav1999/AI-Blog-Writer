import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('blogai_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    
    // Apply theme class to document
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
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

  const handleGoHome = () => {
    // If user is logged in, go to dashboard, otherwise go to landing page
    if (user) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('landing');
    }
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
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} onGoHome={handleGoHome} theme={theme} onToggleTheme={toggleTheme} />}
      {currentPage === 'dashboard' && user && <Dashboard user={user} onLogout={handleLogout} onGoHome={handleGoHome} theme={theme} onToggleTheme={toggleTheme} />}
      <Toaster />
    </>
  );
}