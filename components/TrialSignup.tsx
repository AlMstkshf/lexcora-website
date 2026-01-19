import React, { useState } from 'react';
import { Language } from '../types';
import { CONTENT } from '../constants';
import { Check, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface TrialSignupProps {
  lang: Language;
}

export const TrialSignup: React.FC<TrialSignupProps> = ({ lang }) => {
  const t = CONTENT[lang].trial;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    firmName: '',
    firmSize: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStep1Valid = formData.fullName && formData.email && formData.phone;
  const isStep2Valid = formData.firmName && formData.firmSize;

  const NavArrowNext = lang === 'ar' ? ChevronLeft : ChevronRight;
  const NavArrowBack = lang === 'ar' ? ChevronRight : ChevronLeft;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Panel - Value Prop (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-5/12 bg-lexcora-blue relative overflow-hidden p-12 flex-col justify-between text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lexcora-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-6 text-lexcora-gold">LEXCORA</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Check size={16} className="text-lexcora-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">UAE Compliance Ready</h3>
                  <p className="text-slate-400 text-sm">Pre-configured for local regulations and tax laws.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Check size={16} className="text-lexcora-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Zero-Touch Onboarding</h3>
                  <p className="text-slate-400 text-sm">Import your cases and clients instantly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <p className="italic text-slate-300 mb-4 text-lg">"{t.testimonial.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lexcora-gold rounded-full flex items-center justify-center text-lexcora-blue font-bold">
                TA
              </div>
              <div>
                <p className="font-bold text-white text-sm">{t.testimonial.author}</p>
                <div className="flex text-lexcora-gold text-xs">★★★★★</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="lg:w-7/12 p-6 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-lg mx-auto w-full">
            
            {/* Progress Bar */}
            <div className="mb-12">
              <h1 className="text-3xl font-serif font-bold text-lexcora-blue mb-8 text-center">{t.pageTitle}</h1>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
                <div className="absolute top-1/2 left-0 h-1 bg-lexcora-gold -z-10 transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors duration-300 ${
                        step >= s 
                          ? 'bg-lexcora-gold border-lexcora-gold text-lexcora-blue' 
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {step > s ? <Check size={20} /> : s}
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${step >= s ? 'text-lexcora-blue' : 'text-slate-400'}`}>
                      {t.steps[s as 1 | 2 | 3]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.form.fullName}</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:border-lexcora-gold focus:ring-1 focus:ring-lexcora-gold/50"
                    placeholder="e.g. Ahmed Al-Mansoori"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.form.workEmail}</label>
                  <input 
                    type="email" 
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:border-lexcora-gold focus:ring-1 focus:ring-lexcora-gold/50"
                    placeholder="name@firm.ae"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.form.phone}</label>
                  <input 
                    type="tel" 
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:border-lexcora-gold focus:ring-1 focus:ring-lexcora-gold/50"
                    placeholder="+971 50 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <Button 
                  fullWidth 
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                  className="mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.form.next} <NavArrowNext size={18} />
                </Button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.form.firmName}</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:border-lexcora-gold focus:ring-1 focus:ring-lexcora-gold/50"
                    placeholder="e.g. Al-Mansoori & Partners"
                    value={formData.firmName}
                    onChange={(e) => setFormData({...formData, firmName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.form.firmSize}</label>
                  <select 
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:border-lexcora-gold focus:ring-1 focus:ring-lexcora-gold/50"
                    value={formData.firmSize}
                    onChange={(e) => setFormData({...formData, firmSize: e.target.value})}
                  >
                    <option value="">Select Size</option>
                    {t.form.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex gap-4 mt-8">
                   <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleBack}
                  >
                    <NavArrowBack size={18} /> {t.form.back}
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={handleNext}
                    disabled={!isStep2Valid}
                  >
                    {t.form.submit}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 - Success */}
            {step === 3 && (
              <div className="text-center animate-fade-in space-y-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-lexcora-blue mb-2">{t.success.title}</h2>
                  <p className="text-slate-500 max-w-sm mx-auto">{t.success.subtitle}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 text-left shadow-sm">
                  <h3 className="font-bold text-lexcora-blue mb-4 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
                    {t.success.checklistTitle}
                  </h3>
                  <ul className="space-y-4">
                    {t.success.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${idx === 0 ? 'bg-orange-100 border-orange-200 text-orange-600' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                           {idx === 0 ? <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> : <Check size={12} />}
                        </div>
                        <span className={idx === 0 ? 'font-semibold text-lexcora-blue' : ''}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button fullWidth onClick={() => window.location.href = '#'}>
                  {t.success.dashboardButton}
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};