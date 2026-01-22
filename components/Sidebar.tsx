
import React from 'react';
import { Icons } from '../constants';
import { ServerConnection } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedServerId: string | null;
  setSelectedServerId: (id: string) => void;
  servers: ServerConnection[];
  onOpenManager: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, selectedServerId, setSelectedServerId, servers, onOpenManager }) => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20">
            <Icons.Cpu className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">NovaSCP</h1>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'dashboard' ? 'bg-indigo-600/10 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Icons.Server className="w-4 h-4" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'explorer' ? 'bg-indigo-600/10 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Icons.Folder className="w-4 h-4" />
            <span className="font-medium">Explorer</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'terminal' ? 'bg-indigo-600/10 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Icons.Terminal className="w-4 h-4" />
            <span className="font-medium">Terminal</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800/50">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Connections</h2>
          <button 
            onClick={onOpenManager}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded transition-colors"
          >
            <Icons.Settings className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1.5 overflow-y-auto max-h-56 no-scrollbar">
          {servers.map(server => (
            <button
              key={server.id}
              onClick={() => setSelectedServerId(server.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex flex-col gap-0.5 group border ${
                selectedServerId === server.id ? 'bg-slate-800 border-slate-700 shadow-inner shadow-black/20' : 'hover:bg-slate-800/50 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold truncate ${selectedServerId === server.id ? 'text-white' : 'text-slate-300'}`}>
                  {server.name}
                </span>
                <div className={`w-2 h-2 rounded-full border border-black/20 ${server.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-600'}`} />
              </div>
              <span className="text-[10px] text-slate-500 font-mono tracking-tighter truncate opacity-70 group-hover:opacity-100 transition-opacity">
                {server.username}@{server.host}
              </span>
            </button>
          ))}
          {servers.length === 0 && (
            <p className="text-[10px] text-slate-500 text-center py-4 italic">No servers added</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
