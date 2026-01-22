
export enum FileType {
  FILE = 'file',
  DIRECTORY = 'directory'
}

export interface SCPFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  modified: string;
  permissions: string;
  owner: string;
}

export interface ServerConnection {
  id: string;
  name: string;
  host: string;
  username: string;
  port: number;
  lastConnected: string;
  status: 'online' | 'offline';
}

export interface TransferJob {
  id: string;
  fileName: string;
  progress: number;
  speed: string;
  status: 'queued' | 'transferring' | 'completed' | 'error';
  direction: 'upload' | 'download';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
