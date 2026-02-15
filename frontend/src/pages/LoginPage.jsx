import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;
      login(userData, token);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px] animate-float-slow" />
      </div>

      <div className="max-w-md w-full px-6 z-10 animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-2xl bg-white shadow-soft mb-6 animate-float">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold text-primary mb-3">
            Admin Portal
          </h1>
          <p className="text-slate-500 font-medium">
            NextStop Management Dashboard
          </p>
        </div>

        <div className="glass-light p-8 rounded-4xl shadow-xl border border-white/50 relative">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 animate-wiggle">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary/60 uppercase tracking-widest mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-300"
                  placeholder="admin@nextstop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary/60 uppercase tracking-widest mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-dark hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-accent/0 via-accent/10 to-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </form>

          {/* Subtle footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-tighter">
              Authorized Personnel Only
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} NextStop. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
