
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { askGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! I am your NovaSCP assistant. How can I help you manage your remote servers today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await askGemini(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', content: response || 'I am sorry, something went wrong.' }]);
    setIsTyping(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95 pointer-events-none opacity-0'}`}>
      <div className="w-[380px] h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto">
        <div className="p-4 border-b border-slate-700 bg-indigo-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Icons.Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">NovaAI Assistant</h3>
              <p className="text-[10px] text-white/70">Powered by Gemini 3 Flash</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-950/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-bl-none px-4 py-2 text-xs flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.2s]">.</span>
                <span className="animate-bounce [animation-delay:0.4s]">.</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-700 bg-slate-900">
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Ask about SCP flags, paths, or configs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Icons.Check className="w-5 h-5 rotate-45" />
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[60] bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all active:scale-95 ${isOpen ? 'hidden' : 'block pointer-events-auto'}`}
      >
        <Icons.Cpu className="w-6 h-6" />
      </button>
    </div>
  );
};

export default GeminiAssistant;
