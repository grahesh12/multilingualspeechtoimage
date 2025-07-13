import React, { useState } from 'react';
import { loginUser, signupUser } from '../utils/authApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { username: string; plan: string }, token: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('Free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        const res = await loginUser(username, password);
        onAuthSuccess({ username: res.username, plan: res.plan }, res.access_token);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-semibold mb-4 text-center">{mode === 'login' ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {mode === 'signup' && (
            <select
              className="w-full border rounded px-3 py-2"
              value={plan}
              onChange={e => setPlan(e.target.value)}
            >
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
            </select>
          )}
          {error && <div className={`text-sm ${error.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === 'login' ? (
            <span>Don't have an account?{' '}
              <button className="text-blue-600 hover:underline" onClick={() => { setMode('signup'); setError(''); }}>Sign Up</button>
            </span>
          ) : (
            <span>Already have an account?{' '}
              <button className="text-blue-600 hover:underline" onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 