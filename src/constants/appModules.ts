import { redirect } from 'next/navigation';
import { Hash, Type, Braces } from 'lucide-react';

import { AppModuleGroup } from '@/types/app-module';
import { TranslationFunction } from '@/i18n/utils';
import { ROUTES } from '@/constants/routes';

export const appModules = (t: TranslationFunction): AppModuleGroup[] => [
  {
    label: t('label.conversions'),
    items: [
      {
        id: ROUTES.NUMBER_CONVERSION,
        name: t('numberConversion.name'),
        icon: Hash,
        onSelect: () => redirect(ROUTES.NUMBER_CONVERSION),
      },
      {
        id: ROUTES.CASE_CONVERSION,
        name: t('caseConversion.name'),
        icon: Type,
        onSelect: () => redirect(ROUTES.CASE_CONVERSION),
      },
      {
        id: ROUTES.DATA_FORMAT_CONVERSION,
        name: t('dataFormatConversion.name'),
        icon: Braces,
        onSelect: () => redirect(ROUTES.DATA_FORMAT_CONVERSION),
      },
    ],
  },
];
