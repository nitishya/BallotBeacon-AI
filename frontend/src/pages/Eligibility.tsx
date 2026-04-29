import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../store/LanguageContext';
import { config } from '../config';

const API_URL = config.ENDPOINTS.ELIGIBILITY_CHECK;

interface EligibilityResult {
  is_eligible: boolean;
  reasons: string[];
  next_steps: string[];
}

export default function Eligibility() {
  const { language } = useLanguage();
  const [age, setAge] = useState('');
  const [citizenship, setCitizenship] = useState('India');
  const [state, setState] = useState('');
  const [isNri, setIsNri] = useState('no');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = {
    title: language === 'en' ? "Am I Eligible to Vote in India?" : "क्या मैं भारत में मतदान करने के लिए पात्र हूँ?",
    subtitle: language === 'en' ? "Check your eligibility based on Election Commission of India (ECI) guidelines." : "भारत के चुनाव आयोग (ECI) के दिशानिर्देशों के आधार पर अपनी पात्रता की जांच करें।",
    age: language === 'en' ? "Age" : "आयु",
    ageHelp: language === 'en' ? "You must be at least 18 years old on the qualifying date (usually Jan 1, April 1, July 1, or Oct 1)." : "अर्हक तिथि को आपकी आयु कम से कम 18 वर्ष होनी चाहिए।",
    citizenship: language === 'en' ? "Citizenship" : "नागरिकता",
    state: language === 'en' ? "State / Union Territory" : "राज्य / केंद्र शासित प्रदेश",
    nriQ: language === 'en' ? "Are you a Non-Resident Indian (NRI) living abroad?" : "क्या आप विदेश में रहने वाले अप्रवासी भारतीय (NRI) हैं?",
    yes: language === 'en' ? "Yes" : "हाँ",
    no: language === 'en' ? "No" : "नहीं",
    checkBtn: language === 'en' ? "Check Eligibility" : "पात्रता जांचें",
    checking: language === 'en' ? "Checking..." : "जांच हो रही है...",
    eligibleTitle: language === 'en' ? "You appear eligible to vote!" : "आप मतदान के लिए पात्र प्रतीत होते हैं!",
    ineligibleTitle: language === 'en' ? "You may not be eligible." : "आप पात्र नहीं हो सकते हैं।",
    details: language === 'en' ? "Important Details:" : "महत्वपूर्ण विवरण:",
    nextSteps: language === 'en' ? "Next Steps:" : "अगले चरण:"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}?lang=${language}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(age, 10) || 0,
          citizenship,
          state,
          is_nri: isNri === 'yes'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to check eligibility');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(language === 'en' ? "Unable to connect to the server. Please try again later." : "सर्वर से कनेक्ट करने में असमर्थ। कृपया बाद में पुनः प्रयास करें।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-slate-600">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-2">
              {t.age}
            </label>
            <input
              id="age"
              type="number"
              required
              min="0"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
              placeholder="e.g. 25"
            />
            <p className="mt-1 text-sm text-slate-500">{t.ageHelp}</p>
          </div>

          <div>
            <label htmlFor="citizenship" className="block text-sm font-medium text-slate-700 mb-2">
              {t.citizenship}
            </label>
            <select
              id="citizenship"
              value={citizenship}
              onChange={(e) => setCitizenship(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
            >
              <option value="India">{language === 'en' ? "Indian" : "भारतीय"}</option>
              <option value="Other">{language === 'en' ? "Other" : "अन्य"}</option>
            </select>
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-2">
              {t.state}
            </label>
            <input
              id="state"
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
              placeholder={language === 'en' ? "e.g. Maharashtra" : "जैसे कि महाराष्ट्र"}
            />
          </div>

          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-slate-700 mb-2">
                {t.nriQ}
              </legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="is_nri"
                    value="yes"
                    checked={isNri === 'yes'}
                    onChange={(e) => setIsNri(e.target.value)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                  />
                  <span className="group-hover:text-indigo-600 transition-colors">{t.yes}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="is_nri"
                    value="no"
                    checked={isNri === 'no'}
                    onChange={(e) => setIsNri(e.target.value)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                  />
                  <span className="group-hover:text-indigo-600 transition-colors">{t.no}</span>
                </label>
              </div>
            </fieldset>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 text-white font-semibold rounded-xl shadow-md bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t.checking}
              </span>
            ) : (
              t.checkBtn
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-start gap-3" role="alert">
          <AlertCircle className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mt-8 p-6 md:p-8 rounded-2xl border",
            result.is_eligible ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
          )}
          role="region"
          aria-live="polite"
        >
          <div className="flex items-center gap-4 mb-4">
            {result.is_eligible ? (
              <CheckCircle className="text-emerald-600 w-10 h-10" />
            ) : (
              <XCircle className="text-red-600 w-10 h-10" />
            )}
            <h2 className={cn(
              "text-2xl font-bold",
              result.is_eligible ? "text-emerald-800" : "text-red-800"
            )}>
              {result.is_eligible ? t.eligibleTitle : t.ineligibleTitle}
            </h2>
          </div>

          {result.reasons.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-slate-800">{t.details}</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                {result.reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {result.next_steps.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-800">{t.nextSteps}</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                {result.next_steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
