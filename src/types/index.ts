export type UserRole = 'admin' | 'staff';

export interface Employee {
  sl: number;
  eid: string;
  name: string;
  designation: string;
  department: string;
  mobile: string;
  role: UserRole;
  password?: string;
  isPasswordChanged?: boolean;
}

export interface AppCategory {
  id: string;
  name: string;
  order: number;
}

export interface AppItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon: string; // lucide icon identifier
  category?: string;
  isCustom?: boolean;
  createdAt?: string;
  order?: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  isImportant?: boolean;
}

export interface BackgroundConfig {
  type: 'pattern' | 'image';
  imageUrl?: string;
  blur: number; // in px: 0 to 25
  dim: number; // in %: 10 to 80
  overlayColor?: string;
}

export interface UserSession {
  eid: string;
  name: string;
  designation: string;
  department: string;
  mobile: string;
  role: UserRole;
  isPasswordChanged: boolean;
  loginTime: string;
}
