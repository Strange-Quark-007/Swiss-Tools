import { useEffect, useRef } from 'react';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { useCaseConverterStore } from '@/features/case-converter/case-converter-store';
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

export const useRegisterStores = () => {
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (hasRegistered.current) {
      return;
    }

    registerRouteStore(ROUTES.CASE_CONVERTER, useCaseConverterStore, [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO]);
    registerRouteStore(ROUTES.DATA_FORMAT_CONVERTER, useDataFormatConverterStore, [
      SEARCH_PARAM_KEYS.FROM,
      SEARCH_PARAM_KEYS.TO,
    ]);
    registerRouteStore(ROUTES.ENCODER_DECODER, useEncoderDecoderStore, [
      SEARCH_PARAM_KEYS.CODEC,
      SEARCH_PARAM_KEYS.MODE,
    ]);
    registerRouteStore(ROUTES.HASH_GENERATOR, useHashGeneratorStore, [
      SEARCH_PARAM_KEYS.ALGO,
      SEARCH_PARAM_KEYS.ENCODING,
    ]);
    registerRouteStore(ROUTES.NUMBER_CONVERTER, useNumberConverterStore, [
      SEARCH_PARAM_KEYS.FROM,
      SEARCH_PARAM_KEYS.TO,
    ]);
    registerRouteStore(ROUTES.JWT_DECODER, useJwtDecoderStore);
    registerRouteStore(ROUTES.LOREM_GENERATOR, useLoremGeneratorStore, [SEARCH_PARAM_KEYS.TYPE]);
    registerRouteStore(ROUTES.ID_GENERATOR, useIdGeneratorStore, [SEARCH_PARAM_KEYS.TYPE]);
    registerRouteStore(ROUTES.LENGTH_CONVERTER, useLengthConverterStore, [
      SEARCH_PARAM_KEYS.FROM,
      SEARCH_PARAM_KEYS.TO,
    ]);
    registerRouteStore(ROUTES.AREA_CONVERTER, useAreaConverterStore, [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO]);
    registerRouteStore(ROUTES.VOLUME_CONVERTER, useVolumeConverterStore, [
      SEARCH_PARAM_KEYS.FROM,
      SEARCH_PARAM_KEYS.TO,
    ]);
    registerRouteStore(ROUTES.WEIGHT_CONVERTER, useWeightConverterStore, [
      SEARCH_PARAM_KEYS.FROM,
      SEARCH_PARAM_KEYS.TO,
    ]);
    registerRouteStore(ROUTES.TEMPERATURE_CONVERTER, useTemperatureConverterStore, [
      SEARCH_PARAM_KEYS.FROM,
      SEARCH_PARAM_KEYS.TO,
    ]);
    registerRouteStore(ROUTES.TIME_CONVERTER, useTimeConverterStore, [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO]);
    registerRouteStore(ROUTES.SPEED_CONVERTER, useSpeedConverterStore, [SEARCH_PARAM_KEYS.FROM, SEARCH_PARAM_KEYS.TO]);
    registerRouteStore(ROUTES.DATA_SIZE_CONVERTER, useDataSizeConverterStore, [
      SEARCH_PARAM_KEYS.FROM,
      SEARCH_PARAM_KEYS.TO,
    ]);

    hasRegistered.current = true;
  }, []);
};
