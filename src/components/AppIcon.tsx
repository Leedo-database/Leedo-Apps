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
  Home,
  Calculator,
  MessageSquare,
  Utensils,
  Stethoscope,
  BookOpen,
  Award,
  Bell,
  Printer,
  Cloud,
  Camera,
  Music,
  Smile,
  MapPin,
  Target,
  UserCheck,
  BarChart3,
  Laptop,
  Clock,
  FileSpreadsheet,
  Folder,
  PhoneCall,
  Coins,
} from 'lucide-react';

interface AppIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, className = '', size = 36 }) => {
  const normalized = (name || '').toLowerCase().trim();

  switch (normalized) {
    case 'home':
    case 'peace-home':
    case 'house':
      return <Home size={size} className={className} strokeWidth={2.2} />;
    case 'calculator':
    case 'calc':
    case 'accounts':
      return <Calculator size={size} className={className} strokeWidth={2.2} />;
    case 'coins':
    case 'money':
    case 'budget':
      return <Coins size={size} className={className} strokeWidth={2.2} />;
    case 'message':
    case 'chat':
    case 'communication':
      return <MessageSquare size={size} className={className} strokeWidth={2.2} />;
    case 'utensils':
    case 'food':
    case 'canteen':
    case 'kitchen':
      return <Utensils size={size} className={className} strokeWidth={2.2} />;
    case 'stethoscope':
    case 'health':
    case 'medical':
    case 'clinic':
      return <Stethoscope size={size} className={className} strokeWidth={2.2} />;
    case 'book':
    case 'book-open':
    case 'library':
      return <BookOpen size={size} className={className} strokeWidth={2.2} />;
    case 'user-check':
    case 'attendance':
      return <UserCheck size={size} className={className} strokeWidth={2.2} />;
    case 'spreadsheet':
    case 'excel':
    case 'sheets':
      return <FileSpreadsheet size={size} className={className} strokeWidth={2.2} />;
    case 'chart':
    case 'analytics':
    case 'barchart':
      return <BarChart3 size={size} className={className} strokeWidth={2.2} />;
    case 'folder':
    case 'program':
    case 'projects':
      return <Folder size={size} className={className} strokeWidth={2.2} />;
    case 'clock':
    case 'time':
    case 'shift':
      return <Clock size={size} className={className} strokeWidth={2.2} />;
    case 'laptop':
    case 'computer':
    case 'it':
      return <Laptop size={size} className={className} strokeWidth={2.2} />;
    case 'camera':
    case 'photo':
    case 'media':
      return <Camera size={size} className={className} strokeWidth={2.2} />;
    case 'smile':
    case 'child-care':
    case 'recreation':
      return <Smile size={size} className={className} strokeWidth={2.2} />;
    case 'music':
    case 'culture':
      return <Music size={size} className={className} strokeWidth={2.2} />;
    case 'map-pin':
    case 'mappin':
    case 'location':
      return <MapPin size={size} className={className} strokeWidth={2.2} />;
    case 'target':
    case 'goal':
      return <Target size={size} className={className} strokeWidth={2.2} />;
    case 'award':
    case 'achievement':
      return <Award size={size} className={className} strokeWidth={2.2} />;
    case 'bell':
    case 'notice':
    case 'alert':
      return <Bell size={size} className={className} strokeWidth={2.2} />;
    case 'printer':
    case 'print':
      return <Printer size={size} className={className} strokeWidth={2.2} />;
    case 'cloud':
    case 'drive':
      return <Cloud size={size} className={className} strokeWidth={2.2} />;
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
    case 'phone-call':
      return <PhoneCall size={size} className={className} strokeWidth={2.2} />;
    case 'mail':
      return <Mail size={size} className={className} strokeWidth={2.2} />;
    case 'settings':
      return <Settings size={size} className={className} strokeWidth={2.2} />;
    default:
      return <Layers size={size} className={className} strokeWidth={2.2} />;
  }
};

export const AVAILABLE_ICONS = [
  { id: 'home', label: 'Peace Home / Shelter' },
  { id: 'calculator', label: 'Accounts / Calculator' },
  { id: 'coins', label: 'Finance / Budget' },
  { id: 'message', label: 'Communication / Chat' },
  { id: 'users', label: 'Staff / Directory / HR' },
  { id: 'briefcase', label: 'Management / Executive' },
  { id: 'folder', label: 'Program / Project Folder' },
  { id: 'heart-handshake', label: 'Social Welfare / Children' },
  { id: 'stethoscope', label: 'Health / Medical / Clinic' },
  { id: 'utensils', label: 'Food / Canteen / Nutrition' },
  { id: 'graduation-cap', label: 'Education / School' },
  { id: 'book', label: 'Library / Curriculum' },
  { id: 'user-check', label: 'Attendance / Verification' },
  { id: 'spreadsheet', label: 'Spreadsheet / Excel' },
  { id: 'chart', label: 'Analytics / Statistics' },
  { id: 'ticket', label: 'Ticket / Helpdesk' },
  { id: 'file-text', label: 'Documents / Legal' },
  { id: 'warehouse', label: 'Warehouse / Inventory' },
  { id: 'clipboard', label: 'Reports / Checklist' },
  { id: 'calendar', label: 'Calendar / Movement' },
  { id: 'clock', label: 'Clock / Shifts / Hours' },
  { id: 'video', label: 'CCTV / Video Monitoring' },
  { id: 'camera', label: 'Photo / Media Gallery' },
  { id: 'globe', label: 'Web Portal / Online' },
  { id: 'laptop', label: 'IT Support / Systems' },
  { id: 'cloud', label: 'Cloud Drive / Storage' },
  { id: 'mail', label: 'Email / Inbox' },
  { id: 'phone', label: 'Phone / Hotline' },
  { id: 'bell', label: 'Notice / Announcements' },
  { id: 'smile', label: 'Child Care / Recreation' },
  { id: 'music', label: 'Cultural / Music' },
  { id: 'map-pin', label: 'Location / Field Visit' },
  { id: 'shield', label: 'Security / Safety' },
  { id: 'target', label: 'Goals / Targets' },
  { id: 'award', label: 'Awards / Recognition' },
  { id: 'printer', label: 'Printer / Print Station' },
  { id: 'truck', label: 'Transport / Logistics' },
  { id: 'building', label: 'Building / Office HQ' },
  { id: 'key', label: 'Key / Access / Security' },
  { id: 'lightbulb', label: 'Knowledge / Ideas' },
  { id: 'heart', label: 'Donation / Care' },
  { id: 'hammer', label: 'Tools / Admin Ops' },
  { id: 'settings', label: 'Settings / Configuration' },
];
