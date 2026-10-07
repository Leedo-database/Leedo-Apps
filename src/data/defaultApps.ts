import { AppItem } from '../types';

export const INITIAL_APPS: AppItem[] = [
  // Management
  {
    id: 'app-leedo-official',
    title: 'LEEDO Official Portal',
    description: 'Main public website, publications, stories, and press releases',
    url: 'https://leedobd.org',
    icon: 'globe',
    category: 'Management',
    order: 1,
  },
  {
    id: 'app-executive-admin',
    title: 'Executive Admin & Governance',
    description: 'Executive committee records, governance documents, and directives',
    url: 'https://leedobd.org/governance',
    icon: 'hammer',
    category: 'Management',
    order: 2,
  },

  // HR
  {
    id: 'app-hr-portal',
    title: 'HR & Employee Attendance',
    description: 'Staff leave records, attendance log, payroll, and HR policies',
    url: 'https://leedobd.org/hr-attendance',
    icon: 'users',
    category: 'HR',
    order: 3,
  },
  {
    id: 'app-ticket',
    title: 'Ticketing System',
    description: 'Internal IT support, asset requests, and helpdesk ticketing',
    url: 'https://leedobd.org/support-tickets',
    icon: 'ticket',
    category: 'HR',
    order: 4,
  },

  // Accounts
  {
    id: 'app-accounts',
    title: 'Accounts & Expense Tracker',
    description: 'General ledger, petty cash, budget allocations, and audit files',
    url: 'https://leedobd.org/accounts-finance',
    icon: 'briefcase',
    category: 'Accounts',
    order: 5,
  },
  {
    id: 'app-inventory',
    title: 'Inventory & Asset Tracking',
    description: 'Logistics, shelter assets, relief materials, and supplies tracker',
    url: 'https://leedobd.org/inventory-assets',
    icon: 'warehouse',
    category: 'Accounts',
    order: 6,
  },

  // Communication
  {
    id: 'app-communication',
    title: 'Media & Public Relations',
    description: 'Press releases, social media assets, photos, and campaigns',
    url: 'https://leedobd.org/media-relations',
    icon: 'video',
    category: 'Communication',
    order: 7,
  },
  {
    id: 'app-legal',
    title: 'Legal Document Tracking',
    description: 'Track contracts, MOUs, deeds, and regulatory compliance files',
    url: 'https://leedobd.org/legal-documents',
    icon: 'file-text',
    category: 'Communication',
    order: 8,
  },

  // Program
  {
    id: 'app-movement',
    title: 'Movement, Visit & Report System',
    description: 'Daily field worker visits, outreach schedules, and activity reports',
    url: 'https://leedobd.org/field-movement-reports',
    icon: 'calendar',
    category: 'Program',
    order: 9,
  },
  {
    id: 'app-education',
    title: 'Street Children School & Education',
    description: 'Mobile school sessions, teacher syllabus, and student tracking',
    url: 'https://leedobd.org/street-education',
    icon: 'graduation-cap',
    category: 'Program',
    order: 10,
  },

  // Peace Home
  {
    id: 'app-child-registry',
    title: 'Peace Home Child Welfare Registry',
    description: 'Shelter resident profiles, medical history, reintegration cases',
    url: 'https://leedobd.org/peace-home-registry',
    icon: 'heart-handshake',
    category: 'Peace Home',
    order: 11,
  },
  {
    id: 'app-cctv',
    title: 'CCTV Live Monitoring System',
    description: 'Peace home transitional centre security and live surveillance',
    url: 'https://leedobd.org/cctv-monitoring',
    icon: 'video',
    category: 'Peace Home',
    order: 12,
  },
];
