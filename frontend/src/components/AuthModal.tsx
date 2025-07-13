import React, { useState } from 'react';
import { X, User, Lock, Crown, Sparkles, Eye, EyeOff } from 'lucide-react';
import { loginUser, signupUser } from '../utils/authApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('Free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        const res = await loginUser(username, password);
        localStorage.setItem('token', res.access_token);
        window.dispatchEvent(new Event('authStateChanged'));
        onClose();
      } else {
        await signupUser(username, password, plan);
        setMode('login');
        setError('Signup successful! Please log in.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setUsername('');
    setPassword('');
    setPlan('Free');
    setMode('login');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md p-8 relative animate-scale-in">
        {/* Enhanced Close Button */}
        <button 
          className="absolute top-4 right-4 glass p-2 rounded-xl hover-glow transition-all duration-300" 
          onClick={handleClose}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="glass p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-gradient" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">
              {mode === 'login' ? 'Welcome Back' : 'Join Voice2Vision'}
            </h2>
          </div>
          <p className="text-gray-600 text-sm">
            {mode === 'login' 
              ? 'Sign in to continue creating amazing AI art' 
              : 'Create your account and start generating stunning images'
            }
          </p>
        </div>

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enhanced Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <User className="w-4 h-4 text-primary-500" />
              <span>Username</span>
            </label>
            <input
              type="text"
              className="input-primary"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Enhanced Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-primary-500" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-primary pr-12"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Enhanced Plan Selection */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <Crown className="w-4 h-4 text-primary-500" />
                <span>Plan</span>
              </label>
              <select
                className="input-primary"
                value={plan}
                onChange={e => setPlan(e.target.value)}
              >
                <option value="Free">Free Plan</option>
                <option value="Pro">Pro Plan</option>
              </select>
            </div>
          )}

          {/* Enhanced Error Display */}
          {error && (
            <div className={`glass p-4 rounded-xl border ${
              error.includes('success') 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className={`text-sm text-center flex items-center justify-center space-x-2 ${
                error.includes('success') ? 'text-green-600' : 'text-red-600'
              }`}>
                <Sparkles className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Enhanced Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full py-4 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="spinner w-5 h-5"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        {/* Enhanced Mode Toggle */}
        <div className="mt-6 text-center">
          <div className="glass p-4 rounded-xl">
            {mode === 'login' ? (
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors" 
                  onClick={() => { setMode('signup'); setError(''); }}
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors" 
                  onClick={() => { setMode('login'); setError(''); }}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 