import { LucideIcon } from 'lucide-react';

export interface CategoryItem {
  icon: LucideIcon;
  name: string;
  tooltip?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export interface Category {
  label: string;
  items: CategoryItem[];
}

export interface CategoryList {
  categories: Category[];
}
