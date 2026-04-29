import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, HelpCircle, MapPin } from 'lucide-react';
import { useLanguage } from '../store/LanguageContext';
import { config } from '../config';

interface UpcomingElection {
  state: string;
  expected_month: string;
}

export default function Home() {
  const { t, language } = useLanguage();
  const [elections, setElections] = useState<UpcomingElection[]>([]);

  useEffect(() => {
    fetch(`${config.ENDPOINTS.UPCOMING_ELECTIONS}?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        if (data.assembly_2026) {
          setElections(data.assembly_2026);
        }
      })
      .catch(err => console.error(err));
  }, [language]);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-indigo-50 via-white to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('home.hero.title')} <span className="text-orange-600">{t('home.hero.highlight')}</span> {t('home.hero.guide')}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('home.hero.subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              to="/wizard" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all focus-visible:outline-indigo-600 focus-visible:outline-offset-4 focus-visible:outline-4"
            >
              {t('home.hero.button')} <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Elections Banner */}
      {elections.length > 0 && (
        <section className="w-full bg-orange-50 border-y border-orange-100 py-6">
          <div className="container mx-auto px-4">
            <h3 className="text-center font-bold text-orange-800 mb-4 flex justify-center items-center gap-2">
              <MapPin size={20} /> 
              {language === 'en' ? "Upcoming 2026 Assembly Elections" : "आगामी 2026 विधानसभा चुनाव"}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {elections.map((el, i) => (
                <div key={i} className="bg-white px-4 py-2 rounded-lg shadow-sm border border-orange-200 text-sm font-medium text-slate-700">
                  <span className="font-bold text-indigo-700">{el.state}</span> • {el.expected_month}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">{t('home.features.title')}</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<CheckCircle2 className="text-emerald-500" size={32} />}
              title={language === 'en' ? "Eligibility Check" : "पात्रता जांचें"}
              description={language === 'en' ? "Verify age, citizenship, and registration criteria per ECI rules." : "ECI नियमों के अनुसार आयु, नागरिकता और पंजीकरण मानदंड सत्यापित करें।"}
              link="/eligibility"
            />
            <FeatureCard 
              icon={<Clock className="text-orange-500" size={32} />}
              title={language === 'en' ? "Election Timeline" : "चुनाव समयरेखा"}
              description={language === 'en' ? "From Form 6 registration to voting via EVM/VVPAT." : "फॉर्म 6 पंजीकरण से लेकर EVM/VVPAT के माध्यम से मतदान तक।"}
              link="/wizard"
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-indigo-500" size={32} />}
              title={language === 'en' ? "Required Documents" : "आवश्यक दस्तावेज़"}
              description={language === 'en' ? "EPIC, Aadhaar, and other accepted IDs at the polling booth." : "मतदान केंद्र पर EPIC, आधार और अन्य स्वीकृत आईडी।"}
              link="/documents"
            />
            <FeatureCard 
              icon={<HelpCircle className="text-slate-700" size={32} />}
              title={language === 'en' ? "AI Assistant" : "AI सहायक"}
              description={language === 'en' ? "Ask unbiased, ECI-aligned questions in English or Hindi." : "अंग्रेजी या हिंदी में निष्पक्ष, ECI-संरेखित प्रश्न पूछें।"}
              link="/ask"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) {
  return (
    <Link 
      to={link}
      className="group flex flex-col p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-200 hover:shadow-lg transition-all focus-visible:outline-indigo-600 focus-visible:outline-offset-4 focus-visible:outline-4"
    >
      <div className="w-14 h-14 rounded-xl bg-slate-50 border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
      <p className="text-slate-600 flex-1">{description}</p>
    </Link>
  );
}
