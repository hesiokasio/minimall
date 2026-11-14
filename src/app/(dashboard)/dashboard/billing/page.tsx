'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Zap } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client'; // مسیر را در صورت نیاز اصلاح کنید

const plans = [
  {
    id: 'monthly',
    name: '1 Month Plan',
    price: '۵۰۰,۰۰۰',
    durationDays: 30,
    description: 'Perfect for testing the platform.',
    features: ['Full Dashboard Access', 'Unlimited Products', 'Basic Analytics', 'Standard Support'],
    isPopular: false,
  },
  {
    id: 'quarterly',
    name: '3 Months Plan',
    price: '۱,۳۵۰,۰۰۰',
    durationDays: 90,
    description: 'Save 10% with our quarterly plan.',
    features: ['Full Dashboard Access', 'Unlimited Products', 'Advanced Analytics', 'Priority Support'],
    isPopular: true,
  },
  {
    id: 'yearly',
    name: '1 Year Plan',
    price: '۴,۸۰۰,۰۰۰',
    durationDays: 365,
    description: 'Best value for serious businesses.',
    features: ['Full Dashboard Access', 'Unlimited Products', 'Custom Domain Support', '24/7 Dedicated Support'],
    isPopular: false,
  }
];

export default function BillingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, [supabase]);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user) return;
    setLoadingId(plan.id);

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + plan.durationDays);

      // ثبت اشتراک جدید در دیتابیس با وضعیت active
      const { error } = await supabase
        .from('subscriptions')
        .insert([{
          vendor_id: user.id,
          plan_name: plan.name,
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        }]);

      if (error) throw error;

      // رفرش کردن صفحه برای اعمال تغییرات و حذف بنر زرد رنگ
      window.location.href = '/'; 

    } catch (error: any) {
      console.error('Error activating subscription:', error.message);
      alert('خطایی در فعال‌سازی رخ داد.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-zinc-500 text-sm sm:text-base">
          Activate your store to make it visible to customers and start receiving orders today.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative flex flex-col p-6 sm:p-8 bg-white rounded-2xl border ${
              plan.isPopular ? 'border-zinc-900 shadow-xl shadow-zinc-200' : 'border-zinc-200 shadow-sm'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-900">{plan.name}</h3>
              <p className="text-sm text-zinc-500 mt-2 h-10">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-zinc-900">{plan.price}</span>
                <span className="text-sm font-medium text-zinc-500">Toman</span>
              </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-zinc-900 shrink-0" />
                  <span className="text-sm text-zinc-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={loadingId === plan.id}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2 ${
                plan.isPopular 
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-800' 
                  : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 disabled:bg-zinc-200'
              }`}
            >
              {loadingId === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}