export interface Concert {
  id: string;
  band: string;
  date: string; // ISO format YYYY-MM-DD for storage/sorting
  displayDate?: string; // Original format for display preference if needed, mostly used for initial import
  city: string;
  event: string;
  artists: number;
  cost: number;
  year: number;
}

export type SortField = 'date' | 'cost' | 'band';
export type SortOrder = 'asc' | 'desc';
export type PriceRange = 'all' | 'free' | 'under-30' | '30-60' | 'over-60';

export interface FilterState {
  search: string;
  minYear: string;
  maxYear: string;
}