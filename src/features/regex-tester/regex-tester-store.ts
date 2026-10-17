import { ROUTES } from '@/constants/routes';
import { createAutoSlice } from '@/store/slices';
import { createRoutePersistedStore, StoreCreator } from '@/store/store-factory';
import { AutoState, Resettable } from '@/types/base-state';

import { DEFAULT_FLAGS, DEFAULT_MAX_MATCHES, REGEX_PRESETS, RegexFlags } from './utils';

export interface RegexTesterState extends AutoState, Resettable {
  pattern: string;
  flags: RegexFlags;
  testText: string;
  toValue: string;
  toError?: string;
  selectedPreset?: string;
  maxMatches: number;
  autoPopulateSample: boolean;

  setPattern: (pattern: string) => void;
  setFlags: (flags: Partial<RegexFlags>) => void;
  toggleFlag: (flag: keyof RegexFlags) => void;
  setTestText: (text: string) => void;
  setToValue: (value: string) => void;
  setToError: (error?: string) => void;
  setSelectedPreset: (presetId?: string) => void;
  setMaxMatches: (maxMatches: number) => void;
  setAutoPopulateSample: (autoPopulateSample: boolean) => void;
  loadPreset: (presetId: string, options?: { populateSample?: boolean }) => void;
  resetEphemeral: () => void;
}

export const regexTesterStore: StoreCreator<RegexTesterState> = (set, get) => ({
  ...createAutoSlice(set),
  pattern: '',
  flags: { ...DEFAULT_FLAGS },
  testText: '',
  toValue: '',
  toError: undefined,
  selectedPreset: undefined,
  maxMatches: DEFAULT_MAX_MATCHES,
  autoPopulateSample: true,

  setPattern: (pattern) => set({ pattern, selectedPreset: undefined }),
  setFlags: (flags) =>
    set((state) => {
      const newFlags = { ...state.flags, ...flags };
      if (flags.sticky) newFlags.global = false;
      if (flags.global) newFlags.sticky = false;
      return { flags: newFlags, selectedPreset: undefined };
    }),
  toggleFlag: (flag) =>
    set((state) => {
      const nextValue = !state.flags[flag];
      const newFlags = { ...state.flags, [flag]: nextValue };
      if (nextValue) {
        if (flag === 'sticky') newFlags.global = false;
        if (flag === 'global') newFlags.sticky = false;
      }
      return { flags: newFlags, selectedPreset: undefined };
    }),
  setTestText: (testText) => set({ testText }),
  setToValue: (toValue) => set({ toValue }),
  setToError: (toError) => set({ toError }),
  setSelectedPreset: (selectedPreset) => set({ selectedPreset }),
  setMaxMatches: (maxMatches) => set({ maxMatches }),
  setAutoPopulateSample: (autoPopulateSample) => set({ autoPopulateSample }),
  loadPreset: (presetId, options) => {
    const preset = REGEX_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const shouldPopulate = options?.populateSample ?? get().autoPopulateSample;
    set({
      selectedPreset: preset.id,
      pattern: preset.pattern,
      flags: { ...preset.flags },
      ...(shouldPopulate ? { testText: preset.sampleText } : {}),
    });
  },
  resetEphemeral: () =>
    set({
      testText: '',
      toValue: '',
      toError: undefined,
    }),
  reset: () =>
    set({
      pattern: '',
      flags: { ...DEFAULT_FLAGS },
      testText: '',
      toValue: '',
      toError: undefined,
      selectedPreset: undefined,
      maxMatches: DEFAULT_MAX_MATCHES,
      autoPopulateSample: true,
    }),
});

export const partializeSettings = (state: RegexTesterState) => ({
  auto: state.auto,
  autoPopulateSample: state.autoPopulateSample,
  flags: state.flags,
  pattern: state.pattern,
  selectedPreset: state.selectedPreset,
  maxMatches: state.maxMatches,
});

export const useRegexTesterStore = createRoutePersistedStore(ROUTES.REGEX_TESTER, regexTesterStore, partializeSettings);
