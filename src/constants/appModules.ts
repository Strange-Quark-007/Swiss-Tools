import { Binary, Braces, CaseSensitive, FileCode2, Fingerprint, Hash, LayoutDashboard } from 'lucide-react';

import { ROUTES } from '@/constants/routes';
import { TranslationFunction } from '@/i18n/utils';
import { AppModuleGroup } from '@/types/app-module';

export const staticModule = (t: TranslationFunction): AppModuleGroup => ({
  label: t('dashboard.name'),
  items: [{ id: ROUTES.DASHBOARD, name: t('dashboard.name'), description: '', icon: LayoutDashboard }],
});

export const appModules = (t: TranslationFunction): AppModuleGroup[] => [
  {
    label: t('label.converters'),
    items: [
      {
        id: ROUTES.NUMBER_CONVERTER,
        name: t('numberConverter.name'),
        description: t('numberConverter.description'),
        icon: Binary,
      },
      {
        id: ROUTES.CASE_CONVERTER,
        name: t('caseConverter.name'),
        description: t('caseConverter.description'),
        icon: CaseSensitive,
      },
      {
        id: ROUTES.DATA_FORMAT_CONVERTER,
        name: t('dataFormatConverter.name'),
        description: t('dataFormatConverter.description'),
        icon: Braces,
      },
    ],
  },
  {
    label: t('label.security'),
    items: [
      {
        id: ROUTES.ENCODER_DECODER,
        name: t('encoderDecoder.name'),
        description: t('encoderDecoder.description'),
        icon: FileCode2,
      },
      {
        id: ROUTES.HASH_GENERATOR,
        name: t('hashGenerator.name'),
        description: t('hashGenerator.description'),
        icon: Hash,
      },
      {
        id: ROUTES.JWT_DECODER,
        name: t('jwtDecoder.name'),
        description: t('jwtDecoder.description'),
        icon: Fingerprint,
      },
    ],
  },
];
