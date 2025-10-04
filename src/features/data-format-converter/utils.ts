import { JsonMap, JsonArray } from '@iarna/toml';

import { MIME_TYPE } from '@/constants/common';
import { TranslationFunction } from '@/i18n/utils';
import { exhaustiveCheck } from '@/lib/utils';
import { ConverterResult, ValueUnion } from '@/types/common';

export type DataFormatType = ValueUnion<typeof DATA_FORMATS>;

type JsonValue = string | number | boolean | null | JsonMap | JsonArray;

export const DATA_FORMATS = {
  json: { value: 'json', label: 'JSON', mimeType: MIME_TYPE.JSON, incompatibleWith: [] },
  yaml: { value: 'yaml', label: 'YAML', mimeType: MIME_TYPE.YAML, incompatibleWith: [] },
  toml: { value: 'toml', label: 'TOML', mimeType: MIME_TYPE.TOML, incompatibleWith: ['csv', 'ini'] },
  xml: { value: 'xml', label: 'XML', mimeType: MIME_TYPE.XML, incompatibleWith: ['csv', 'ini'] },
  csv: { value: 'csv', label: 'CSV', mimeType: MIME_TYPE.CSV, incompatibleWith: [] },
  ini: { value: 'ini', label: 'INI', mimeType: MIME_TYPE.TEXT, incompatibleWith: [] },
} as const;

export enum FORMAT_MODES {
  minify = 'minify',
  pretty = 'pretty',
}

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

export const convertDataFormat = async (
  fromText: string,
  fromType: DataFormatType,
  toType: DataFormatType,
  formatMode: FORMAT_MODES,
  t: TranslationFunction
): Promise<ConverterResult> => {
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
        const { parse: yamlParse } = await import('yaml');
        parsedData = yamlParse(fromText) as JsonValue;
        break;

      case DATA_FORMATS.toml.value:
        const { parse: tomlParse } = await import('@iarna/toml');
        parsedData = tomlParse(fromText) as JsonMap;
        break;

      case DATA_FORMATS.xml.value:
        const { XMLParser, XMLValidator } = await import('fast-xml-parser');
        const validation = XMLValidator.validate(fromText);

        if (validation !== true) {
          throw new Error(validation.err.msg);
        }

        const xmlParser = new XMLParser({
          ignoreAttributes: false,
          parseAttributeValue: true,
          ignoreDeclaration: true,
        });

        parsedData = xmlParser.parse(fromText) as JsonMap;
        break;

      case DATA_FORMATS.csv.value:
        const { parse: csvParse } = await import('csv/sync');
        parsedData = csvParse(fromText, { columns: true, skip_empty_lines: true }) as JsonArray;
        break;

      case DATA_FORMATS.ini.value:
        const { parse: iniParse } = await import('ini');
        parsedData = iniParse(fromText) as JsonMap;
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
        const formattedResult =
          formatMode === FORMAT_MODES.pretty ? JSON.stringify(parsedData, null, 2) : JSON.stringify(parsedData);
        return { result: formattedResult };

      case DATA_FORMATS.yaml.value:
        const { stringify: yamlStringify } = await import('yaml');
        return { result: yamlStringify(parsedData) };

      case DATA_FORMATS.toml.value:
        const { stringify: tomlStringify } = await import('@iarna/toml');
        if (typeof parsedData !== 'object' || parsedData === null) {
          return { result: '', error: t('dataFormatConverter.invalidTomlData') };
        }
        if (Array.isArray(parsedData)) {
          return { result: tomlStringify({ root: parsedData } as JsonMap) };
        }
        return { result: tomlStringify(parsedData as JsonMap) };

      case DATA_FORMATS.xml.value:
        const { XMLBuilder } = await import('fast-xml-parser');
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
        return {
          result: new XMLBuilder({ ignoreAttributes: false, format: formatMode === FORMAT_MODES.pretty }).build(
            wrapped as JsonMap
          ),
        };

      case DATA_FORMATS.csv.value:
        const { stringify: csvStringify } = await import('csv/sync');
        if (!isCsvCompatible(parsedData)) {
          return { result: '', error: t('dataFormatConverter.invalidCsvData') };
        }
        return { result: csvStringify(parsedData, { header: true }) };

      case DATA_FORMATS.ini.value:
        const { stringify: iniStringify } = await import('ini');
        if (!isIniCompatible(parsedData)) {
          return { result: '', error: t('dataFormatConverter.invalidIniData') };
        }
        return { result: iniStringify(parsedData) };

      default:
        exhaustiveCheck(toType);
    }
  } catch (error) {
    const message = error instanceof Error && error.message;
    return { result: '', error: message || t('dataFormatConverter.serializeError') };
  }
  return { result: '' };
};
