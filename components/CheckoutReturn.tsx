import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchCheckoutSession } from '../services/stripeClient';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Language } from '../types';
import { Button } from './Button';
import { CheckoutEmbed } from './CheckoutEmbed';

interface CheckoutReturnProps {
  lang: Language;
}

export const CheckoutReturn: React.FC<CheckoutReturnProps> = ({ lang }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'open' | 'failed'>('loading');
  const [email, setEmail] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'payment' | 'subscription' | 'setup'>('payment');
  const searchParams = new URLSearchParams(location.search);
  const priceId = searchParams.get('price_id') || undefined;
  const requestedMode = (searchParams.get('mode') as 'payment' | 'subscription' | 'setup' | null) || undefined;

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError(lang === 'en' ? 'Missing checkout session. Please try again.' : '???? ?????? ?????? ??????. ???? ????????.');
      setStatus('failed');
      return;
    }

    const load = async () => {
      try {
        const session = await fetchCheckoutSession(sessionId);
        setEmail(session.customer_email || null);
        setAmount(session.amount_total || null);
        setCurrency(session.currency || null);
        if (session.mode) {
          setMode(session.mode);
        } else if (requestedMode) {
          setMode(requestedMode);
        }

        if (session.status === 'complete' || session.payment_status === 'paid') {
          setStatus('success');
        } else if (session.status === 'open' || session.payment_status === 'unpaid') {
          setStatus('open');
        } else {
          setStatus('failed');
        }
      } catch (err: any) {
        setError(err?.message || 'Unable to retrieve your checkout status.');
        setStatus('failed');
      }
    };

    void load();
  }, [location.search, lang]);

  const isEnglish = lang === 'en';

  const formatAmount = (amt: number | null, curr: string | null) => {
    if (!amt || !curr) return null;
    return `${(amt / 100).toFixed(2)} ${curr.toUpperCase()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="bg-white shadow-xl rounded-2xl p-10 border border-slate-100">
          {status === 'loading' && (
            <div className="flex flex-col items-center text-center gap-3">
              <Loader2 className="animate-spin text-lexcora-blue" size={32} />
              <p className="text-slate-600">{isEnglish ? 'Confirming your payment...' : '????? ??? ????????...'}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="text-2xl font-serif font-bold text-lexcora-blue">
                {isEnglish ? 'Payment confirmed' : '?? ????? ??? ??????'}
              </h1>
              <p className="text-slate-600">
                {isEnglish ? 'Thank you for your purchase. A receipt has been sent to' : '????? ?? ????????. ???? ??????? ???'}
                {email ? ` ${email}.` : '.'}
              </p>
              {amount && (
                <p className="text-sm text-slate-500">
                  {isEnglish ? 'Total paid:' : '???? ?????:'} {formatAmount(amount, currency)}
                </p>
              )}
              <div className="pt-4">
                <Button onClick={() => navigate('/')}>
                  {isEnglish ? 'Return home' : '????? ?????'}
                </Button>
              </div>
            </div>
          )}

          {status === 'open' && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <Loader2 size={32} className="animate-spin" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-lexcora-blue">
                  {isEnglish ? 'Payment incomplete' : '???? ?? ???????'}
                </h1>
                <p className="text-slate-600">
                  {isEnglish
                    ? 'Your payment was canceled or not completed. You can try again below.'
                    : '???? ??????? ??? ????? ?? ???????. ?????? ???????? ????.'}
                </p>
              </div>
              <CheckoutEmbed mode={mode} priceId={priceId} />
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <XCircle size={32} />
              </div>
              <h1 className="text-2xl font-serif font-bold text-lexcora-blue">
                {isEnglish ? 'Payment not completed' : '???? ???????'}
              </h1>
              <p className="text-slate-600">
                {error ||
                  (isEnglish
                    ? 'We could not confirm your payment. Please try again or contact support.'
                    : '?? ????? ???? ???????. ???? ????? ?????? ??? ????? ???????.')}
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Button onClick={() => navigate('/')}>
                  {isEnglish ? 'Return home' : '????? ?????'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
