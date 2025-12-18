export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserPayload {
  username: string;
  password: string;
}

export interface ElectronAPI {
  user: {
    create: (payload: CreateUserPayload) => Promise<User>;
    list: () => Promise<User[]>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
