import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, Languages } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../store/LanguageContext';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('forced-colors');
    } else {
      document.documentElement.classList.remove('forced-colors');
    }
  }, [highContrast]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-200",
      highContrast ? "bg-black text-white" : "bg-slate-50 text-slate-900"
    )}>
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-indigo-600 focus:text-white focus:z-50"
      >
        Skip to main content
      </a>

      <header className={cn(
        "sticky top-0 z-40 border-b shadow-sm backdrop-blur",
        highContrast ? "bg-black border-white" : "bg-white/80 border-slate-200"
      )}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="BallotBeacon AI Home">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
              BallotBeacon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            <Link to="/wizard" className="font-medium hover:text-indigo-600 transition-colors focus-visible:outline-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">{t('nav.wizard')}</Link>
            <Link to="/eligibility" className="font-medium hover:text-indigo-600 transition-colors focus-visible:outline-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">{t('nav.eligibility')}</Link>
            <Link to="/documents" className="font-medium hover:text-indigo-600 transition-colors focus-visible:outline-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">{t('nav.documents')}</Link>
            <Link to="/ask" className="font-medium hover:text-indigo-600 transition-colors focus-visible:outline-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">{t('nav.ask')}</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="p-2 flex items-center gap-1 font-semibold rounded-full hover:bg-slate-200 focus-visible:outline-indigo-600"
              aria-label={`Switch language to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              <Languages size={20} />
              <span className="text-sm uppercase">{language}</span>
            </button>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className="p-2 rounded-full hover:bg-slate-200 focus-visible:outline-indigo-600"
              aria-label="Toggle High Contrast Mode"
              aria-pressed={highContrast}
            >
              {highContrast ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="md:hidden p-2 hover:bg-slate-200 rounded-full focus-visible:outline-indigo-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden border-t p-4 flex flex-col gap-4 bg-white" aria-label="Mobile Navigation">
            <Link onClick={() => setIsMenuOpen(false)} to="/wizard" className="block p-2 text-lg font-medium rounded hover:bg-slate-100">{t('nav.wizard')}</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/eligibility" className="block p-2 text-lg font-medium rounded hover:bg-slate-100">{t('nav.eligibility')}</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/documents" className="block p-2 text-lg font-medium rounded hover:bg-slate-100">{t('nav.documents')}</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/ask" className="block p-2 text-lg font-medium rounded hover:bg-slate-100">{t('nav.ask')}</Link>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className={cn(
        "py-16 border-t mt-auto",
        highContrast ? "border-white bg-black" : "border-slate-800 bg-slate-950 text-slate-400"
      )}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-white">BallotBeacon AI</h3>
              <p className="text-slate-400 leading-relaxed max-w-xs text-sm">
                Next-generation election intelligence & voter guidance system. Built to optimize democratic participation and enhance the voting experience.
              </p>
            </div>

            {/* Center Column */}
            <div className="flex flex-col items-center md:items-center gap-4">
              <h4 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Connect</h4>
              <div className="flex flex-col gap-3 items-center md:items-center text-sm font-medium">
                <a 
                  href="https://www.linkedin.com/in/nitishyadav866/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/nitishya" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col md:items-end gap-4">
              <h4 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Legal</h4>
              <div className="flex flex-col gap-3 md:items-end text-sm font-medium">
                <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
            <p>© 2026 BallotBeacon AI. All rights reserved.</p>
            <p>
              Developed by <span className="text-white font-bold">Nitish Kumar Yadav</span> • Delhi, India 🇮🇳
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
