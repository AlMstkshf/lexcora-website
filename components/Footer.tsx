import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { CONTENT } from '../constants';
import { Linkedin, Instagram, Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = CONTENT[lang].footer;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Mock subscription logic
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer id="footer" className="bg-lexcora-blue text-slate-300 pt-16 pb-10 border-t-4 border-lexcora-gold">
      <div className="container mx-auto px-6">
        
        {/* Newsletter Section */}
        <div className="bg-white/5 rounded-2xl p-8 mb-16 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">{t.newsletter.title}</h3>
            <p className="text-slate-400">{t.newsletter.description}</p>
          </div>
          <div className="lg:w-1/2 w-full max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 bg-green-500/10 p-4 rounded-lg border border-green-500/20 animate-fade-in" role="alert">
                <CheckCircle2 size={20} />
                <span className="font-semibold">{t.newsletter.success}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder={t.newsletter.placeholder}
                  className="flex-1 bg-slate-900/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-lexcora-gold transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label={t.newsletter.placeholder}
                />
                <button 
                  type="submit" 
                  className="bg-lexcora-gold text-lexcora-blue font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  aria-label={t.newsletter.button}
                >
                  {t.newsletter.button} <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-white tracking-wider">LEXCORA</h2>
            <p className="text-sm leading-relaxed text-slate-400">{t.about}</p>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/showcase/lexcora-erp-system/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-lexcora-gold transition-colors" 
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/lexcora_erp/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-lexcora-gold transition-colors" 
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6">{t.contact}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="text-lexcora-gold shrink-0" aria-hidden="true" />
                <span>{t.address}</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-lexcora-gold shrink-0" aria-hidden="true" />
                <span>rased@almstkshf.com</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-lexcora-gold shrink-0" aria-hidden="true" />
                <span dir="ltr">+971 58 595 2035</span>
              </li>
            </ul>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-white font-bold mb-6">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/features#features-productivity" className="hover:text-white transition-colors text-left block">
                  Case Management
                </Link>
              </li>
              <li>
                <Link to="/features#features-client" className="hover:text-white transition-colors text-left block">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link to="/features#features-governance" className="hover:text-white transition-colors text-left block">
                  Security & Governance
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors text-left block">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

           {/* Legal */}
           <div>
            <h3 className="text-white font-bold mb-6">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors text-left block">
                  {t.privacy}
                </Link>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">{t.compliance}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>{t.rights}</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
             <span>Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
