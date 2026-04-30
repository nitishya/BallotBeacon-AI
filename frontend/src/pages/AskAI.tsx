import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useLanguage } from '../store/LanguageContext';
import { API_URL } from '../config';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function AskAI() {
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = {
    title: language === 'en' ? "Ask AI Assistant" : "AI सहायक से पूछें",
    subtitle: language === 'en' ? "Get quick answers about ECI guidelines, EVMs, and the voting process." : "ECI दिशानिर्देशों, EVM और मतदान प्रक्रिया के बारे में त्वरित उत्तर प्राप्त करें।",
    placeholder: language === 'en' ? "E.g., How does a VVPAT machine work?" : "जैसे, VVPAT मशीन कैसे काम करती है?",
    disclaimer: language === 'en' ? "AI can make mistakes. We do not support any political party. Verify important info on eci.gov.in." : "AI गलतियाँ कर सकता है। हम किसी राजनीतिक दल का समर्थन नहीं करते। eci.gov.in पर सत्यापित करें।",
    initialGreeting: language === 'en' 
      ? "Hello! I'm the BallotBeacon AI assistant. Ask me anything about the Indian election process, voter registration, or EVMs."
      : "नमस्ते! मैं BallotBeacon AI सहायक हूँ। मुझसे भारतीय चुनाव प्रक्रिया, मतदाता पंजीकरण या EVM के बारे में कुछ भी पूछें।",
    errorMsg: language === 'en'
      ? "I'm having trouble connecting to my knowledge base right now. Please try again later."
      : "मुझे अभी अपने ज्ञानकोष से जुड़ने में परेशानी हो रही है। कृपया बाद में पुनः प्रयास करें।"
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Set initial message when language changes
  useEffect(() => {
    setMessages([
      { id: '1', text: t.initialGreeting, sender: 'bot' }
    ]);
  }, [language, t.initialGreeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/ask?lang=${language}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage })
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: data.answer, 
        sender: 'bot' 
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: t.errorMsg, 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl h-[calc(100vh-10rem)] flex flex-col">
      <div className="text-center mb-6 shrink-0">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-slate-600">{t.subtitle}</p>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {/* Chat Messages */}
        <div 
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
          role="log"
          aria-live="polite"
        >
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex max-w-[85%] gap-4",
                msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.sender === 'user' ? "bg-indigo-600 text-white" : "bg-orange-100 text-orange-600"
              )}>
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-[15px] leading-relaxed",
                msg.sender === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-slate-100 text-slate-800 rounded-tl-none"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex max-w-[85%] gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-1">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 text-slate-800 rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 border-t">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <label htmlFor="chat-input" className="sr-only">Type your question</label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="w-full pl-6 pr-16 py-4 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
              aria-label="Send message"
            >
              <Send size={20} className="ml-0.5" />
            </button>
          </form>
          <div className="mt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
            <AlertCircle size={12} />
            <span>{t.disclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
