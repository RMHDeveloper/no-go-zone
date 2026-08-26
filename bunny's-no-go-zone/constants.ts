
import React from 'react';
import { Category, Medium, Reason, Tone } from './types';
import {
  UserIcon, CalendarIcon, BriefcaseIcon, TrendingUpIcon, UsersIcon, PhoneIcon, DollarIcon,
  MessageCircleIcon, MailIcon, ClockIcon, XCircleIcon, WrenchIcon, WalletIcon, PuzzleIcon,
  SparklesIcon, GemIcon, CrownIcon, IconProps,
} from './components/Icons';

export const CATEGORIES: Category[] = [
  'Customers', 'Social Events', 'Interviews',
  'Investors', 'Meetings', 'Pushy People', 'Work',
  'Recruiters', 'Phone Chats', 'Salespeople'
];

export const MEDIUMS: Medium[] = ['SMS / WhatsApp', 'Email', 'In-Person'];

export const REASONS: Reason[] = ['Busy', 'Not Interested', 'Not My Skillset', 'No budget', 'Not a fit'];

export const TONES: Tone[] = ['Professional', 'Sarcastic', 'Senior Level'];

export const DEFAULT_CATEGORY: Category = 'Work';
export const DEFAULT_MEDIUM: Medium = 'Email';
export const DEFAULT_REASON: Reason = 'Busy';
export const DEFAULT_TONE: Tone = 'Professional';

type IconComponent = React.FC<IconProps>;

export const CATEGORY_ICONS: Record<string, IconComponent> = {
  'Customers': UserIcon,
  'Social Events': CalendarIcon,
  'Interviews': BriefcaseIcon,
  'Investors': TrendingUpIcon,
  'Meetings': UsersIcon,
  'Pushy People': UserIcon,
  'Work': BriefcaseIcon,
  'Recruiters': UsersIcon,
  'Phone Chats': PhoneIcon,
  'Salespeople': DollarIcon,
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Customers': 'bg-violet-100 text-violet-600',
  'Social Events': 'bg-rose-100 text-rose-600',
  'Interviews': 'bg-blue-100 text-blue-600',
  'Investors': 'bg-emerald-100 text-emerald-600',
  'Meetings': 'bg-orange-100 text-orange-600',
  'Pushy People': 'bg-purple-100 text-purple-600',
  'Work': 'bg-sky-100 text-sky-600',
  'Recruiters': 'bg-teal-100 text-teal-600',
  'Phone Chats': 'bg-amber-100 text-amber-600',
  'Salespeople': 'bg-red-100 text-red-600',
};

export const MEDIUM_ICONS: Record<string, IconComponent> = {
  'SMS / WhatsApp': MessageCircleIcon,
  'Email': MailIcon,
  'In-Person': UserIcon,
};

export const REASON_ICONS: Record<string, IconComponent> = {
  'Busy': ClockIcon,
  'Not Interested': XCircleIcon,
  'Not My Skillset': WrenchIcon,
  'No budget': WalletIcon,
  'Not a fit': PuzzleIcon,
};

export const TONE_ICONS: Record<string, IconComponent> = {
  'Professional': SparklesIcon,
  'Sarcastic': GemIcon,
  'Senior Level': CrownIcon,
};
