import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Send, X, Bot, User, Loader2 } from 'lucide-react';

interface GeminiExpertProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GeminiExpert: React.FC<GeminiExpertProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Senior Android Expert. How can I help you refine your WireGuard implementation for Android TV?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Fix: Create fresh instance with API key right before use
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Fix: Use gemini-3-pro-preview for complex technical reasoning and systemInstruction for persona
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are acting as a Senior Android Engineer with deep expertise in WireGuard and Android TV development. The context is building a minimal VPN app for cheap Android TV boxes (low RAM/CPU). Keep answers highly technical, concise, and focused on performance for low-end devices.",
        }
      });

      // Fix: Properly access the .text property of GenerateContentResponse
      const reply = response.text || "I'm sorry, I couldn't process that. Try asking about VpnService lifecycle or GoBackend optimization.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Expert API Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to the Expert core. Please check your implementation." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl h-[600px] rounded-2xl flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="text-blue-500" />
            <span className="font-bold">Android Expert (Gemini 3 Pro)</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-3 rounded-2xl text-slate-400 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span>Expert is thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about performance, lifecycle, or code..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiExpert;