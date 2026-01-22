
import React, { useState } from 'react';
import { Icons, MOCK_FILES } from '../constants';
import { FileType, SCPFile } from '../types';

interface FileBrowserProps {
  onTransfer: (file: SCPFile, direction: 'upload' | 'download') => void;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ onTransfer }) => {
  const [currentPath, setCurrentPath] = useState('/home/ubuntu');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = MOCK_FILES.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '--';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* ToolBar */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 w-full max-w-xl">
            <span className="text-slate-500 text-xs font-mono uppercase">Path:</span>
            <input 
              className="bg-transparent border-none outline-none text-sm font-mono text-indigo-400 w-full"
              value={currentPath}
              onChange={(e) => setCurrentPath(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500 w-48"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Icons.Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* File List Header */}
      <div className="grid grid-cols-[1fr,120px,180px,100px] gap-4 px-6 py-3 border-b border-slate-800 bg-slate-900/30">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Name</div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Size</div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Modified</div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Permissions</div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredFiles.map((file) => (
          <div 
            key={file.id}
            onClick={() => setSelectedFile(file.id)}
            onDoubleClick={() => onTransfer(file, 'download')}
            className={`grid grid-cols-[1fr,120px,180px,100px] gap-4 px-6 py-2.5 items-center cursor-pointer border-b border-slate-800/50 group transition-colors ${
              selectedFile === file.id ? 'bg-indigo-600/10' : 'hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              {file.type === FileType.DIRECTORY ? (
                <Icons.Folder className="w-5 h-5 text-indigo-400 fill-indigo-400/10" />
              ) : (
                <Icons.File className="w-5 h-5 text-slate-400" />
              )}
              <span className={`text-sm font-medium ${selectedFile === file.id ? 'text-indigo-300' : 'text-slate-200'}`}>
                {file.name}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500 text-right">
              {formatSize(file.size)}
            </div>
            <div className="text-xs text-slate-500 text-right">
              {file.modified}
            </div>
            <div className="text-xs font-mono text-slate-600 text-center">
              {file.permissions}
            </div>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="h-8 border-t border-slate-800 flex items-center px-4 bg-slate-900 justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Items: {filteredFiles.length}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Selected: {selectedFile ? 1 : 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">Encrypted Session (AES-256)</span>
        </div>
      </div>
    </div>
  );
};

export default FileBrowser;
