'use client';

import { cn } from 'cn';
import { Highlighter, Pencil } from 'lucide-react';
import { useMemo } from 'react';

import { PanelActions } from '@/components/app-converter/panel-actions';
import { BaseTextarea } from '@/components/common/base-textarea';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { customScrollbarCss } from '@/constants/common';
import { useViewScrollSync } from '@/hooks/use-view-scroll-sync';
import { useT } from '@/i18n/utils';

import { useRegexTesterStore } from './regex-tester-store';
import { highlightSegments, MatchResult, REGEX_PRESETS } from './utils';

const HIGHLIGHT_COLORS = ['bg-blue-500/30 dark:bg-blue-300/40', 'bg-amber-500/30 dark:bg-amber-300/40'] as const;

interface Props {
  matches: MatchResult[];
}

export const RegexInput = ({ matches }: Props) => {
  const { t } = useT();
  const { testText, setTestText, selectedPreset } = useRegexTesterStore();
  const {
    viewMode,
    switchViewMode,
    primaryRef: textareaRef,
    secondaryRef: highlightRef,
    onScroll,
    resetScroll,
  } = useViewScrollSync<'text' | 'highlight', HTMLTextAreaElement, HTMLDivElement>('text');

  const segments = useMemo(
    () => (viewMode === 'highlight' ? highlightSegments(testText, matches) : []),
    [viewMode, testText, matches]
  );

  const handleSample = () => {
    const activePreset = REGEX_PRESETS.find((p) => p.id === selectedPreset);
    setTestText(activePreset ? activePreset.sampleText : REGEX_PRESETS[0].sampleText);
    resetScroll();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(testText);
  };

  const handleClear = () => {
    setTestText('');
    switchViewMode('text');
    resetScroll();
  };

  return (
    <FlexContainer direction="col" className="flex-1 lg:h-full justify-start min-w-0 gap-2">
      <div className="flex justify-between items-center gap-2 shrink-0">
        <Text variant="large">{t('label.input').toUpperCase()}:</Text>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center rounded-md border border-input p-0.5 text-sm"
            role="tablist"
            aria-label={t('regexTester.viewModeTabs')}
          >
            <button
              type="button"
              role="tab"
              id="tab-text"
              aria-selected={viewMode === 'text'}
              aria-controls="panel-text"
              title={t('label.text')}
              onClick={() => switchViewMode('text')}
              className={cn(
                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                viewMode === 'text'
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Pencil className="h-3 w-3" aria-hidden="true" />
              <span>{t('label.text')}</span>
            </button>
            <button
              type="button"
              role="tab"
              id="tab-highlight"
              aria-selected={viewMode === 'highlight'}
              aria-controls="panel-highlight"
              title={t('label.highlight')}
              onClick={() => switchViewMode('highlight')}
              className={cn(
                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                viewMode === 'highlight'
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Highlighter className="h-3 w-3" aria-hidden="true" />
              <span>{t('label.highlight')}</span>
            </button>
          </div>
          <PanelActions value={testText} onSample={handleSample} onCopy={handleCopy} onClear={handleClear} />
        </div>
      </div>
      {viewMode === 'text' ? (
        <BaseTextarea
          ref={textareaRef}
          id="panel-text"
          role="tabpanel"
          aria-labelledby="tab-text"
          aria-label={t('label.input')}
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          onScroll={onScroll}
          className={cn(
            'font-sans text-sm md:text-sm leading-6 md:leading-6 h-[220px] sm:h-[260px] lg:h-full max-h-[32vh] lg:max-h-[69vh] break-words sm:break-words'
          )}
          placeholder={t('regexTester.testTextPlaceholder')}
        />
      ) : (
        <div
          ref={highlightRef}
          id="panel-highlight"
          role="tabpanel"
          aria-labelledby="tab-highlight"
          aria-label={t('label.highlight')}
          tabIndex={0}
          onScroll={onScroll}
          className={cn(
            'h-[220px] sm:h-[260px] lg:h-full max-h-[32vh] lg:max-h-[69vh] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm md:text-sm leading-6 md:leading-6 whitespace-pre-wrap break-words overflow-y-auto select-text cursor-default focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            customScrollbarCss
          )}
        >
          {segments.length > 0 ? (
            segments.map((segment, index) =>
              segment.isMatch ? (
                <mark
                  key={index}
                  className={cn(
                    'text-inherit rounded-xs px-0.5',
                    HIGHLIGHT_COLORS[((segment.matchIndex ?? 1) - 1) % HIGHLIGHT_COLORS.length]
                  )}
                  title={t('regexTester.matchIndex', { index: segment.matchIndex! })}
                >
                  {segment.text}
                </mark>
              ) : (
                <span key={index}>{segment.text}</span>
              )
            )
          ) : (
            <span className="text-muted-foreground select-none">{t('regexTester.testTextPlaceholder')}</span>
          )}
        </div>
      )}
    </FlexContainer>
  );
};
