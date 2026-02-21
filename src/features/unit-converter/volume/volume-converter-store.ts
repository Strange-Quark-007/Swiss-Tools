import { ROUTES } from '@/constants/routes';
import { createBaseConverterStore, createRoutePersistedStore } from '@/store/store-factory';
import { BaseConverterState } from '@/types/base-state';

import { VolumeType } from './utils';

export type VolumeConverterState = BaseConverterState<VolumeType>;

const partializeSettings = (state: VolumeConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});

export const useVolumeConverterStore = createRoutePersistedStore<VolumeConverterState>(
  ROUTES.VOLUME_CONVERTER,
  createBaseConverterStore,
  partializeSettings
);
