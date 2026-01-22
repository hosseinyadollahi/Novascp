
import React from 'react';
import { Icons } from '../constants';
import { TransferJob } from '../types';

interface TransferQueueProps {
  jobs: TransferJob[];
}

const TransferQueue: React.FC<TransferQueueProps> = ({ jobs }) => {
  return (
    <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Transfers</h3>
        <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
          {jobs.length} active
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {jobs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
            <Icons.Download className="w-12 h-12" />
            <p className="text-sm px-8">Queue is empty. Start a transfer to see progress.</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  {job.direction === 'upload' ? <Icons.Upload className="w-3 h-3 text-indigo-400" /> : <Icons.Download className="w-3 h-3 text-emerald-400" />}
                  <span className="text-xs font-medium text-slate-200 truncate">{job.fileName}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{job.speed}</span>
              </div>
              
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${job.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-[10px]">
                <span className={`uppercase font-bold tracking-wider ${
                  job.status === 'completed' ? 'text-emerald-500' : 
                  job.status === 'error' ? 'text-rose-500' : 'text-slate-500'
                }`}>
                  {job.status}
                </span>
                <span className="text-slate-400 font-mono">{job.progress}%</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransferQueue;
