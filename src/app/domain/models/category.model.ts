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

const CATEGORY_META: Record<CategoryId, Pick<Category, 'name' | 'color'>> = {
  [CategoryId.Personal]: { name: 'Personal', color: '#2563eb' },
  [CategoryId.Work]: { name: 'Trabajo', color: '#0891b2' },
  [CategoryId.Shopping]: { name: 'Compras', color: '#16a34a' },
};

export const DEFAULT_CATEGORIES: Category[] = Object.values(CategoryId).map((id) => ({
  id,
  ...CATEGORY_META[id],
}));

export function isCategoryId(value: string): value is CategoryId {
  return Object.values(CategoryId).includes(value as CategoryId);
}
