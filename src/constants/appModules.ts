import {
  Binary,
  Braces,
  CaseSensitive,
  Clock,
  DraftingCompass,
  FileCode2,
  Fingerprint,
  FlaskConical,
  Gauge,
  HardDrive,
  Hash,
  KeyRound,
  LayoutDashboard,
  Ruler,
  Thermometer,
  Type,
  Weight,
} from 'lucide-react';

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
  {
    label: t('label.generators'),
    items: [
      {
        id: ROUTES.LOREM_GENERATOR,
        name: t('loremGenerator.name'),
        description: t('loremGenerator.description'),
        icon: Type,
      },
      {
        id: ROUTES.ID_GENERATOR,
        name: t('idGenerator.name'),
        description: t('idGenerator.description'),
        icon: KeyRound,
      },
    ],
  },
  {
    label: t('label.unitConverters'),
    items: [
      {
        id: ROUTES.LENGTH_CONVERTER,
        name: t('lengthConverter.name'),
        description: t('lengthConverter.description'),
        icon: Ruler,
      },
      {
        id: ROUTES.AREA_CONVERTER,
        name: t('areaConverter.name'),
        description: t('areaConverter.description'),
        icon: DraftingCompass,
      },
      {
        id: ROUTES.VOLUME_CONVERTER,
        name: t('volumeConverter.name'),
        description: t('volumeConverter.description'),
        icon: FlaskConical,
      },
      {
        id: ROUTES.WEIGHT_CONVERTER,
        name: t('weightConverter.name'),
        description: t('weightConverter.description'),
        icon: Weight,
      },
      {
        id: ROUTES.TEMPERATURE_CONVERTER,
        name: t('temperatureConverter.name'),
        description: t('temperatureConverter.description'),
        icon: Thermometer,
      },
      {
        id: ROUTES.TIME_CONVERTER,
        name: t('timeConverter.name'),
        description: t('timeConverter.description'),
        icon: Clock,
      },
      {
        id: ROUTES.SPEED_CONVERTER,
        name: t('speedConverter.name'),
        description: t('speedConverter.description'),
        icon: Gauge,
      },
      {
        id: ROUTES.DATA_SIZE_CONVERTER,
        name: t('dataSizeConverter.name'),
        description: t('dataSizeConverter.description'),
        icon: HardDrive,
      },
    ],
  },
];
