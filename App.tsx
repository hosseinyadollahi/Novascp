
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FileBrowser from './components/FileBrowser';
import TransferQueue from './components/TransferQueue';
import ConnectionManager from './components/ConnectionManager';
import GeminiAssistant from './components/GeminiAssistant';
import { Icons, INITIAL_SERVERS } from './constants';
import { ServerConnection, TransferJob, SCPFile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('explorer');
  const [servers, setServers] = useState<ServerConnection[]>(() => {
    try {
      const saved = localStorage.getItem('novascp_servers');
      return saved ? JSON.parse(saved) : INITIAL_SERVERS;
    } catch (e) {
      return INITIAL_SERVERS;
    }
  });
  const [selectedServerId, setSelectedServerId] = useState<string | null>(servers[0]?.id || null);
  const [transferJobs, setTransferJobs] = useState<TransferJob[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'idle'>('idle');
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const selectedServer = servers.find(s => s.id === selectedServerId);

  useEffect(() => {
    localStorage.setItem('novascp_servers', JSON.stringify(servers));
  }, [servers]);

  useEffect(() => {
    if (selectedServerId) {
      setConnectionStatus('connecting');
      const timer = setTimeout(() => {
        setConnectionStatus('connected');
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setConnectionStatus('idle');
    }
  }, [selectedServerId]);

  const handleAddServer = (newServer: Omit<ServerConnection, 'id' | 'status' | 'lastConnected'>) => {
    const server: ServerConnection = {
      ...newServer,
      id: Math.random().toString(36).substr(2, 9),
      status: 'online',
      lastConnected: 'Just now'
    };
    setServers([...servers, server]);
    if (!selectedServerId) setSelectedServerId(server.id);
  };

  const handleUpdateServer = (updated: ServerConnection) => {
    setServers(servers.map(s => s.id === updated.id ? updated : s));
  };

  const handleDeleteServer = (id: string) => {
    if (confirm('Are you sure you want to delete this server connection?')) {
      const filtered = servers.filter(s => s.id !== id);
      setServers(filtered);
      if (selectedServerId === id) {
        setSelectedServerId(filtered[0]?.id || null);
      }
    }
  };

  const handleTransfer = (file: SCPFile, direction: 'upload' | 'download') => {
    const newJob: TransferJob = {
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      progress: 0,
      speed: '0 KB/s',
      status: 'transferring',
      direction
    };
    
    setTransferJobs(prev => [newJob, ...prev]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 20) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTransferJobs(prev => prev.map(job => 
          job.id === newJob.id ? { ...job, progress: 100, status: 'completed', speed: 'Done' } : job
        ));
      } else {
        setTransferJobs(prev => prev.map(job => 
          job.id === newJob.id ? { ...job, progress: currentProgress, speed: `${(Math.random() * 5 + 1).toFixed(1)} MB/s` } : job
        ));
      }
    }, 600);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        selectedServerId={selectedServerId}
        setSelectedServerId={setSelectedServerId}
        servers={servers}
        onOpenManager={() => setIsManagerOpen(true)}
      />

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {activeTab === 'explorer' ? 'Remote Explorer' : activeTab === 'dashboard' ? 'Overview' : 'Terminal Console'}
            </h2>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            {selectedServer ? (
              <div className="flex items-center gap-3">
                <span className="text-indigo-400 text-sm font-mono tracking-tight font-medium">
                  {selectedServer.username}@{selectedServer.host}
                </span>
                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  connectionStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {connectionStatus}
                </div>
              </div>
            ) : (
              <span className="text-slate-500 text-sm italic">No server selected</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/50 rounded-lg border border-slate-800">
              <Icons.Info className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Latency: {connectionStatus === 'connected' ? '24ms' : '--'}</span>
            </div>
            <button 
              onClick={() => setIsManagerOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 active:scale-95"
            >
              <Icons.Plus className="w-4 h-4" />
              New Host
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'explorer' && (
            <>
              <FileBrowser onTransfer={handleTransfer} />
              <TransferQueue jobs={transferJobs} />
            </>
          )}

          {activeTab === 'dashboard' && (
            <div className="flex-1 p-10 space-y-8 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Active Sessions', value: '4', icon: Icons.Terminal, color: 'text-indigo-400' },
                  { label: 'Total Storage', value: '820 GB', icon: Icons.Server, color: 'text-emerald-400' },
                  { label: 'Avg Speed', value: '45 MB/s', icon: Icons.Upload, color: 'text-amber-400' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl group hover:border-indigo-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-slate-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Metric</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                </div>
                <div className="space-y-4 text-slate-400 text-sm">
                  (Activity Log will appear here after transfers)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="flex-1 bg-black p-6 mono text-sm flex flex-col border-t border-slate-800">
              <div className="flex-1 overflow-y-auto space-y-2">
                <p className="text-emerald-500 opacity-80">Connecting to {selectedServer?.host || 'remote host'}...</p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-indigo-500 font-bold shrink-0">{selectedServer?.username || 'user'}@nova:~$</span>
                  <input className="bg-transparent border-none outline-none text-white w-full caret-indigo-500" placeholder="Type command..." autoFocus />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ConnectionManager 
        isOpen={isManagerOpen} 
        onClose={() => setIsManagerOpen(false)}
        servers={servers}
        onAdd={handleAddServer}
        onUpdate={handleUpdateServer}
        onDelete={handleDeleteServer}
      />
      <GeminiAssistant />
    </div>
  );
};

export default App;
