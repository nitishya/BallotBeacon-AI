import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../store/LanguageContext';

export default function Documents() {
  const { language } = useLanguage();
  const [data, setData] = useState<{primary: string[], alternatives: string[], note: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const t = {
    title: language === 'en' ? "Required Documents" : "आवश्यक दस्तावेज़",
    subtitle: language === 'en' ? "Make sure you have the right ID before you head to the polling booth." : "मतदान केंद्र पर जाने से पहले सुनिश्चित करें कि आपके पास सही आईडी है।",
    primaryHeading: language === 'en' ? "Primary ID" : "प्राथमिक आईडी",
    primarySub: language === 'en' ? "The standard voter identification card" : "मानक मतदाता पहचान पत्र",
    altHeading: language === 'en' ? "Alternative Accepted IDs" : "वैकल्पिक स्वीकृत आईडी",
    altSub: language === 'en' ? "If you don't have an EPIC card" : "यदि आपके पास EPIC कार्ड नहीं है",
    loading: language === 'en' ? "Loading documents..." : "दस्तावेज़ लोड हो रहे हैं..."
  };

  useEffect(() => {
    async function fetchDocs() {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/v1/documents?lang=${language}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          throw new Error("Failed to load");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocs();
  }, [language]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
          <FileText size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-slate-600">{t.subtitle}</p>
      </div>

      {data?.note && (
        <div className="mb-8 p-4 bg-orange-50 text-orange-800 border border-orange-200 rounded-xl flex items-start gap-3 shadow-sm" role="alert">
          <AlertCircle className="shrink-0 mt-0.5 text-orange-600" />
          <p className="font-medium leading-relaxed">{data.note}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="bg-indigo-600 p-5 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle size={28} />
              {t.primaryHeading}
            </h2>
            <p className="text-indigo-100 text-sm opacity-90 mt-1">{t.primarySub}</p>
          </div>
          <ul className="p-6 space-y-4">
            {data?.primary.map((doc, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-indigo-600" aria-hidden="true" />
                <span className="text-slate-800 font-semibold text-lg">{doc}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="bg-slate-100 p-5 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Info size={28} className="text-slate-500" />
              {t.altHeading}
            </h2>
            <p className="text-slate-500 text-sm mt-1">{t.altSub}</p>
          </div>
          <ul className="p-6 space-y-4">
            {data?.alternatives.map((doc, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
                <span className="text-slate-700 leading-snug">{doc}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
