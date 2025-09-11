import ini from 'ini';
import { XMLValidator, XMLParser, XMLBuilder } from 'fast-xml-parser';
import { parse as csvParse, stringify as csvStringify } from 'csv/sync';
import { parse as yamlParse, stringify as yamlStringify } from 'yaml';
import { parse as tomlParse, stringify as tomlStringify, JsonMap, JsonArray } from '@iarna/toml';

import { TranslationFunction } from '@/i18n/utils';
import { exhaustiveCheck } from '@/lib/utils';
import { ConverterResult } from '@/types/common';
import { MIME_TYPE } from '@/constants/common';

export type DataFormatType = (typeof DATA_FORMATS)[keyof typeof DATA_FORMATS]['value'];

type JsonValue = string | number | boolean | null | JsonMap | JsonArray;

const xmlParser = new XMLParser({ ignoreAttributes: false, parseAttributeValue: true, ignoreDeclaration: true });

export const DATA_FORMATS = {
  json: { value: 'json', label: 'JSON', mimeType: MIME_TYPE.JSON },
  yaml: { value: 'yaml', label: 'YAML', mimeType: MIME_TYPE.YAML },
  toml: { value: 'toml', label: 'TOML', mimeType: MIME_TYPE.TOML },
  xml: { value: 'xml', label: 'XML', mimeType: MIME_TYPE.XML },
  csv: { value: 'csv', label: 'CSV', mimeType: MIME_TYPE.CSV },
  ini: { value: 'ini', label: 'INI', mimeType: MIME_TYPE.TEXT },
} as const;

// Helper to check CSV-compatible structure
const isCsvCompatible = (data: unknown): data is JsonArray =>
  Array.isArray(data) && data.every((item) => typeof item === 'object' && !Array.isArray(item) && item !== null);

// Helper to check INI-compatible structure
const isIniCompatible = (data: unknown): data is JsonMap =>
  typeof data === 'object' &&
  data !== null &&
  !Array.isArray(data) &&
  Object.values(data).every((v) => typeof v !== 'object' || v === null);

export const getDownloadFileMetadata = (to: DataFormatType) => {
  return { fileName: `output.${DATA_FORMATS[to].value}`, mimeType: DATA_FORMATS[to].mimeType };
};

export const convertDataFormat = (
  fromText: string,
  fromType: DataFormatType,
  toType: DataFormatType,
  t: TranslationFunction
): ConverterResult => {
  if (!fromText.trim()) {
    return { result: '' };
  }

  let parsedData: JsonValue = '';

  try {
    switch (fromType) {
      case DATA_FORMATS.json.value:
        parsedData = JSON.parse(fromText) as JsonValue;
        break;

      case DATA_FORMATS.yaml.value:
        parsedData = yamlParse(fromText) as JsonValue;
        break;

      case DATA_FORMATS.toml.value:
        parsedData = tomlParse(fromText) as JsonMap;
        break;

      case DATA_FORMATS.xml.value:
        const validation = XMLValidator.validate(fromText);
        if (validation !== true) {
          throw new Error(validation.err.msg);
        }
        parsedData = xmlParser.parse(fromText) as JsonMap;
        break;

      case DATA_FORMATS.csv.value:
        parsedData = csvParse(fromText, { columns: true, skip_empty_lines: true }) as JsonArray;
        break;

      case DATA_FORMATS.ini.value:
        parsedData = ini.parse(fromText) as JsonMap;
        break;

      default:
        exhaustiveCheck(fromType);
    }
  } catch (error) {
    const message = error instanceof Error && error.message;
    return { result: '', error: message || t('dataFormatConverter.parseError') };
  }

  try {
    switch (toType) {
      case DATA_FORMATS.json.value:
        return { result: JSON.stringify(parsedData, null, 2) };

      case DATA_FORMATS.yaml.value:
        return { result: yamlStringify(parsedData) };

      case DATA_FORMATS.toml.value:
        if (typeof parsedData !== 'object' || parsedData === null || Array.isArray(parsedData)) {
          return { result: '', error: t('dataFormatConverter.invalidTomlData') };
        }
        return { result: tomlStringify(parsedData as JsonMap) };

      case DATA_FORMATS.xml.value:
        if (typeof parsedData !== 'object' || parsedData === null) {
          return { result: '', error: t('dataFormatConverter.invalidXmlData') };
        }
        let wrapped: JsonValue;

        const keys = Object.keys(parsedData);
        // If the object already has exactly one top-level key, treat it as root
        if (keys.length === 1) {
          wrapped = parsedData;
        } else {
          // enforce single root
          wrapped = { root: parsedData };
        }
        return { result: new XMLBuilder({ ignoreAttributes: false, format: true }).build(wrapped as JsonMap) };

      case DATA_FORMATS.csv.value:
        if (!isCsvCompatible(parsedData)) {
          return { result: '', error: t('dataFormatConverter.invalidCsvData') };
        }
        return { result: csvStringify(parsedData, { header: true }) };

      case DATA_FORMATS.ini.value:
        if (!isIniCompatible(parsedData)) {
          return { result: '', error: t('dataFormatConverter.invalidIniData') };
        }
        return { result: ini.stringify(parsedData) };

      default:
        exhaustiveCheck(toType);
    }
  } catch (error) {
    const message = error instanceof Error && error.message;
    return { result: '', error: message || t('dataFormatConverter.serializeError') };
  }
  return { result: '' };
};
