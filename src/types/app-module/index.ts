import { LucideIcon } from 'lucide-react';

import { ROUTES } from '@/constants/routes';

export interface AppModuleItem {
  id: ROUTES; // unique route identifier
  name: string; // display name or i18n key
  description: string; // short description of the module
  icon: LucideIcon; // React component for the icon
  tooltip?: string; // optional tooltip for hover when sidebar collapsed (default uses name)
  shortcut?: string; // optional keyboard shortcut for AppCommand
}

export interface AppModuleGroup {
  label: string;
  items: AppModuleItem[];
}

export interface AppModuleList {
  groups: AppModuleGroup[];
}
