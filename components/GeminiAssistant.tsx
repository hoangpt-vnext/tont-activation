import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { ProgramEvent } from '../types';
import { askScheduleAssistant } from '../services/geminiService';

interface GeminiAssistantProps {
  currentEvents: ProgramEvent[];
  language: 'vi' | 'en';
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ currentEvents, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);
    
    const answer = await askScheduleAssistant(query, currentEvents);
    
    setResponse(answer);
    setIsLoading(false);
  };

  const t = {
    title: language === 'vi' ? 'Trợ lý Lịch Trình AI' : 'AI Schedule Assistant',
    collapse: language === 'vi' ? 'Thu gọn' : 'Collapse',
    intro: language === 'vi' ? 'Hỏi tôi bất cứ điều gì về lịch trình đang hiển thị. Ví dụ: "Tuần này có sự kiện nào ở Hà Nội không?"' : 'Ask me anything about the schedule. For example: "Any events in Hanoi this week?"',
    placeholder: language === 'vi' ? 'Nhập câu hỏi của bạn...' : 'Enter your question...',
    quickAsk: language === 'vi' ? 'Bấm để hỏi thông tin lịch trình nhanh chóng...' : 'Click to quickly ask about the schedule...'
  };

  return (
    <div className="mb-8">
      <div 
        className={`bg-gradient-to-r from-green-700 to-green-600 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isOpen ? 'p-6' : 'p-4 cursor-pointer hover:shadow-xl'}`}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <h2 className="text-lg font-bold">{t.title}</h2>
          </div>
          {isOpen && (
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="text-white/80 hover:text-white text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
            >
                {t.collapse}
            </button>
          )}
        </div>

        {isOpen ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-green-100 text-sm mb-4">
              {t.intro}
            </p>
            
            <form onSubmit={handleAsk} className="relative mb-4">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.placeholder}
                className="w-full pl-4 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-green-100 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
              />
              <button 
                type="submit" 
                disabled={isLoading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-green-700 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>

            {response && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 text-white animate-in fade-in zoom-in-95 duration-200">
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed">{response}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
            <div className="text-green-100 text-sm flex items-center justify-between">
                 <span>{t.quickAsk}</span>
                 <span className="text-xs bg-white/20 px-2 py-1 rounded">Beta</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default GeminiAssistant;