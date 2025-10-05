import { nanoid } from 'nanoid';
import { ulid } from 'ulid';
import { v1 as uuidv1, v4 as uuidv4, v6 as uuidv6, v7 as uuidv7 } from 'uuid';

import { exhaustiveCheck } from '@/lib/utils';
import { ConverterResult, ValueUnion } from '@/types/common';

export const IDS = {
  uuidv1: { value: 'uuidv1', label: 'UUID v1' },
  uuidv4: { value: 'uuidv4', label: 'UUID v4' },
  uuidv6: { value: 'uuidv6', label: 'UUID v6' },
  uuidv7: { value: 'uuidv7', label: 'UUID v7' },
  nanoid: { value: 'nanoid', label: 'Nano ID' },
  ulid: { value: 'ulid', label: 'ULID' },
} as const;

export type IDType = ValueUnion<typeof IDS>;

export const MAX_COUNT = 1000;

export const generateIDs = async (type: IDType, count: number): Promise<ConverterResult> => {
  let ids: string[] = [];

  switch (type) {
    case IDS.uuidv1.value:
      ids = Array.from({ length: count }, () => uuidv1());
      break;

    case IDS.uuidv6.value:
      ids = Array.from({ length: count }, () => uuidv6());
      break;

    case IDS.uuidv4.value:
      ids = Array.from({ length: count }, () => uuidv4());
      break;

    case IDS.uuidv7.value:
      ids = Array.from({ length: count }, () => uuidv7());
      break;

    case IDS.nanoid.value:
      ids = Array.from({ length: count }, () => nanoid());
      break;

    case IDS.ulid.value:
      ids = Array.from({ length: count }, () => ulid());
      break;

    default:
      exhaustiveCheck(type);
  }
  return { result: ids.join('\n'), error: '' };
};
