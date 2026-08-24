
import { Category, Medium, Reason, Tone } from './types';

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
