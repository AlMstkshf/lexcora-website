import React, { useState } from 'react';
import { X, Mail, Phone, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Language } from '../types';

interface ContactModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  lang: Language;
  variant?: 'modal' | 'page';
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen = false,
  onClose = () => {},
  lang,
  variant = 'modal',
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });

  const isPage = variant === 'page';
  const shouldRender = isPage || isOpen;

  if (!shouldRender) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '', subject: formData.subject });

      if (!isPage) {
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (err) {
      setError(lang === 'en' ? 'Could not send your message. Please try again.' : 'تعذر إرسال رسالتك. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Get in Touch",
      subtitle: "Our expert consultants are ready to discuss your firm's transformation.",
      fields: {
        name: "Full Name",
        email: "Work Email",
        phone: "Mobile Number",
        message: "How can we help?",
        subject: "Subject"
      },
      btn: "Send Message",
      success: "Message Sent Successfully!",
      successSub: "Our team will contact you within 2 business hours."
    },
    ar: {
      title: "تواصل معنا",
      subtitle: "مستشارونا الخبراء جاهزون لمناقشة تحول مكتبكم.",
      fields: {
        name: "الاسم الكامل",
        email: "بريد العمل",
        phone: "رقم الهاتف",
        message: "كيف يمكننا مساعدتك؟",
        subject: "الموضوع"
      },
      btn: "إرسال الرسالة",
      success: "تم إرسال الرسالة بنجاح!",
      successSub: "سيتواصل فريقنا معك خلال ساعتي عمل."
    }
  }[lang];

  const card = (
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${isPage ? 'max-w-3xl overflow-hidden' : 'max-w-lg relative z-10 overflow-hidden animate-fade-in-up'}`}>
      {success ? (
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-lexcora-blue mb-2">{t.success}</h3>
          <p className="text-slate-500">{t.successSub}</p>
        </div>
      ) : (
        <>
          <div className="bg-lexcora-blue p-8 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lexcora-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            {!isPage && (
              <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors" aria-label="Close">
                <X size={20} />
              </button>
            )}
            <h3 className="text-2xl font-serif font-bold">{t.title}</h3>
            <p className="text-slate-400 text-sm mt-2">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.fields.name}</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-lexcora-gold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.fields.email}</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-lexcora-gold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.fields.phone}</label>
              <input 
                type="tel" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-lexcora-gold"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.fields.message}</label>
              <textarea 
                rows={3}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-lexcora-gold"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <Button fullWidth disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> {t.btn}</>}
            </Button>
          </form>
        </>
      )}
    </div>
  );

  if (isPage) {
    return (
      <div className="bg-slate-50 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6 flex justify-center">
          {card}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      {card}
    </div>
  );
};
