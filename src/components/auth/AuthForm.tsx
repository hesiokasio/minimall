'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Store, UserPlus, LogIn } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

interface AuthFormProps {
  role: 'admin' | 'vendor' | 'customer';
  loginTitle: string;
  signupTitle: string;
  loginSubtitle?: string;
  signupSubtitle?: string;
  redirectPath: string;
  emailPlaceholder?: string;
}

export default function AuthForm({
  role,
  loginTitle,
  signupTitle,
  loginSubtitle = 'Enter your credentials to access the workspace',
  signupSubtitle = 'Create a new account in the database',
  redirectPath,
  emailPlaceholder = 'user@minimall.com',
}: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const RoleIcon = role === 'admin' ? ShieldCheck : Store;
  const roleLabel = role === 'admin' ? 'Admin' : 'Vendor';

  // بررسی سشن و نقش کاربر در صورت لاگین بودن از قبل
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === role) {
          router.replace(redirectPath);
        }
      }
    };
    checkSession();
  }, [router, supabase, role, redirectPath]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role }, // ثبت خودکار نقش (admin یا vendor)
          },
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          router.push(redirectPath);
          router.refresh();
        } else {
          setSuccessMsg(`اکانت ${roleLabel} با موفقیت ساخته شد! اکنون وارد شوید.`);
          setMode('login');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();

          if (profile?.role !== role) {
            await supabase.auth.signOut();
            throw new Error(`عدم دسترسی: این اکانت مجوز ورود به پنل ${roleLabel} را ندارد.`);
          }

          router.push(redirectPath);
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'ایمیل یا رمز عبور اشتباه است.'
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-zinc-900 selection:text-white" dir="ltr">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-lg mb-6">
          <RoleIcon className="w-6 h-6" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900">
          {mode === 'login' ? loginTitle : signupTitle}
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500">
          {mode === 'login' ? loginSubtitle : signupSubtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-white py-8 px-4 shadow-xl shadow-zinc-200/40 sm:rounded-2xl sm:px-10 border border-zinc-100">
          
          {/* تب تغییر حالت بین ورود و ثبت‌نام */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-100 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'login' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'signup' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Create {roleLabel}
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium text-center" dir="rtl">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium text-center" dir="rtl">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                {roleLabel} Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors outline-none bg-zinc-50/50 focus:bg-white"
                  placeholder={emailPlaceholder}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors outline-none bg-zinc-50/50 focus:bg-white"
                  placeholder="•••••••• (Min 6 chars)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'login' ? (
                <>
                  Sign in to Workspace <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Register & Enter {roleLabel} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}