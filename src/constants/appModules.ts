import { redirect } from 'next/navigation';
import { Hash } from 'lucide-react';

import { AppModuleGroup } from '@/types/app-module';

export const appModules: AppModuleGroup[] = [
  {
    label: 'Conversions',
    items: [
      {
        id: '/number-conversion',
        name: 'Number Conversion',
        icon: Hash,
        onSelect: () => redirect('/number-conversion'),
      },
    ],
  },
];
