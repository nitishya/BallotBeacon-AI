import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Check, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../store/LanguageContext';
import { API_URL } from '../config';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  link?: string;
}

export default function Wizard() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const t = {
    title: language === 'en' ? "Election Timeline" : "चुनाव समयरेखा",
    subtitle: language === 'en' ? "Track your progress to election day based on ECI guidelines." : "ECI दिशानिर्देशों के आधार पर चुनाव के दिन तक अपनी प्रगति को ट्रैक करें।",
    progress: language === 'en' ? "Your Progress" : "आपकी प्रगति",
    complete: language === 'en' ? "Complete" : "पूर्ण",
    undo: language === 'en' ? "Undo step" : "चरण पूर्ववत करें",
    mark: language === 'en' ? "Mark as complete" : "पूर्ण के रूप में चिह्नित करें",
    loading: language === 'en' ? "Loading timeline..." : "समयरेखा लोड हो रही है..."
  };

  useEffect(() => {
    async function fetchTimeline() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/timeline?lang=${language}`);
        if (!res.ok) throw new Error('Failed to fetch timeline');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTimeline();
  }, [language]);

  const toggleStep = (index: number) => {
    const newSteps = new Set(completedSteps);
    if (newSteps.has(index)) {
      newSteps.delete(index);
    } else {
      newSteps.add(index);
    }
    setCompletedSteps(newSteps);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">{t.loading}</p>
      </div>
    );
  }

  const progress = events.length > 0 ? (completedSteps.size / events.length) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4" aria-hidden="true">
          <Calendar size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-slate-600">{t.subtitle}</p>
      </div>

      <div className="mb-12 bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex justify-between text-sm font-medium mb-2 text-slate-700">
          <span>{t.progress}</span>
          <span>{Math.round(progress)}% {t.complete}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
          <motion.div 
            className="bg-emerald-500 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {events.map((event, index) => {
          const isCompleted = completedSteps.has(index);
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Icon */}
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 cursor-pointer transition-colors focus-visible:outline-indigo-600",
                isCompleted ? "bg-emerald-500 text-white" : "bg-orange-100 text-orange-600 hover:bg-orange-200"
              )}
              onClick={() => toggleStep(index)}
              onKeyDown={(e) => e.key === 'Enter' && toggleStep(index)}
              tabIndex={0}
              role="button"
              aria-pressed={isCompleted}
              aria-label={`${t.mark} ${event.title}`}
              >
                {isCompleted ? <Check size={20} aria-hidden="true" /> : <ChevronRight size={20} aria-hidden="true" />}
              </div>
              
              {/* Card */}
              <div 
                className={cn(
                  "w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all",
                  event.link ? "cursor-pointer hover:border-indigo-300" : ""
                )}
                onClick={() => {
                  if (event.link) {
                    if (event.link.startsWith('http')) {
                      window.open(event.link, '_blank', 'noopener,noreferrer');
                    } else {
                      navigate(event.link);
                    }
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-slate-800">{event.title}</h3>
                  <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded uppercase tracking-wide">
                    {event.date}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{event.description}</p>
                
                <div className="mt-4 flex items-center gap-4">
                  {event.link && (
                    <div
                      className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {language === 'en' ? "Proceed" : "आगे बढ़ें"} <ChevronRight size={16} />
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card navigation
                      toggleStep(index);
                    }}
                    className={cn(
                      "text-sm font-medium focus-visible:outline-indigo-600 rounded px-3 py-1.5 transition-colors cursor-pointer",
                      !event.link && "-ml-3",
                      isCompleted ? "text-slate-500 hover:text-slate-700 hover:bg-slate-100" : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                    )}
                  >
                    {isCompleted ? t.undo : t.mark}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
