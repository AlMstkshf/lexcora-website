import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Language, PricingTier } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: PricingTier | null;
  billingCycle: 'monthly' | 'annually';
  lang: Language;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, tier, billingCycle, lang }) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !tier) return null;

  const price = billingCycle === 'annually' ? tier.priceAnnually : tier.priceMonthly;
  const period = billingCycle === 'annually' ? (lang === 'en' ? 'Year' : 'سنة') : (lang === 'en' ? 'Month' : 'شهر');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  const handleClose = () => {
    setSuccess(false);
    setProcessing(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-fade-in-up">
        {success ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-lexcora-blue mb-2">
              {lang === 'en' ? 'Payment Successful' : 'تم الدفع بنجاح'}
            </h3>
            <p className="text-slate-500 mb-8">
              {lang === 'en' 
                ? 'Thank you for your subscription. Your account has been upgraded.' 
                : 'شكراً لاشتراكك. تم ترقية حسابك بنجاح.'}
            </p>
            <Button onClick={handleClose} fullWidth>
              {lang === 'en' ? 'Continue to Dashboard' : 'الذهاب إلى لوحة التحكم'}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lexcora-blue text-lg flex items-center gap-2">
                  <Lock size={16} className="text-lexcora-gold" />
                  {lang === 'en' ? 'Secure Checkout' : 'دفع آمن'}
                </h3>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {/* Summary */}
              <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lexcora-blue">{tier.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{billingCycle} Plan</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-lexcora-blue">AED {price}</p>
                  <p className="text-xs text-slate-500">/ {period}</p>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                    {lang === 'en' ? 'Card Information' : 'معلومات البطاقة'}
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000" 
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-lexcora-gold focus:ring-1 focus:ring-lexcora-gold/20"
                      required
                    />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      {lang === 'en' ? 'Expiry Date' : 'تاريخ الانتهاء'}
                    </label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-lexcora-gold focus:ring-1 focus:ring-lexcora-gold/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      CVC
                    </label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-lexcora-gold focus:ring-1 focus:ring-lexcora-gold/20"
                      required
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      {lang === 'en' ? 'Cardholder Name' : 'اسم حامل البطاقة'}
                    </label>
                    <input 
                      type="text" 
                      placeholder={lang === 'en' ? "Name on card" : "الاسم على البطاقة"}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-lexcora-gold focus:ring-1 focus:ring-lexcora-gold/20"
                      required
                    />
                </div>

                <Button fullWidth disabled={processing} className="mt-4">
                  {processing ? (
                    <><Loader2 className="animate-spin" size={18} /> {lang === 'en' ? 'Processing...' : 'جار المعالجة...'}</>
                  ) : (
                    <>{lang === 'en' ? 'Pay & Subscribe' : 'دفع واشتراك'} <ShieldCheck size={18} /></>
                  )}
                </Button>
                
                <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                  <Lock size={10} /> 
                  {lang === 'en' 
                    ? 'Payments are processed securely via SSL encryption' 
                    : 'تتم معالجة المدفوعات بشكل آمن عبر تشفير SSL'}
                </p>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};