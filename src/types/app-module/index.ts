import { LucideIcon } from 'lucide-react';

import { ROUTES } from '@/constants/routes';

export interface AppModuleItem {
  id: ROUTES; // unique route identifier
  name: string; // display name or i18n key
  icon: LucideIcon; // React component for the icon
  tooltip?: string; // optional tooltip for extra info on hover
  shortcut?: string; // optional keyboard shortcut for AppCommand
  isSelected?: boolean; // used internally by sidebar to highlight the selected item
}

export interface AppModuleGroup {
  label: string;
  items: AppModuleItem[];
}

export interface AppModuleList {
  groups: AppModuleGroup[];
}
