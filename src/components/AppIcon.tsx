import React from 'react';
import {
  Ticket,
  FileText,
  Warehouse,
  Lightbulb,
  CalendarDays,
  Video,
  Hammer,
  Globe,
  HeartHandshake,
  Users,
  Shield,
  Briefcase,
  Database,
  Phone,
  Mail,
  Settings,
  FolderLock,
  Layers,
  GraduationCap,
  ClipboardList,
  Activity,
  Heart,
  Truck,
  Building,
  Key,
  HelpCircle,
} from 'lucide-react';

interface AppIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, className = '', size = 36 }) => {
  const normalized = (name || '').toLowerCase().trim();

  switch (normalized) {
    case 'ticket':
    case 'ticketing':
      return <Ticket size={size} className={className} strokeWidth={2.2} />;
    case 'file-text':
    case 'file':
    case 'legal':
      return <FileText size={size} className={className} strokeWidth={2.2} />;
    case 'warehouse':
    case 'inventory':
    case 'box':
      return <Warehouse size={size} className={className} strokeWidth={2.2} />;
    case 'lightbulb':
    case 'knowledge':
    case 'idea':
      return <Lightbulb size={size} className={className} strokeWidth={2.2} />;
    case 'calendar':
    case 'movement':
    case 'visit':
      return <CalendarDays size={size} className={className} strokeWidth={2.2} />;
    case 'video':
    case 'cctv':
    case 'camera':
      return <Video size={size} className={className} strokeWidth={2.2} />;
    case 'hammer':
    case 'admin':
    case 'tool':
      return <Hammer size={size} className={className} strokeWidth={2.2} />;
    case 'globe':
    case 'website':
    case 'portal':
      return <Globe size={size} className={className} strokeWidth={2.2} />;
    case 'heart-handshake':
    case 'shelter':
    case 'children':
      return <HeartHandshake size={size} className={className} strokeWidth={2.2} />;
    case 'users':
    case 'team':
    case 'employee':
      return <Users size={size} className={className} strokeWidth={2.2} />;
    case 'shield':
    case 'security':
      return <Shield size={size} className={className} strokeWidth={2.2} />;
    case 'briefcase':
    case 'hr':
    case 'finance':
      return <Briefcase size={size} className={className} strokeWidth={2.2} />;
    case 'database':
    case 'records':
      return <Database size={size} className={className} strokeWidth={2.2} />;
    case 'clipboard':
    case 'reports':
      return <ClipboardList size={size} className={className} strokeWidth={2.2} />;
    case 'graduation-cap':
    case 'education':
      return <GraduationCap size={size} className={className} strokeWidth={2.2} />;
    case 'truck':
    case 'logistics':
      return <Truck size={size} className={className} strokeWidth={2.2} />;
    case 'activity':
      return <Activity size={size} className={className} strokeWidth={2.2} />;
    case 'folder-lock':
      return <FolderLock size={size} className={className} strokeWidth={2.2} />;
    case 'building':
      return <Building size={size} className={className} strokeWidth={2.2} />;
    case 'key':
      return <Key size={size} className={className} strokeWidth={2.2} />;
    case 'heart':
      return <Heart size={size} className={className} strokeWidth={2.2} />;
    case 'phone':
      return <Phone size={size} className={className} strokeWidth={2.2} />;
    case 'mail':
      return <Mail size={size} className={className} strokeWidth={2.2} />;
    case 'settings':
      return <Settings size={size} className={className} strokeWidth={2.2} />;
    default:
      return <Layers size={size} className={className} strokeWidth={2.2} />;
  }
};

export const AVAILABLE_ICONS = [
  { id: 'ticket', label: 'Ticket / Helpdesk' },
  { id: 'file-text', label: 'Documents / Legal' },
  { id: 'warehouse', label: 'Warehouse / Inventory' },
  { id: 'lightbulb', label: 'Knowledge / Learning' },
  { id: 'calendar', label: 'Calendar / Movement' },
  { id: 'video', label: 'CCTV / Video' },
  { id: 'globe', label: 'Web Portal / Online' },
  { id: 'heart-handshake', label: 'Welfare / Community' },
  { id: 'users', label: 'Staff / Directory' },
  { id: 'briefcase', label: 'HR / Finance' },
  { id: 'database', label: 'Database / Records' },
  { id: 'clipboard', label: 'Reports / Checklist' },
  { id: 'graduation-cap', label: 'Education / School' },
  { id: 'shield', label: 'Security / Safety' },
  { id: 'truck', label: 'Transport / Logistics' },
  { id: 'hammer', label: 'Tools / Admin' },
];
