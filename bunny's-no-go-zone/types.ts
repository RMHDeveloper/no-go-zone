
export type Category = 
  | 'Customers' | 'Social Events' | 'Interviews' 
  | 'Investors' | 'Meetings' | 'Pushy People' | 'Work' 
  | 'Recruiters' | 'Phone Chats' | 'Salespeople' | string;

export type Medium = 'SMS / WhatsApp' | 'Email' | 'In-Person';

export type Reason = 'Busy' | 'Not Interested' | 'Not My Skillset' | 'No budget' | 'Not a fit';

export type Tone = 'Professional' | 'Sarcastic' | 'Senior Level';

export interface ScriptResponse {
  text: string;
  inspiration: string;
}
