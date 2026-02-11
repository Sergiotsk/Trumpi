
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-xl overflow-hidden border border-slate-800 bg-slate-900/30">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-xs font-mono text-slate-400">{title || language}</span>
        <button 
          onClick={handleCopy}
          className="text-slate-500 hover:text-slate-200 transition-colors p-1"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto custom-scrollbar text-sm leading-relaxed">
        <code className="text-slate-300">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
