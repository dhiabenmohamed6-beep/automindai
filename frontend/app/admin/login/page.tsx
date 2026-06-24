'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(username, password);
      if (data.access && data.user?.is_staff) {
        localStorage.setItem('amai_admin_token', data.access);
        localStorage.setItem('amai_admin_refresh', data.refresh);
        localStorage.setItem('amai_admin_user', JSON.stringify(data.user));
        router.push('/admin/dashboard');
      } else {
        setError('Access denied. Admin only.');
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--navy)] to-[var(--navy-soft)] p-5">
      <div className="bg-white rounded-[24px] p-10 max-w-[420px] w-full shadow-[0_30px_60px_-20px_rgba(10,18,40,0.5)]">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            AutoMind<span className="text-[var(--deep)]">Ai</span>
          </h1>
          <p className="text-sm text-[var(--ink-soft)]">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-[10px] border border-[var(--line)] font-body text-sm focus:outline-none focus:border-[var(--deep)] transition"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-[10px] border border-[var(--line)] font-body text-sm focus:outline-none focus:border-[var(--deep)] transition"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary justify-center"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-[var(--ink-soft)] hover:text-[var(--deep)] transition">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
