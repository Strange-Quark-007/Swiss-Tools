'use client';

import debounce from 'lodash/debounce';
import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';

import { ConverterActions } from '@/components/app-converter/converter-actions';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { SplitView } from '@/components/content-layout/split-view';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';

import { RegexInput } from './regex-input';
import { RegexOutput } from './regex-output';
import { RegexPatternInput } from './regex-pattern-input';
import { useRegexTesterStore } from './regex-tester-store';
import { useRegexWorker } from './use-regex-worker';
import { buildFlagsString, MatchResult, REGEX_PRESETS, validateRegex } from './utils';

export const RegexTester = () => {
  const [urlPattern, setUrlPattern] = useUrlSearchParams(SEARCH_PARAM_KEYS.PATTERN);
  const {
    auto,
    pattern,
    flags,
    testText,
    selectedPreset,
    maxMatches,
    setAuto,
    setPattern,
    loadPreset,
    setToValue,
    setToError,
    reset,
  } = useRegexTesterStore();

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useUnmountEffect(reset);

  const syncFromUrl = useEffectEvent((url: string) => {
    const presetById = REGEX_PRESETS.find((p) => p.id === url);
    if (presetById) {
      if (selectedPreset === presetById.id) return;
      loadPreset(presetById.id, { populateSample: false });
      return;
    }
    if (url !== pattern) {
      setPattern(url);
    }
  });

  useEffect(() => {
    if (urlPattern) {
      syncFromUrl(urlPattern);
    }
  }, [urlPattern]);

  const syncToUrl = useEffectEvent(() => {
    const targetParam = selectedPreset || pattern;
    if (targetParam !== urlPattern) {
      setUrlPattern(targetParam);
    }
  });

  useEffect(() => {
    const debouncedSync = debounce(() => {
      syncToUrl();
    }, 300);

    debouncedSync();

    return () => {
      debouncedSync.cancel();
    };
  }, [selectedPreset, pattern]);

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isCapped, setIsCapped] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [evaluatedKey, setEvaluatedKey] = useState<string | null>(null);
  const callIdRef = useRef(0);
  const { runRegex } = useRegexWorker();

  const flagsString = useMemo(() => buildFlagsString(flags), [flags]);
  const validation = useMemo(() => validateRegex(pattern, flagsString), [pattern, flagsString]);

  const currentKey = `${pattern}:::${flagsString}:::${testText}:::${maxMatches}`;
  const hasEvaluated = evaluatedKey !== null && evaluatedKey === currentKey;

  const handleConvert = useCallback(async () => {
    const callId = ++callIdRef.current;

    if (!validation.isValid || !pattern || !testText) {
      setMatches([]);
      setIsCapped(false);
      setIsPending(false);
      setEvaluatedKey(null);
      setToValue('');
      setToError(undefined);
      return;
    }

    setIsPending(true);
    setToError(undefined);
    try {
      const result = await runRegex(pattern, flagsString, testText, maxMatches);
      if (!mountedRef.current || callId !== callIdRef.current) return;

      setMatches(result.matches);
      setIsCapped(Boolean(result.isCapped));
      const cleanMatches = result.matches.map((m) => m.match).join('\n');
      setToValue(cleanMatches);
      setToError(result.error);
      setEvaluatedKey(pattern && testText && !result.error ? currentKey : null);
    } finally {
      if (mountedRef.current && callId === callIdRef.current) {
        setIsPending(false);
      }
    }
  }, [validation.isValid, pattern, flagsString, testText, maxMatches, currentKey, setToValue, setToError, runRegex]);

  useDebouncedEffect({ auto }, handleConvert, [pattern, flagsString, testText, validation.isValid, maxMatches]);

  const handleReset = () => {
    reset();
    setMatches([]);
    setIsCapped(false);
    setIsPending(false);
    setEvaluatedKey(null);
  };

  return (
    <FlexContainer id="regex-tester" direction="col" className="h-full gap-4 flex-1 min-w-0">
      <RegexPatternInput isValid={validation.isValid} error={validation.error} />
      <SplitView
        className="flex-1 min-h-0"
        left={<RegexInput matches={matches} />}
        center={<ConverterActions auto={auto} setAuto={setAuto} onConvert={handleConvert} onReset={handleReset} />}
        right={
          <RegexOutput
            matches={matches}
            isValid={validation.isValid}
            error={validation.error}
            isCapped={isCapped}
            isPending={isPending}
            hasEvaluated={hasEvaluated}
          />
        }
      />
    </FlexContainer>
  );
};
