'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, Store } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        // عملیات ورود
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // در صورت موفقیت، انتقال به پیشخوان فروشندگان
        router.push('/dashboard');
        
      } else {
        // عملیات ثبت‌نام
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        setSuccessMsg('ثبت‌نام با موفقیت انجام شد! حالا می‌توانید وارد شوید.');
        setIsLogin(true); // تغییر فرم به حالت لاگین
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'خطایی رخ داده است.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        
        {/* هدر فرم */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-4">
            <Store className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Vendor Account'}
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            {isLogin 
              ? 'Enter your credentials to access your store panel.' 
              : 'Sign up to start selling in Minimall.'}
          </p>
        </div>

        {/* پیام‌های خطا و موفقیت */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg text-center font-medium">
            {successMsg}
          </div>
        )}

        {/* فرم */}
        <form className="space-y-5" onSubmit={handleAuth}>
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 transition-colors"
                placeholder="vendor@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 h-10 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* تغییر حالت فرم */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-xs text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}