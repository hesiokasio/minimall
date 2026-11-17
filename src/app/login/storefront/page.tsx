'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthForm from '../../../components/auth/AuthForm';

function StorefrontLoginContent() {
  const searchParams = useSearchParams();
  // اگر کاربر از سبد خرید آمده باشد، بعد از لاگین به همان‌جا برمی‌گردد، در غیر این صورت به صفحه اصلی سایت می‌رود
  const nextUrl = searchParams.get('next') || '/';

  return (
    <AuthForm
      role="customer"
      loginTitle="Welcome to Minimall"
      signupTitle="Create Customer Account"
      loginSubtitle="Sign in to track your orders and complete your purchase"
      signupSubtitle="Join Minimall to shop across hundreds of stores"
      redirectPath={nextUrl}
      emailPlaceholder="you@example.com"
    />
  );
}

export default function StorefrontLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50" />}>
      <StorefrontLoginContent />
    </Suspense>
  );
}