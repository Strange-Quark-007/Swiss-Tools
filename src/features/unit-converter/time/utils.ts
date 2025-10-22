import { TOOLTIP_TYPE } from '@/constants/common';
import { TranslationFunction } from '@/i18n/utils';
import { bulkProcessor } from '@/lib/bulk-processor';
import { ConverterResult, ValueUnion } from '@/types/common';

export type TimeType = ValueUnion<typeof TIMES>;

export const TIMES = {
  ms: { value: 'ms', label: 'Millisecond (ms)' },
  s: { value: 's', label: 'Second (s)' },
  min: { value: 'min', label: 'Minute (min)' },
  h: { value: 'h', label: 'Hour (h)' },
  d: { value: 'd', label: 'Day (d)' },
  wk: { value: 'wk', label: 'Week (wk)' },
  mo: {
    value: 'mo',
    label: 'Month (mo)',
    tooltip: { type: TOOLTIP_TYPE.info, messageKey: 'timeConverter.monthTooltip' },
  },
  yr: {
    value: 'yr',
    label: 'Year (yr)',
    tooltip: {
      type: TOOLTIP_TYPE.info,
      messageKey: 'timeConverter.yearTooltip',
    },
  },
} as const;

const conversionToSecond: Record<TimeType, number> = {
  ms: 0.001,
  s: 1,
  min: 60,
  h: 3600,
  d: 86400,
  wk: 604800,
  mo: 2592000,
  yr: 31104000,
};

const convertLength = (fromText: string, from: TimeType, to: TimeType, t: TranslationFunction): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const parsed = Number(fromText);

  if (!Number.isFinite(parsed)) {
    return {
      result: '',
      error: `${fromText} → ${t('label.invalidInput')}`,
    };
  }

  const converted = (parsed * conversionToSecond[from]) / conversionToSecond[to];

  return {
    result: converted.toFixed(3).replace(/\.?0+$/, ''),
  };
};

export const bulkConvertLength = (fromText: string, from: TimeType, to: TimeType, t: TranslationFunction) => {
  return bulkProcessor({
    fromText,
    processor: convertLength,
    converterArgs: [from, to, t],
    bulkErrorTranslation: t('converter.bulkConverterWithErrors'),
  });
};
