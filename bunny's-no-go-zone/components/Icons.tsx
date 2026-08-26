
import React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement>;

const base = (children: React.ReactNode) => (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

export const SearchIcon = base(<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></>);
export const SparklesIcon = base(<><path d="M12 3v4M12 17v4M5 5l2.5 2.5M16.5 16.5L19 19M3 12h4M17 12h4M5 19l2.5-2.5M16.5 7.5L19 5" /><path d="M12 8l1.2 2.8L16 12l-2.8 1.2L12 16l-1.2-2.8L8 12l2.8-1.2z" /></>);
export const GridIcon = base(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>);
export const ArrowRightIcon = base(<><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>);
export const UserIcon = base(<><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" /></>);
export const CalendarIcon = base(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>);
export const BriefcaseIcon = base(<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></>);
export const TrendingUpIcon = base(<><path d="M4 17l5-5 4 4 7-8" /><path d="M14 8h6v6" /></>);
export const UsersIcon = base(<><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" /><path d="M16 4.5a3 3 0 010 6" /><path d="M18.5 14.5c2 .5 3.5 2.2 3.5 5.5" /></>);
export const PhoneIcon = base(<path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1.2 1.2 0 011.2-.3 9.8 9.8 0 003.1.5 1.2 1.2 0 011.2 1.2v3a1.2 1.2 0 01-1.2 1.2A17.4 17.4 0 013 4.2 1.2 1.2 0 014.2 3h3a1.2 1.2 0 011.2 1.2 9.8 9.8 0 00.5 3.1 1.2 1.2 0 01-.3 1.2z" />);
export const DollarIcon = base(<><path d="M12 2v20" /><path d="M17 6.5C17 5 15 4 12 4s-5 1.3-5 3.2c0 4 10 2 10 6.3 0 2-2 3.5-5 3.5s-5-1.2-5-3" /></>);
export const GlobeIcon = base(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 4 5.7 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.7-4-9s1.5-6.5 4-9z" /></>);
export const MailIcon = base(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>);
export const MessageCircleIcon = base(<path d="M21 12a8.5 8.5 0 01-12.4 7.5L3 21l1.6-5.2A8.5 8.5 0 1121 12z" />);
export const HelpCircleIcon = base(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 014.7 1.2c0 1.5-2.2 1.8-2.2 3.3" /><path d="M12 17.2v.1" /></>);
export const HeartIcon = base(<path d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2 4.5 5.5 4a5 5 0 016.5 3 5 5 0 016.5-3c3.5.5 5 4 3.5 7.2-2.5 4.7-10 9.3-10 9.3z" />);
export const GemIcon = base(<><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20M9 3l3 6-3 12M15 3l-3 6 3 12" /></>);
export const CrownIcon = base(<><path d="M3 8l4 3 5-6 5 6 4-3-2 11H5z" /><path d="M5 19h14" /></>);
export const ClockIcon = base(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>);
export const XCircleIcon = base(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5l5 5M14.5 9.5l-5 5" /></>);
export const WrenchIcon = base(<path d="M14.7 6.3a4 4 0 00-5.6 4.9L3 17.3 5.7 20l6.1-6.1a4 4 0 004.9-5.6l-2.6 2.6-2.1-2.1z" />);
export const WalletIcon = base(<><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14.5" r="1" /></>);
export const PuzzleIcon = base(<path d="M9 3h4v2.5a1.5 1.5 0 003 0V3h4v4h-2.5a1.5 1.5 0 000 3H20v4h-2.5a1.5 1.5 0 000 3H20v4h-4v-2.5a1.5 1.5 0 00-3 0V21H9v-4h2.5a1.5 1.5 0 000-3H9v-4h2.5a1.5 1.5 0 000-3H9z" />);
