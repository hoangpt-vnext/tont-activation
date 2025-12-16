export interface ProgramEvent {
  id: string;
  city: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm - HH:mm
  venue: string;
  address: string;
  mapLink?: string; // Optional custom link
  brand: string;
  description?: string;
}

export interface Promotion {
  id: string;
  title: string;
  image: string;
  brand: string;
  content: string; // New field for blog/rules content
}

export interface AppSettings {
  logoUrl: string;
  
  // Hero Section (Home)
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;

  // CTA Section (Home)
  ctaTitle: string;
  ctaDescription: string;

  // Schedule Section
  scheduleTitle: string;
  scheduleSubtitle: string;

  promotions: Promotion[];
}

export type SortField = keyof ProgramEvent;
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface FilterState {
  search: string;
  city: string;
  brand: string;
  dateFrom: string;
  dateTo: string;
}

export type View = 'home' | 'schedule' | 'admin' | 'program-detail';