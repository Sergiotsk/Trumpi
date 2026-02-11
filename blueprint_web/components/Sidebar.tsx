
import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Layout, 
  Code2, 
  Monitor, 
  AlertTriangle 
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'arch', label: 'Architecture', icon: <ShieldCheck size={20} /> },
    { id: 'integration', label: 'Integration', icon: <Terminal size={20} /> },
    { id: 'structure', label: 'Structure', icon: <Layout size={20} /> },
    { id: 'code', label: 'Code Snippets', icon: <Code2 size={20} /> },
    { id: 'build', label: 'Build & Deploy', icon: <Monitor size={20} /> },
    { id: 'risks', label: 'Risks & Fixes', icon: <AlertTriangle size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-8 hidden lg:flex">
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-3">Navigation</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === item.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
        <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Target Profile</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Android 9.0+ <br/>
          Allwinner/Rockchip <br/>
          < 2GB RAM / Low Disk
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
