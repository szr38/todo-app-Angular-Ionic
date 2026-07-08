export enum CategoryId {
  Personal = 'personal',
  Work = 'work',
  Shopping = 'shopping',
}

export interface Category {
  id: CategoryId;
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: CategoryId.Personal, name: 'Personal', color: '#2563eb' },
  { id: CategoryId.Work, name: 'Trabajo', color: '#0891b2' },
  { id: CategoryId.Shopping, name: 'Compras', color: '#16a34a' },
];

export function isCategoryId(value: string): value is CategoryId {
  return (Object.values(CategoryId) as string[]).includes(value);
}
