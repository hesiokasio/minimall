'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, 
  User, 
  Lock, 
  UploadCloud, 
  Save,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Loader2
} from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client';

export default function SellerSettingsPage() {
  const supabase = createClient();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const kycFileRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'account' | 'verification'

  const [storeId, setStoreId] = useState<string | null>(null);

  // Store Profile State
  const [storeForm, setStoreForm] = useState({
    storeName: '',
    phone: '',
    address: '',
    description: '',
    logo: '' // URL of the logo
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Account State
  const [accountForm, setAccountForm] = useState({
    ownerName: '',
    email: 'hesam@example.com', // این فعلا هاردکد است تا سیستم لاگین ساخته شود
    currentPassword: '',
    newPassword: ''
  });

  // KYC (Verification) State
  const [kycForm, setKycForm] = useState({
    legalName: '',
    nationalId: '',
    status: 'unverified',
    documentName: '',
    documentUrl: ''
  });
  const [kycFile, setKycFile] = useState<File | null>(null);

  // ۱. دریافت اطلاعات هنگام لود شدن صفحه
  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('stores').select('*').limit(1).single();
    
    if (data) {
      setStoreId(data.id);
      
      setStoreForm({
        storeName: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        description: data.description || '',
        logo: data.logo_url || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80'
      });

      setAccountForm(prev => ({
        ...prev,
        ownerName: data.owner_name || ''
      }));

      setKycForm({
        legalName: data.owner_name || '', // نام صاحب و نام قانونی یکی در نظر گرفته شده
        nationalId: data.national_id || '',
        status: data.kyc_status || 'unverified',
        documentName: data.kyc_document_url ? 'Document Uploaded' : '',
        documentUrl: data.kyc_document_url || ''
      });
    }
    setIsLoading(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogoFile(file);
      setStoreForm({ ...storeForm, logo: URL.createObjectURL(file) });
    }
  };

  const handleKycUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setKycFile(file);
      setKycForm({ 
        ...kycForm, 
        documentName: file.name,
        status: 'pending' // بلافاصله بعد از انتخاب فایل، وضعیت به pending تغییر می‌کند (ظاهری)
      });
    }
  };

  // ۲. ذخیره اطلاعات در سرور
  const handleSave = async () => {
    if (!storeId) return alert('Store not found!');
    setIsSaving(true);

    try {
      let finalLogoUrl = storeForm.logo;
      let finalKycUrl = kycForm.documentUrl;

      // آپلود لوگو اگر تغییر کرده باشد
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('stores').upload(fileName, logoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('stores').getPublicUrl(fileName);
        finalLogoUrl = urlData.publicUrl;
      }

      // آپلود مدرک KYC اگر تغییر کرده باشد
      if (kycFile) {
        const fileExt = kycFile.name.split('.').pop();
        const fileName = `kyc-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('stores').upload(fileName, kycFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('stores').getPublicUrl(fileName);
        finalKycUrl = urlData.publicUrl;
      }

      // آپدیت دیتابیس با تمام اطلاعات جدید
      const { error: updateError } = await supabase
        .from('stores')
        .update({
          name: storeForm.storeName,
          phone: storeForm.phone,
          address: storeForm.address,
          description: storeForm.description,
          logo_url: finalLogoUrl,
          owner_name: accountForm.ownerName,
          national_id: kycForm.nationalId,
          kyc_document_url: finalKycUrl,
          kyc_status: kycFile ? 'pending' : kycForm.status // اگر مدرک جدید داده، میره تو صف بررسی
        })
        .eq('id', storeId);

      if (updateError) throw updateError;

      alert('تنظیمات با موفقیت ذخیره شد!');
      setLogoFile(null);
      setKycFile(null);
      fetchStoreData(); // رفرش اطلاعات از سرور

    } catch (error: any) {
      alert('خطا در ذخیره اطلاعات: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full h-[38px] px-3 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors";
  const labelClass = "block font-semibold text-zinc-800 mb-2 text-xs";

  if (isLoading) {
    return (
      <div className="flex-1 w-full h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-zinc-400 animate-spin mb-4" />
        <p className="text-sm font-medium text-zinc-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* 1. Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your store details, public profile, and account security.
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors shrink-0 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* 2. Tabs */}
      <div className="flex items-center gap-8 border-b border-zinc-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2 pb-3 text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'store' ? 'border-zinc-900 text-zinc-900 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-700 font-semibold'
          }`}
        >
          <Store className="w-4 h-4" /> Store Profile
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 pb-3 text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'account' ? 'border-zinc-900 text-zinc-900 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-700 font-semibold'
          }`}
        >
          <User className="w-4 h-4" /> Account & Security
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-2 pb-3 text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'verification' ? 'border-zinc-900 text-zinc-900 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-700 font-semibold'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Verification
          {kycForm.status === 'unverified' && <span className="w-2 h-2 rounded-full bg-rose-500 ml-1"></span>}
        </button>
      </div>

      {/* 3. Tab Content */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm">
        
        {/* --- Store Profile Tab --- */}
        {activeTab === 'store' && (
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-zinc-900">Store Logo</h2>
              <div className="flex items-center gap-5">
                <img src={storeForm.logo} alt="Store Logo" className="w-20 h-20 rounded-xl object-cover border border-zinc-200" />
                <div>
                  <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                    <UploadCloud className="w-3.5 h-3.5" /> Change Logo
                  </button>
                  <p className="text-[11px] text-zinc-500 mt-2">Recommended size: 400x400px (JPG or PNG).</p>
                  <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="text-sm font-bold text-zinc-900">Public Store Details</h2>
              <div className="space-y-5 max-w-3xl">
                <div>
                  <label className={labelClass}>Store Display Name</label>
                  <input type="text" value={storeForm.storeName} onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Public Contact Phone</label>
                  <input type="text" value={storeForm.phone} onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })} className={inputClass} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>Store Address (Optional)</label>
                  <input type="text" value={storeForm.address} onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })} className={inputClass} dir="rtl" />
                </div>
                <div>
                  <label className={labelClass}>Store Description</label>
                  <textarea rows={4} value={storeForm.description} onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })} className="w-full p-3 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors resize-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Account & Security Tab --- */}
        {activeTab === 'account' && (
          <div className="space-y-10">
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-zinc-900">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Owner Name</label>
                  <input type="text" value={accountForm.ownerName} onChange={(e) => setAccountForm({ ...accountForm, ownerName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Login Email</label>
                  <input type="email" value={accountForm.email} disabled className="w-full h-[38px] px-3 text-sm bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-500 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-900" />
                <h2 className="text-sm font-bold text-zinc-900">Change Password</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <input type="password" value={accountForm.currentPassword} onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>New Password</label>
                  <input type="password" value={accountForm.newPassword} onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Verification (KYC) Tab --- */}
        {activeTab === 'verification' && (
          <div className="space-y-8 max-w-3xl">
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              kycForm.status === 'unverified' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
              kycForm.status === 'pending' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold">
                  {kycForm.status === 'unverified' && 'Verification Required'}
                  {kycForm.status === 'pending' && 'Under Review'}
                  {kycForm.status === 'verified' && 'Verified Successfully'}
                </h3>
                <p className="text-xs mt-1 opacity-90">
                  {kycForm.status === 'unverified' && 'Please upload your business license or national ID to verify your store and activate all features.'}
                  {kycForm.status === 'pending' && 'Your documents have been submitted and are currently being reviewed by our team.'}
                  {kycForm.status === 'verified' && 'Your store identity has been successfully verified.'}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="text-sm font-bold text-zinc-900">Legal Business Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name / Business Name</label>
                  <input type="text" value={accountForm.ownerName} disabled className={inputClass + ' bg-zinc-50 cursor-not-allowed'} />
                </div>
                <div>
                  <label className={labelClass}>National ID / Registration No.</label>
                  <input type="text" value={kycForm.nationalId} onChange={(e) => setKycForm({ ...kycForm, nationalId: e.target.value })} className={inputClass} placeholder="e.g. 0012345678" disabled={kycForm.status === 'verified'} />
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-2">
              <h2 className="text-sm font-bold text-zinc-900">Document Upload</h2>
              
              {!kycForm.documentName ? (
                <div onClick={() => kycFileRef.current?.click()} className="border-2 border-dashed border-zinc-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition-colors">
                  <UploadCloud className="w-8 h-8 text-zinc-400" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-zinc-700">Click to upload document</p>
                    <p className="text-xs text-zinc-500 mt-1">Business License, Shop Lease, or National ID (PDF, JPG, PNG)</p>
                  </div>
                  <input type="file" ref={kycFileRef} onChange={handleKycUpload} accept=".pdf,image/*" className="hidden" />
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-xl bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{kycForm.documentName}</p>
                      <p className="text-xs text-zinc-500">Document ready</p>
                    </div>
                  </div>
                  {kycForm.status !== 'verified' && (
                    <button onClick={() => { setKycForm({ ...kycForm, documentName: '', status: 'unverified' }); setKycFile(null); }} className="text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}