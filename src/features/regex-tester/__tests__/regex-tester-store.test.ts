import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { partializeSettings, useRegexTesterStore } from '../regex-tester-store';
import { DEFAULT_FLAGS, DEFAULT_MAX_MATCHES, REGEX_PRESETS } from '../utils';

describe('useRegexTesterStore', () => {
  beforeEach(() => {
    act(() => {
      useRegexTesterStore.setState({
        pattern: '',
        flags: { ...DEFAULT_FLAGS },
        replacement: '',
        testText: '',
        toValue: '',
        toError: undefined,
        selectedPreset: undefined,
        maxMatches: DEFAULT_MAX_MATCHES,
        auto: true,
      });
    });
  });

  it('should initialize with default empty pattern, default flags, auto true, and empty test text', () => {
    const state = useRegexTesterStore.getState();

    expect(state.pattern).toBe('');
    expect(state.flags).toEqual(DEFAULT_FLAGS);
    expect(state.replacement).toBe('');
    expect(state.testText).toBe('');
    expect(state.auto).toBe(true);
    expect(state.toValue).toBe('');
    expect(state.toError).toBeUndefined();
    expect(state.maxMatches).toBe(5000);
  });

  it('should update pattern when setPattern is called', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('[0-9]+');
    });

    expect(useRegexTesterStore.getState().pattern).toBe('[0-9]+');
  });

  it('should update flags when setFlags is called', () => {
    act(() => {
      useRegexTesterStore.getState().setFlags({ caseInsensitive: true });
    });

    expect(useRegexTesterStore.getState().flags).toEqual({
      ...DEFAULT_FLAGS,
      caseInsensitive: true,
    });
  });

  it('should toggle flag correctly when toggleFlag is called', () => {
    act(() => {
      useRegexTesterStore.getState().toggleFlag('caseInsensitive');
    });
    expect(useRegexTesterStore.getState().flags.caseInsensitive).toBe(true);

    act(() => {
      useRegexTesterStore.getState().toggleFlag('caseInsensitive');
    });
    expect(useRegexTesterStore.getState().flags.caseInsensitive).toBe(false);
  });

  it('should enforce mutual exclusion between global and sticky flags', () => {
    act(() => {
      useRegexTesterStore.getState().setFlags({ global: true, sticky: false });
    });
    expect(useRegexTesterStore.getState().flags.global).toBe(true);
    expect(useRegexTesterStore.getState().flags.sticky).toBe(false);

    // setFlags with sticky true should clear global
    act(() => {
      useRegexTesterStore.getState().setFlags({ sticky: true });
    });
    expect(useRegexTesterStore.getState().flags.sticky).toBe(true);
    expect(useRegexTesterStore.getState().flags.global).toBe(false);

    // setFlags with global true should clear sticky
    act(() => {
      useRegexTesterStore.getState().setFlags({ global: true });
    });
    expect(useRegexTesterStore.getState().flags.global).toBe(true);
    expect(useRegexTesterStore.getState().flags.sticky).toBe(false);

    // Toggling sticky ON should turn global OFF
    act(() => {
      useRegexTesterStore.getState().toggleFlag('sticky');
    });
    expect(useRegexTesterStore.getState().flags.sticky).toBe(true);
    expect(useRegexTesterStore.getState().flags.global).toBe(false);

    // Toggling global ON should turn sticky OFF
    act(() => {
      useRegexTesterStore.getState().toggleFlag('global');
    });
    expect(useRegexTesterStore.getState().flags.global).toBe(true);
    expect(useRegexTesterStore.getState().flags.sticky).toBe(false);
  });

  it('should load a preset without populating sample text by default', () => {
    const emailPreset = REGEX_PRESETS[0];

    act(() => {
      useRegexTesterStore.getState().loadPreset(emailPreset.id);
    });

    const state = useRegexTesterStore.getState();
    expect(state.pattern).toBe(emailPreset.pattern);
    expect(state.flags).toEqual(emailPreset.flags);
    expect(state.testText).toBe('');
    expect(state.selectedPreset).toBe(emailPreset.id);

    // Modifying flags should clear selectedPreset
    act(() => {
      useRegexTesterStore.getState().toggleFlag('caseInsensitive');
    });
    expect(useRegexTesterStore.getState().selectedPreset).toBeUndefined();

    act(() => {
      useRegexTesterStore.getState().loadPreset(emailPreset.id);
      useRegexTesterStore.getState().setFlags({ multiline: true });
    });
    expect(useRegexTesterStore.getState().selectedPreset).toBeUndefined();
  });

  it('should keep existing testText when loadPreset is called', () => {
    const emailPreset = REGEX_PRESETS[0];

    act(() => {
      useRegexTesterStore.getState().setTestText('existing user text');
      useRegexTesterStore.getState().loadPreset(emailPreset.id);
    });

    const state = useRegexTesterStore.getState();
    expect(state.pattern).toBe(emailPreset.pattern);
    expect(state.flags).toEqual(emailPreset.flags);
    expect(state.testText).toBe('existing user text');
    expect(state.selectedPreset).toBe(emailPreset.id);
  });

  it('should clear the replacement when a preset is loaded', () => {
    const emailPreset = REGEX_PRESETS[0];

    act(() => {
      useRegexTesterStore.getState().setReplacement('$1');
      useRegexTesterStore.getState().loadPreset(emailPreset.id);
    });

    expect(useRegexTesterStore.getState().replacement).toBe('');
  });

  it('should do nothing when loadPreset is called with an unknown preset id', () => {
    act(() => {
      useRegexTesterStore.getState().loadPreset('unknown-preset-id');
    });

    const state = useRegexTesterStore.getState();
    expect(state.pattern).toBe('');
    expect(state.selectedPreset).toBeUndefined();
  });

  it('should update testText, replacement, toValue, toError, and selectedPreset directly', () => {
    act(() => {
      useRegexTesterStore.getState().setTestText('sample text');
      useRegexTesterStore.getState().setReplacement('$1');
      useRegexTesterStore.getState().setToValue('result');
      useRegexTesterStore.getState().setToError('error occurred');
      useRegexTesterStore.getState().setSelectedPreset('email');
    });

    const state = useRegexTesterStore.getState();
    expect(state.testText).toBe('sample text');
    expect(state.replacement).toBe('$1');
    expect(state.toValue).toBe('result');
    expect(state.toError).toBe('error occurred');
    expect(state.selectedPreset).toBe('email');
  });

  it('should ingest external text into testText', () => {
    act(() => {
      useRegexTesterStore.getState().ingest('ingested sample text');
    });

    expect(useRegexTesterStore.getState().testText).toBe('ingested sample text');
  });

  it('should reset transient inputs and results when reset is called while preserving pattern and flags', () => {
    act(() => {
      useRegexTesterStore.getState().loadPreset('email');
      useRegexTesterStore.getState().setReplacement('$1');
      useRegexTesterStore.getState().reset();
    });

    const state = useRegexTesterStore.getState();
    expect(state.pattern).toBe(REGEX_PRESETS[0].pattern);
    expect(state.flags).toEqual(REGEX_PRESETS[0].flags);
    expect(state.replacement).toBe('');
    expect(state.testText).toBe('');
    expect(state.toValue).toBe('');
    expect(state.selectedPreset).toBe('email');
  });

  it('should update maxMatches when setMaxMatches is called', () => {
    act(() => {
      useRegexTesterStore.getState().setMaxMatches(1000);
    });

    expect(useRegexTesterStore.getState().maxMatches).toBe(1000);
  });

  describe('partializeSettings', () => {
    it('should persist auto, flags, pattern, selectedPreset, and maxMatches to localStorage', () => {
      act(() => {
        useRegexTesterStore.getState().loadPreset('email');
        useRegexTesterStore.getState().setReplacement('$1');
        useRegexTesterStore.getState().setMaxMatches(2500);
      });

      const state = useRegexTesterStore.getState();
      const partial = partializeSettings(state);

      expect(partial).toEqual({
        auto: true,
        flags: REGEX_PRESETS[0].flags,
        pattern: REGEX_PRESETS[0].pattern,
        selectedPreset: 'email',
        maxMatches: 2500,
      });
      expect((partial as Record<string, unknown>).testText).toBeUndefined();
      expect((partial as Record<string, unknown>).toValue).toBeUndefined();
    });
  });
});
