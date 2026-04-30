import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "nav.wizard": "Process",
    "nav.eligibility": "Eligibility",
    "nav.documents": "Documents",
    "nav.ask": "Ask AI",
    "home.hero.title": "Your Smart",
    "home.hero.highlight": "Election",
    "home.hero.guide": "Guide",
    "home.hero.subtitle": "Navigate the Indian election process with confidence. Check eligibility, track deadlines, and get AI-powered answers instantly based on ECI guidelines.",
    "home.hero.button": "Start Your Journey",
    "home.features.title": "Everything You Need to Vote",
    "home.footer": "© 2026 BallotBeacon AI. Your Smart Election Process Guide.",
    "footer.developedBy": "Developed by",
    "footer.developerName": "Nitish Kumar Yadav",
    "footer.place": "Made in India",
    "footer.help": "Help Section",
    "footer.contact": "Contact Us",
    "footer.faq": "FAQs",
    "footer.privacy": "Privacy Policy"
  },
  hi: {
    "nav.wizard": "प्रक्रिया",
    "nav.eligibility": "पात्रता",
    "nav.documents": "दस्तावेज़",
    "nav.ask": "AI से पूछें",
    "home.hero.title": "आपका स्मार्ट",
    "home.hero.highlight": "चुनाव",
    "home.hero.guide": "मार्गदर्शक",
    "home.hero.subtitle": "भारतीय चुनाव प्रक्रिया को आत्मविश्वास के साथ समझें। ECI दिशानिर्देशों के आधार पर पात्रता जांचें, समय सीमा ट्रैक करें और तुरंत AI-संचालित उत्तर प्राप्त करें।",
    "home.hero.button": "अपनी यात्रा शुरू करें",
    "home.features.title": "मतदान के लिए आपको जो कुछ भी चाहिए",
    "home.footer": "© 2026 BallotBeacon AI. आपका स्मार्ट चुनाव प्रक्रिया मार्गदर्शक।",
    "footer.developedBy": "द्वारा विकसित",
    "footer.developerName": "नितीश कुमार यादव",
    "footer.place": "भारत में निर्मित",
    "footer.help": "सहायता अनुभाग",
    "footer.contact": "संपर्क करें",
    "footer.faq": "सामान्य प्रश्न",
    "footer.privacy": "गोपनीयता नीति"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
