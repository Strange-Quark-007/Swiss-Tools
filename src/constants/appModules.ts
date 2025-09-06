import { redirect } from 'next/navigation';
import { Binary, Braces, FileCode2, Hash, Home, Type } from 'lucide-react';

import { AppModuleGroup } from '@/types/app-module';
import { TranslationFunction } from '@/i18n/utils';
import { ROUTES } from '@/constants/routes';

export const staticModule = (t: TranslationFunction): AppModuleGroup => ({
  label: t('dashboard.name'),
  items: [{ id: '/', name: t('dashboard.name'), icon: Home, onSelect: () => redirect('/') }],
});

export const appModules = (t: TranslationFunction): AppModuleGroup[] => [
  {
    label: t('label.converter'),
    items: [
      {
        id: ROUTES.NUMBER_CONVERTER,
        name: t('numberConverter.name'),
        icon: Binary,
        onSelect: () => redirect(ROUTES.NUMBER_CONVERTER),
      },
      {
        id: ROUTES.CASE_CONVERTER,
        name: t('caseConverter.name'),
        icon: Type,
        onSelect: () => redirect(ROUTES.CASE_CONVERTER),
      },
      {
        id: ROUTES.DATA_FORMAT_CONVERTER,
        name: t('dataFormatConverter.name'),
        icon: Braces,
        onSelect: () => redirect(ROUTES.DATA_FORMAT_CONVERTER),
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
        onSelect: () => redirect(ROUTES.ENCODER_DECODER),
      },
      {
        id: ROUTES.HASH_GENERATOR,
        name: t('hashGenerator.name'),
        icon: Hash,
        onSelect: () => redirect(ROUTES.HASH_GENERATOR),
      },
    ],
  },
];
