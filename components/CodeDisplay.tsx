
import React, { useState } from 'react';
import { Icons } from '../constants';

interface CodeDisplayProps {
  code: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) return null;

  return (
    <div className="h-full bg-[#050505] flex flex-col relative group">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={handleCopy}
          className="p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors flex items-center gap-2 text-xs font-medium text-gray-300"
        >
          {copied ? 'Copied!' : <><Icons.Copy /> Copy</>}
        </button>
      </div>
      <pre className="p-6 overflow-auto custom-scrollbar code-font text-sm leading-relaxed text-purple-200/80 h-full">
        <code>{code}</code>
      </pre>
    </div>
  );
};
