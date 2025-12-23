
import React from 'react';
import { Message } from '../types';
import { Icons } from '../constants';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex flex-col mb-6 animate-fadeIn ${isAssistant ? 'items-start' : 'items-end'}`}>
      <div className="flex items-center gap-2 mb-1 px-1">
        {isAssistant ? (
          <>
            <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold">O</div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Obscura</span>
          </>
        ) : (
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">You</span>
        )}
      </div>
      <div 
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isAssistant 
            ? 'bg-[#111] text-gray-200 border border-white/5 shadow-sm' 
            : 'bg-purple-900/30 text-purple-100 border border-purple-500/20'
        }`}
      >
        {message.content}
        {message.data && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-purple-400 font-medium">
            <Icons.Sparkles />
            <span>Interface: {message.data.title}</span>
          </div>
        )}
      </div>
      <span className="text-[10px] text-gray-600 mt-1 px-1">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};
