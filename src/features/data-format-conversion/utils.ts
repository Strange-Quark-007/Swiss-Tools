import yaml from 'yaml';
import ini from 'ini';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { parse as csvParse, stringify as csvStringify } from 'csv/sync';
import toml, { JsonMap, JsonArray } from '@iarna/toml';

import { TranslationFunction } from '@/i18n/utils';

export type DataFormatType = (typeof DATA_FORMATS)[keyof typeof DATA_FORMATS]['value'];

export const DATA_FORMATS = {
  json: { value: 'json', label: 'JSON' },
  yaml: { value: 'yaml', label: 'YAML' },
  toml: { value: 'toml', label: 'TOML' },
  xml: { value: 'xml', label: 'XML' },
  csv: { value: 'csv', label: 'CSV' },
  ini: { value: 'ini', label: 'INI' },
} as const;

export const getDataFormatType = (dataFormatType?: DataFormatType | string): DataFormatType | null => {
  if (!dataFormatType) {
    return null;
  }
  if (dataFormatType in DATA_FORMATS) {
    return dataFormatType as DataFormatType;
  }
  return null;
};

export const isValidInput = (text: string): boolean => text.trim().length > 0;

type JsonValue = string | number | boolean | null | JsonMap | JsonArray;

// Helper to check CSV-compatible structure
const isCsvCompatible = (data: unknown): data is JsonArray =>
  Array.isArray(data) && data.every((item) => typeof item === 'object' && !Array.isArray(item) && item !== null);

// Helper to check INI-compatible structure
const isIniCompatible = (data: unknown): data is JsonMap =>
  typeof data === 'object' &&
  data !== null &&
  !Array.isArray(data) &&
  Object.values(data).every((v) => typeof v !== 'object' || v === null);

export const convertDataFormat = (
  fromText: string,
  fromFormat: DataFormatType | string | undefined,
  toFormat: DataFormatType | string | undefined,
  t: TranslationFunction
): { result: string; error?: string } => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  const fromType = getDataFormatType(fromFormat);
  const toType = getDataFormatType(toFormat);
  if (!fromType) {
    return { result: '', error: t('dataFormatConversion.invalidSourceFormat') };
  }
  if (!toType) {
    return { result: '', error: t('dataFormatConversion.invalidTargetFormat') };
  }

  let parsedData: JsonValue;

  // Parsing
  try {
    switch (fromType) {
      case 'json':
        parsedData = JSON.parse(fromText) as JsonValue;
        break;
      case 'yaml':
        parsedData = yaml.parse(fromText) as JsonValue;
        break;
      case 'toml':
        parsedData = toml.parse(fromText) as JsonMap;
        break;
      case 'xml': {
        const parser = new XMLParser({ ignoreAttributes: false, parseAttributeValue: true });
        parsedData = parser.parse(fromText) as JsonMap;
        break;
      }
      case 'csv':
        parsedData = csvParse(fromText, { columns: true, skip_empty_lines: true }) as JsonArray;
        break;
      case 'ini':
        parsedData = ini.parse(fromText) as JsonMap;
        break;
    }
  } catch (_error) {
    return { result: '', error: t('dataFormatConversion.parseError') };
  }

  // Serialization
  try {
    switch (toType) {
      case 'json':
        return { result: JSON.stringify(parsedData, null, 2) };
      case 'yaml':
        return { result: yaml.stringify(parsedData) };
      case 'toml':
        if (typeof parsedData !== 'object' || parsedData === null || Array.isArray(parsedData)) {
          return { result: '', error: t('dataFormatConversion.invalidTomlData') };
        }
        return { result: toml.stringify(parsedData as JsonMap) };
      case 'xml':
        if (typeof parsedData !== 'object' || parsedData === null) {
          return { result: '', error: t('dataFormatConversion.invalidXmlData') };
        }
        return { result: new XMLBuilder({ ignoreAttributes: false, format: true }).build(parsedData as JsonMap) };
      case 'csv':
        if (!isCsvCompatible(parsedData)) {
          return { result: '', error: t('dataFormatConversion.invalidCsvData') };
        }
        return { result: csvStringify(parsedData, { header: true }) };
      case 'ini':
        if (!isIniCompatible(parsedData)) {
          return { result: '', error: t('dataFormatConversion.invalidIniData') };
        }
        return { result: ini.stringify(parsedData) };
    }
  } catch (_error) {
    return { result: '', error: t('dataFormatConversion.serializeError') };
  }
};
