
import React, { useState } from 'react';
import { Icons } from '../constants';
import { ServerConnection } from '../types';

interface ConnectionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  servers: ServerConnection[];
  onAdd: (server: Omit<ServerConnection, 'id' | 'status' | 'lastConnected'>) => void;
  onUpdate: (server: ServerConnection) => void;
  onDelete: (id: string) => void;
}

const ConnectionManager: React.FC<ConnectionManagerProps> = ({ isOpen, onClose, servers, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState<ServerConnection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    username: '',
    port: 22
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onUpdate({ ...isEditing, ...formData });
    } else {
      onAdd(formData);
    }
    setFormData({ name: '', host: '', username: '', port: 22 });
    setIsEditing(null);
  };

  const handleEditClick = (server: ServerConnection) => {
    setIsEditing(server);
    setFormData({
      name: server.name,
      host: server.host,
      username: server.username,
      port: server.port
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex h-[600px] overflow-hidden">
        {/* Sidebar for List */}
        <div className="w-1/3 border-r border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Saved Hosts</h3>
            <button 
              onClick={() => { setIsEditing(null); setFormData({ name: '', host: '', username: '', port: 22 }); }}
              className="text-indigo-400 hover:text-white p-1"
            >
              <Icons.Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
            {servers.map(server => (
              <div 
                key={server.id} 
                className={`group flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isEditing?.id === server.id ? 'bg-indigo-600/10 border border-indigo-500/30' : 'hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="truncate pr-2 cursor-pointer" onClick={() => handleEditClick(server)}>
                  <p className="text-sm font-medium text-white truncate">{server.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{server.username}@{server.host}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditClick(server)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg">
                    <Icons.Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDelete(server.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg">
                    <Icons.Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="flex-1 flex flex-col relative">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {isEditing ? `Edit ${isEditing.name}` : 'Add New Connection'}
            </h2>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white">
              <Icons.X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
                <input 
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. My Server"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Host / IP Address</label>
                <input 
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="192.168.1.1"
                  value={formData.host}
                  onChange={(e) => setFormData({...formData, host: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
                <input 
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="root"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SSH Port</label>
                <input 
                  type="number"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="22"
                  value={formData.port}
                  onChange={(e) => setFormData({...formData, port: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                {isEditing ? 'Save Changes' : 'Create Connection'}
              </button>
            </div>
          </form>

          {/* Quick Help Tip */}
          <div className="p-4 bg-indigo-600/5 m-8 rounded-xl border border-indigo-500/10 flex gap-4">
            <Icons.Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              NovaSCP uses standard OpenSSH protocols. Ensure your remote server has <strong>SSH Key Authentication</strong> or password access enabled on the specified port.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionManager;
