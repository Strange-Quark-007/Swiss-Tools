import { LucideIcon } from 'lucide-react';

export interface AppModuleItem {
  id: string; // unique key, used for localStorage references
  name: string; // display name or i18n key
  icon: LucideIcon; // React component for the icon
  tooltip?: string; // optional tooltip for extra info on hover
  shortcut?: string; // optional keyboard shortcut for AppCommand
  isSelected?: boolean; // only for Sidebar items, to highlight the selected item
  onSelect?: () => void; // only for Sidebar items, callback for item selection
}

export interface AppModuleGroup {
  label: string; // label for the group
  items: AppModuleItem[]; // list of items in the group
}

export interface AppModuleList {
  groups: AppModuleGroup[]; // list of all groups
}
