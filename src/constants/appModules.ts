import { Binary, Braces, CaseSensitive, FileCode2, Hash, LayoutDashboard } from 'lucide-react';

import { AppModuleGroup } from '@/types/app-module';
import { TranslationFunction } from '@/i18n/utils';
import { ROUTES } from '@/constants/routes';

export const staticModule = (t: TranslationFunction): AppModuleGroup => ({
  label: t('dashboard.name'),
  items: [{ id: ROUTES.DASHBOARD, name: t('dashboard.name'), icon: LayoutDashboard }],
});

export const appModules = (t: TranslationFunction): AppModuleGroup[] => [
  {
    label: t('label.converter'),
    items: [
      {
        id: ROUTES.NUMBER_CONVERTER,
        name: t('numberConverter.name'),
        icon: Binary,
      },
      {
        id: ROUTES.CASE_CONVERTER,
        name: t('caseConverter.name'),
        icon: CaseSensitive,
      },
      {
        id: ROUTES.DATA_FORMAT_CONVERTER,
        name: t('dataFormatConverter.name'),
        icon: Braces,
      },
    ],
  },
  {
    label: t('label.cypher'),
    items: [
      {
        id: ROUTES.ENCODER_DECODER,
        name: t('encoderDecoder.name'),
        icon: FileCode2,
      },
      {
        id: ROUTES.HASH_GENERATOR,
        name: t('hashGenerator.name'),
        icon: Hash,
      },
    ],
  },
];
