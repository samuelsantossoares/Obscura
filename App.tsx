
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, ViewMode, GeneratedUI } from './types';
import { Icons } from './constants';
import { ChatMessage } from './components/ChatMessage';
import { PreviewFrame } from './components/PreviewFrame';
import { CodeDisplay } from './components/CodeDisplay';
import { generateInterface } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "System initialized. I am Obscura. I transform your concepts into precise UI/UX engineering. What interface shall we build today?",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentUI, setCurrentUI] = useState<GeneratedUI | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PREVIEW);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userPrompt = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Call Gemini
    const result = await generateInterface(userPrompt, messages.map(m => ({ role: m.role, content: m.content })));

    if (result) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Engineering complete: **${result.title}**. ${result.description}`,
        timestamp: Date.now(),
        data: result
      };
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentUI(result);
    } else {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an architectural discrepancy while processing that prompt. Please refine your requirements.",
        timestamp: Date.now()
      }]);
    }

    setIsGenerating(false);
  };

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans select-none">
      
      {/* Left Column: Chat Interface */}
      <div className="w-1/3 min-w-[380px] border-r border-white/10 flex flex-col bg-[#080808]">
        {/* Header */}
        <header className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center purple-glow">
              <span className="text-purple-400 font-bold text-xl tracking-tighter">O</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-white uppercase">Obscura</h1>
              <p className="text-[10px] text-purple-400/60 font-medium uppercase tracking-[0.2em]">Automated Interface Engineer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{isGenerating ? 'Computing' : 'Ready'}</span>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isGenerating && (
            <div className="flex flex-col items-start animate-fadeIn">
              <div className="flex items-center gap-2 mb-1 px-1">
                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold">O</div>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Obscura</span>
              </div>
              <div className="bg-[#111] text-gray-400 px-4 py-3 rounded-2xl text-sm italic flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"></span>
                </div>
                Generating structural components...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#080808] border-t border-white/5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Design a modern landing page for a space startup..."
              className="w-full bg-[#121212] text-white border border-white/10 rounded-xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-700"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isGenerating}
              className="absolute right-2 p-3 text-purple-400 hover:text-purple-300 disabled:text-gray-700 transition-all disabled:cursor-not-allowed"
            >
              <Icons.Send />
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-3 text-center uppercase tracking-widest">
            Press Enter to initialize generation
          </p>
        </div>
      </div>

      {/* Right Column: Preview & Code */}
      <div className="flex-1 flex flex-col relative bg-black">
        {/* Navigation Tabs */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex bg-[#111] p-1 rounded-xl border border-white/5 shadow-2xl">
          <button
            onClick={() => setViewMode(ViewMode.PREVIEW)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all ${
              viewMode === ViewMode.PREVIEW ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icons.Eye />
            Preview
          </button>
          <button
            onClick={() => setViewMode(ViewMode.CODE)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all ${
              viewMode === ViewMode.CODE ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icons.Code />
            Code
          </button>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 mt-0">
          {viewMode === ViewMode.PREVIEW ? (
            <PreviewFrame data={currentUI} />
          ) : (
            <CodeDisplay code={currentUI?.code || ''} />
          )}
        </div>

        {/* Footer Overlay Info */}
        {currentUI && (
          <div className="absolute bottom-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/5 rounded-2xl flex items-center gap-6 animate-fadeIn">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Project Name</span>
              <span className="text-xs font-bold text-white">{currentUI.title}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Architecture</span>
              <span className="text-xs font-bold text-purple-400">Tailwind CSS + React</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: currentUI.visualIdentity.primaryColor }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: currentUI.visualIdentity.secondaryColor }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
