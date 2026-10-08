import { useEffect, useRef } from 'react';
import { StoreApi } from 'zustand';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { useCaseConverterStore } from '@/features/case-converter/case-converter-store';
import { useColorPickerStore } from '@/features/color-picker/color-picker-store';
import { useDataFormatConverterStore } from '@/features/data-format-converter/data-format-converter-store';
import { useEncoderDecoderStore } from '@/features/encoder-decoder/encoder-decoder-store';
import { useHashGeneratorStore } from '@/features/hash-generator/hash-generator-store';
import { useIdGeneratorStore } from '@/features/id-generator/id-generator-store';
import { useJwtDecoderStore } from '@/features/jwt-decoder/jwt-decoder-store';
import { useLoremGeneratorStore } from '@/features/lorem-generator/lorem-generator-store';
import { useNumberConverterStore } from '@/features/number-converter/number-converter-store';
import { useAreaConverterStore } from '@/features/unit-converter/area/area-converter-store';
import { useDataSizeConverterStore } from '@/features/unit-converter/data-size/data-size-converter-store';
import { useLengthConverterStore } from '@/features/unit-converter/length/length-converter-store';
import { useSpeedConverterStore } from '@/features/unit-converter/speed/speed-converter-store';
import { useTemperatureConverterStore } from '@/features/unit-converter/temperature/temperature-converter-store';
import { useTimeConverterStore } from '@/features/unit-converter/time/time-converter-store';
import { useVolumeConverterStore } from '@/features/unit-converter/volume/volume-converter-store';
import { useWeightConverterStore } from '@/features/unit-converter/weight/weight-converter-store';
import { registerRouteStore } from '@/store/store-registry';
import { QueryableKeys, StoreStates } from '@/types/store';

// Helper to filter out routes that don't have a state defined (like Home/Dashboard)
type ValidRoutes = { [R in keyof StoreStates]: StoreStates[R] extends undefined ? never : R }[keyof StoreStates];

// Type that forces the config object to contain exactly the keys of all valid routes
type StoreConfig = {
  [R in ValidRoutes]: {
    store: StoreApi<StoreStates[R]>;
    params?: QueryableKeys<StoreStates[R]>[];
  };
};

/**
 * Config-driven mapping of routes to their respective stores and queryable parameters.
 *
 * This object is strictly typed against `StoreStates`.
 * If a new route is defined with a valid state,
 * it must be registered here to satisfy the compiler,
 * ensuring that no store registration is accidentally omitted.
 */
const STORE_CONFIG: StoreConfig = {
  [ROUTES.CASE_CONVERTER]: {
    store: useCaseConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
  [ROUTES.DATA_FORMAT_CONVERTER]: {
    store: useDataFormatConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
  [ROUTES.ENCODER_DECODER]: {
    store: useEncoderDecoderStore,
    params: [SEARCH_PARAM_KEYS.CODEC, SEARCH_PARAM_KEYS.MODE],
  },
  [ROUTES.HASH_GENERATOR]: {
    store: useHashGeneratorStore,
    params: [SEARCH_PARAM_KEYS.ALGO, SEARCH_PARAM_KEYS.ENCODING],
  },
  [ROUTES.NUMBER_CONVERTER]: {
    store: useNumberConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
  [ROUTES.JWT_DECODER]: {
    store: useJwtDecoderStore,
  },
  [ROUTES.LOREM_GENERATOR]: {
    store: useLoremGeneratorStore,
    params: [SEARCH_PARAM_KEYS.TYPE],
  },
  [ROUTES.ID_GENERATOR]: {
    store: useIdGeneratorStore,
    params: [SEARCH_PARAM_KEYS.TYPE],
  },
  [ROUTES.COLOR_PICKER]: {
    store: useColorPickerStore,
  },
  [ROUTES.LENGTH_CONVERTER]: {
    store: useLengthConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
  [ROUTES.AREA_CONVERTER]: {
    store: useAreaConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
  [ROUTES.VOLUME_CONVERTER]: {
    store: useVolumeConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
  [ROUTES.WEIGHT_CONVERTER]: {
    store: useWeightConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
  [ROUTES.TEMPERATURE_CONVERTER]: {
    store: useTemperatureConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
  [ROUTES.TIME_CONVERTER]: {
    store: useTimeConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
  [ROUTES.SPEED_CONVERTER]: {
    store: useSpeedConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
  [ROUTES.DATA_SIZE_CONVERTER]: {
    store: useDataSizeConverterStore,
    params: [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO],
  },
};

export const useRegisterStores = () => {
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (hasRegistered.current) {
      return;
    }

    Object.entries(STORE_CONFIG).forEach(([route, config]) => {
      // We must assert the route type because Object.entries widens keys to string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      registerRouteStore(route as ValidRoutes, config.store as StoreApi<any>, config.params as any);
    });

    hasRegistered.current = true;
  }, []);
};
