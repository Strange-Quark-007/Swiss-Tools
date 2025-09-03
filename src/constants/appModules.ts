import { redirect } from 'next/navigation';
import { Binary, Braces, FileCode2, Hash, Type } from 'lucide-react';

import { AppModuleGroup } from '@/types/app-module';
import { TranslationFunction } from '@/i18n/utils';
import { ROUTES } from '@/constants/routes';

export const appModules = (t: TranslationFunction): AppModuleGroup[] => [
  {
    label: t('label.conversion'),
    items: [
      {
        id: ROUTES.NUMBER_CONVERSION,
        name: t('numberConversion.name'),
        icon: Binary,
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
