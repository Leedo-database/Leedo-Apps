import { Notice } from '../types';

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: 'LEEDO Annual Program Strategy & Quarterly Planning Meeting',
    content: 'All Program Coordinators, Social Mobilizers, and Teachers are requested to submit their monthly progress reports by Thursday 5:00 PM.',
    date: 'Oct 05, 2026',
    author: 'Md. Omar Faruque (Manager HR & Admin)',
    isImportant: true,
  },
  {
    id: 'notice-2',
    title: 'Shelter Home Children Health Checkup Camp',
    content: 'Health examination and psychosocial support session will be held at LEEDO Peace Home this coming Saturday. Mobile clinic teams are requested to prepare necessary medical kits.',
    date: 'Oct 02, 2026',
    author: 'Admin & Finance Department',
    isImportant: false,
  },
];
