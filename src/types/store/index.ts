import { StoreApi } from 'zustand';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { CaseConverterState } from '@/features/case-converter/case-converter-store';
import { DataFormatConverterState } from '@/features/data-format-converter/data-format-converter-store';
import { EncoderDecoderState } from '@/features/encoder-decoder/encoder-decoder-store';
import { HashGeneratorState } from '@/features/hash-generator/hash-generator-store';
import { jwtDecoderState } from '@/features/jwt-decoder/jwt-decoder-store';
import { LoremGeneratorState } from '@/features/lorem-generator/lorem-generator-store';
import { NumberConverterState } from '@/features/number-converter/number-converter-store';

/**
 * Mapping of each route to its corresponding store state interface.
 */
export interface StoreStates {
  [ROUTES.HOME]: undefined;
  [ROUTES.DASHBOARD]: undefined;
  [ROUTES.NUMBER_CONVERTER]: NumberConverterState;
  [ROUTES.CASE_CONVERTER]: CaseConverterState;
  [ROUTES.DATA_FORMAT_CONVERTER]: DataFormatConverterState;
  [ROUTES.ENCODER_DECODER]: EncoderDecoderState;
  [ROUTES.HASH_GENERATOR]: HashGeneratorState;
  [ROUTES.JWT_DECODER]: jwtDecoderState;
  [ROUTES.LOREM_GENERATOR]: LoremGeneratorState;
}

/**
 * Extracts the keys of a store state that are valid queryable parameters.
 * Only keys that exist both in `T` and in `SEARCH_PARAM_KEYS` are allowed.
 *
 * @template T - The store state type
 */
export type QueryableKeys<T> = Extract<keyof T, `${SEARCH_PARAM_KEYS}`>;

/**
 * Represents a store entry in the registry.
 *
 * @template T - The state type of the store.
 */
export interface StoreEntry<T> {
  /** The Zustand store instance */
  store: StoreApi<T>;

  /** List of keys in the state that can be used as query parameters */
  params: QueryableKeys<T>[];
}

export type StoreRegistry = { [R in keyof StoreStates]: StoreEntry<StoreStates[R]> };
