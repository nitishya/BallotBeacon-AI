import React, { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, HelpCircle, MapPin, Calendar, CheckCircle, Timer } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../store/LanguageContext';
import { API_URL } from '../config';

interface UpcomingElection {
  state: string;
  date: string;
  date_iso: string;
  type: 'Voting' | 'Counting';
}

function getElectionStatus(dateIso: string, lang: string) {
  const targetDate = new Date(dateIso);
  const now = new Date();
  
  targetDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    return {
      type: 'upcoming',
      text: lang === 'en' ? `${diffDays} days left` : `${diffDays} दिन शेष`,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: <Timer size={16} className="text-orange-600" />
    };
  } else if (diffDays === 0) {
    return {
      type: 'today',
      text: lang === 'en' ? "Ongoing" : "जारी",
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse',
      icon: <Timer size={16} className="text-emerald-600" />
    };
  } else {
    return {
      type: 'completed',
      text: lang === 'en' ? "Completed" : "पूर्ण",
      color: 'bg-slate-100 text-slate-500 border-slate-200',
      icon: <CheckCircle size={16} className="text-slate-400" />
    };
  }
}

export default function Home() {
  const { t, language } = useLanguage();
  const [elections, setElections] = useState<UpcomingElection[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/upcoming-elections?lang=${language}`)
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
        <section className="w-full bg-slate-50 border-y border-slate-200 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-4xl md:text-5xl font-black mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {language === 'en' ? "Elections " : "चुनाव "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-indigo-600">2026</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-indigo-100 -z-10 transform -rotate-1"></span>
                </span>
              </motion.h2>
              <p className="text-slate-500 font-medium">
                {language === 'en' ? "Official schedule and live tracking" : "आधिकारिक कार्यक्रम और लाइव ट्रैकिंग"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {elections.map((el, i) => (
                <ElectionItem key={i} el={el} language={language} index={i} />
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

const ElectionItem = memo(({ el, language, index }: { el: UpcomingElection, language: string, index: number }) => {
  const status = getElectionStatus(el.date_iso, language);
  const isCounting = el.type === 'Counting';

  return (
    <motion.div 
      className={cn(
        "group relative p-1 rounded-[2rem] transition-all",
        status.type === 'upcoming' ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200 shadow-xl" : "bg-white border border-slate-200"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <div className="h-full w-full rounded-[1.8rem] p-6 flex flex-col justify-between bg-white">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              status.type === 'upcoming' ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
            )}>
              {isCounting ? <Timer size={24} aria-hidden="true" /> : <Calendar size={24} aria-hidden="true" />}
            </div>
            <span className={cn(
              "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border",
              status.color
            )}>
              <span className="flex items-center gap-1.5">
                {status.icon}
                {status.text}
              </span>
            </span>
          </div>
          
          <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
            {el.state}
          </h4>
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-4">
            {el.type === 'Voting' 
              ? (language === 'en' ? "General Voting" : "सामान्य मतदान") 
              : (language === 'en' ? "Results Counting" : "परिणाम गणना")
            }
          </p>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100" aria-hidden="true">
          <div className="bg-indigo-50 p-2 rounded-lg">
            <Calendar size={18} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">{language === 'en' ? "Election Date" : "चुनाव की तारीख"}</p>
            <p className="text-sm font-bold text-slate-700">{el.date}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const FeatureCard = memo(({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) => (
  <Link 
    to={link}
    className="group flex flex-col p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-200 hover:shadow-lg transition-all focus-visible:outline-indigo-600 focus-visible:outline-offset-4 focus-visible:outline-4"
  >
    <div 
      className="w-14 h-14 rounded-xl bg-slate-50 border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
      aria-hidden="true"
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
    <p className="text-slate-600 flex-1">{description}</p>
  </Link>
));
