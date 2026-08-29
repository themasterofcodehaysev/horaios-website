export * from './colors';
export * from './typography';
export * from './spacing';

// Navigation structure
export const NAVIGATION_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Songs & Lyrics', href: '/songs' },
  { label: 'Events', href: '/events' },
  { label: 'News', href: '/news' },
  { label: 'Visit Us', href: '/visit' },
];

// Church information (placeholder)
export const CHURCH_INFO = {
  name: 'Horaios Baptist Church',
  address: 'Phnom Penh, Cambodia',
  phone: '+855 (0) 23 XXX XXXX',
  email: 'info@horaiosbaptist.org',
  website: 'horaiosbaptist.org',
  socialMedia: {
    facebook: 'https://www.facebook.com/profile.php?id=61583373172735',
    youtube: 'https://www.youtube.com/@horaiosministrycambodia7430',
    instagram: 'https://instagram.com/horaiosbaptist',
  },
  serviceTimes: [
    { day: 'Sunday', time: '09:00 AM', type: 'Main Service' },
    { day: 'Sunday', time: '11:00 AM', type: 'Second Service' },
    { day: 'Wednesday', time: '07:00 PM', type: 'Prayer & Bible Study' },
  ],
};

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  MINISTRIES: '/ministries',
  SERMONS: '/sermons',
  SONGS: '/songs',
  EVENTS: '/events',
  NEWS: '/news',
  VISIT: '/visit',
  GIVE: '/give',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  NOT_FOUND: '/404',
};

// Animation settings
export const ANIMATIONS = {
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
};

// Breakpoints
export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
