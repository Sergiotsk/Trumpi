
import React from 'react';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Shield className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">WireGuard TV Engine</h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Minimal VPN Blueprint</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs font-mono">
        <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          READY FOR DEPLOYMENT
        </span>
        <span className="text-slate-500">v1.0.4-beta</span>
      </div>
    </header>
  );
};

export default Header;
