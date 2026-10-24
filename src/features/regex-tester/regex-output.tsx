'use client';

import { cn } from 'cn';
import { Replace, TriangleAlert } from 'lucide-react';
import { KeyboardEvent, useState } from 'react';
import { toast } from 'sonner';

import { PanelActions } from '@/components/app-converter/panel-actions';
import { BaseTextarea } from '@/components/common/base-textarea';
import { ButtonWithTooltip } from '@/components/common/button-with-tooltip';
import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { customScrollbarCss, MIME_TYPE } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useT } from '@/i18n/utils';

import { useRegexTesterStore } from './regex-tester-store';
import { formatMatchForDisplay, isWhitespaceOnlyMatch, MatchResult, ReplacementSegment } from './utils';

type ResultViewMode = 'matches' | 'replace';

const RESULT_TABS = [
  { id: 'matches', labelKey: 'regexTester.matchesTab' },
  { id: 'replace', labelKey: 'regexTester.replaceTab' },
] as const;

export interface Props {
  matches: MatchResult[];
  isValid?: boolean;
  error?: string;
  isCapped?: boolean;
  isPending?: boolean;
  hasEvaluated?: boolean;
  replacementSegments?: ReplacementSegment[];
}

const RESULT_AREA_HEIGHT_CLASSNAME = 'h-[220px] sm:h-[260px] lg:h-full max-h-[32vh] lg:max-h-[69vh]';

const RESULT_TEXTAREA_CLASSNAME = 'h-full font-sans text-sm md:text-sm leading-6 md:leading-6';

const RESULT_PANEL_CLASSNAME =
  'h-full w-full overflow-y-auto rounded-md border border-input bg-muted px-3 py-2 font-sans text-sm leading-6 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-opacity duration-200';

export const RegexOutput = ({
  matches,
  isValid = true,
  error,
  isCapped = false,
  isPending = false,
  hasEvaluated = false,
  replacementSegments = [],
}: Props) => {
  const { t } = useT();
  const downloadFile = useDownloadFile();
  const { pattern, testText, replacement, setReplacement, toError, toValue, maxMatches } = useRegexTesterStore();
  const [viewMode, setViewMode] = useState<ResultViewMode>('matches');
  const [hideWhitespaceMatches, setHideWhitespaceMatches] = useState(false);

  const isInvalid = !isValid && Boolean(pattern);
  const activeError = toError || (isInvalid ? error || t('regexTester.invalidPattern') : undefined);

  const hasEvaluatedEmpty = Boolean(
    hasEvaluated && !isPending && pattern && testText && isValid && !activeError && matches.length === 0
  );

  const indexedMatches = matches.map((item, index) => ({ item, index }));
  const whitespaceOnlyCount = matches.filter((item) => isWhitespaceOnlyMatch(item.match)).length;
  const visibleMatches = hideWhitespaceMatches
    ? indexedMatches.filter(({ item }) => !isWhitespaceOnlyMatch(item.match))
    : indexedMatches;
  const isReplaceMode = viewMode === 'replace';

  const handleCopyMatch = (matchText: string) => {
    navigator.clipboard.writeText(matchText);
    toast.success(t('regexTester.matchCopied'));
  };

  const actionValue = isReplaceMode ? toValue : visibleMatches.map(({ item }) => item.match).join('\n');
  const canAct = !isPending && !activeError && Boolean(actionValue.trim());

  const handleCopy = () => {
    if (canAct) {
      navigator.clipboard.writeText(actionValue);
    }
  };

  const handleDownload = () => {
    if (canAct) {
      downloadFile(actionValue, ['regex', isReplaceMode ? 'replaced' : 'matches'], MIME_TYPE.TEXT);
    }
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const isHorizontalArrow = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    if (!isHorizontalArrow && event.key !== 'Home' && event.key !== 'End') {
      return;
    }

    event.preventDefault();
    const nextMode: ResultViewMode =
      event.key === 'Home' ? 'matches' : event.key === 'End' ? 'replace' : isReplaceMode ? 'matches' : 'replace';

    setViewMode(nextMode);
    document.getElementById(`result-tab-${nextMode}`)?.focus();
  };

  const showMatchesList = !activeError && matches.length > 0;
  const showBadge = matches.length > 0 && !activeError;
  const emptyPlaceholder = hasEvaluatedEmpty ? t('regexTester.noMatchesHint') : t('converter.resultPlaceholder');
  const whitespaceToggleLabel = hideWhitespaceMatches
    ? t('label.showAll')
    : t('regexTester.hideWhitespaceMatches', { count: whitespaceOnlyCount });

  const cappedHint = t('regexTester.matchesCappedHint', { max: maxMatches });
  const matchCountText = isCapped
    ? t('regexTester.matchCountCapped', { count: matches.length })
    : t('regexTester.matchCount', { count: matches.length });

  const matchBadge = (
    <Badge
      variant="secondary"
      tabIndex={isCapped ? 0 : undefined}
      aria-label={isCapped ? `${matchCountText}. ${cappedHint}` : undefined}
      className={cn(
        'gap-1.5 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        isPending && 'opacity-60',
        isCapped && 'border-amber-500/40 bg-transparent text-amber-700 dark:text-amber-400'
      )}
    >
      {isCapped && <TriangleAlert aria-hidden="true" />}
      <span>{matchCountText}</span>
    </Badge>
  );

  return (
    <FlexContainer direction="col" className="flex-1 lg:h-full justify-start min-w-0 gap-2">
      <div className="flex flex-wrap justify-between items-center gap-2 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <Text variant="large">{t('regexTester.resultsLabel').toUpperCase()}:</Text>
          {showBadge && (
            <div className="flex items-center gap-1.5">
              {isCapped ? (
                <TooltipWrapper content={cappedHint} contentProps={{ side: 'top', align: 'center' }}>
                  {matchBadge}
                </TooltipWrapper>
              ) : (
                matchBadge
              )}
              {whitespaceOnlyCount > 0 && (
                <ButtonWithTooltip
                  disableTracking
                  variant="ghost"
                  size="xs"
                  ariaLabel={whitespaceToggleLabel}
                  aria-pressed={hideWhitespaceMatches}
                  tooltip={whitespaceToggleLabel}
                  disabled={isReplaceMode}
                  onClick={() => setHideWhitespaceMatches((hidden) => !hidden)}
                  className={cn(
                    'h-auto rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
                    hideWhitespaceMatches
                      ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      : 'border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {whitespaceToggleLabel}
                </ButtonWithTooltip>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div
            className="flex items-center rounded-md border border-input p-0.5 text-sm"
            role="tablist"
            aria-label={t('regexTester.resultViewTabs')}
          >
            {RESULT_TABS.map((tab) => {
              const isSelected = tab.id === viewMode;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`result-tab-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls="result-panel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setViewMode(tab.id)}
                  onKeyDown={handleTabKeyDown}
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    isSelected
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </div>
          <PanelActions
            readOnly
            value={actionValue}
            onCopy={handleCopy}
            onDownload={handleDownload}
            copyContext={isReplaceMode ? t('regexTester.replacedText') : t('label.result')}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col min-h-0">
        <div className={cn('flex w-full flex-col gap-2 min-h-0', RESULT_AREA_HEIGHT_CLASSNAME)}>
          {isReplaceMode && (
            <div className="flex h-9 w-full shrink-0 items-stretch overflow-hidden rounded-md border border-input transition-colors focus-within:ring-1 focus-within:ring-ring">
              <span
                className="flex select-none items-center border-r border-input bg-muted px-2.5 text-muted-foreground"
                aria-hidden="true"
              >
                <Replace className="size-3.5" />
              </span>
              <input
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder={t('regexTester.replacementPlaceholder')}
                className="min-w-0 flex-1 bg-background px-3 font-mono text-sm outline-none placeholder:text-muted-foreground dark:bg-input/30"
                aria-label={t('regexTester.replacement')}
              />
            </div>
          )}
          <div className="relative flex-1 min-h-0 w-full">
            {isReplaceMode ? (
              activeError ? (
                <div id="result-panel" role="alert" aria-labelledby="result-tab-replace" className="h-full">
                  <BaseTextarea
                    readOnly
                    error
                    value={activeError}
                    aria-label={t('regexTester.replacedText')}
                    className={cn(
                      RESULT_TEXTAREA_CLASSNAME,
                      'bg-muted dark:bg-muted border-destructive focus-visible:border-destructive text-destructive'
                    )}
                  />
                </div>
              ) : replacementSegments.length > 0 ? (
                <div
                  id="result-panel"
                  role="tabpanel"
                  aria-labelledby="result-tab-replace"
                  aria-label={t('regexTester.replacedText')}
                  aria-live="polite"
                  tabIndex={0}
                  className={cn(
                    RESULT_PANEL_CLASSNAME,
                    'whitespace-pre-wrap break-words',
                    isPending && 'opacity-60',
                    customScrollbarCss
                  )}
                >
                  {replacementSegments.map((segment, index) =>
                    segment.isReplacement ? (
                      segment.text ? (
                        <mark
                          key={index}
                          title={t('regexTester.replacementMatch', {
                            index: segment.matchIndex ?? index + 1,
                            text: segment.text,
                          })}
                          aria-label={t('regexTester.replacementMatch', {
                            index: segment.matchIndex ?? index + 1,
                            text: segment.text,
                          })}
                          className="bg-transparent text-inherit underline decoration-primary/60 decoration-2 underline-offset-2"
                        >
                          {segment.text}
                        </mark>
                      ) : null
                    ) : (
                      <span key={index}>{segment.text}</span>
                    )
                  )}
                </div>
              ) : (
                <div id="result-panel" role="tabpanel" aria-labelledby="result-tab-replace" className="h-full">
                  <BaseTextarea
                    readOnly
                    value={toValue}
                    aria-label={t('regexTester.replacedText')}
                    className={cn(RESULT_TEXTAREA_CLASSNAME, 'bg-muted dark:bg-muted')}
                    placeholder={t('regexTester.replacedTextPlaceholder')}
                  />
                </div>
              )
            ) : !showMatchesList ? (
              <div
                id="result-panel"
                role={activeError ? 'alert' : 'tabpanel'}
                aria-labelledby="result-tab-matches"
                className="h-full"
              >
                <BaseTextarea
                  readOnly
                  error={!!activeError}
                  value={activeError || ''}
                  aria-label={t('regexTester.resultsLabel')}
                  className={cn(
                    RESULT_TEXTAREA_CLASSNAME,
                    activeError && 'border-destructive focus-visible:border-destructive text-destructive'
                  )}
                  placeholder={emptyPlaceholder}
                />
              </div>
            ) : (
              <div
                id="result-panel"
                role="tabpanel"
                aria-label={t('regexTester.resultsLabel')}
                aria-labelledby="result-tab-matches"
                aria-live="polite"
                tabIndex={0}
                className={cn(
                  'h-full w-full overflow-y-auto divide-y divide-border rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 font-sans text-sm leading-6 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-opacity duration-200',
                  isPending && 'opacity-60 pointer-events-none',
                  customScrollbarCss
                )}
              >
                {visibleMatches.length === 0 ? (
                  <div className="py-2 text-muted-foreground">{t('label.noResults')}</div>
                ) : (
                  visibleMatches.map(({ item, index }) => {
                    const matchNumber = index + 1;
                    const displayText = isWhitespaceOnlyMatch(item.match)
                      ? formatMatchForDisplay(item.match)
                      : item.match;

                    return (
                      <div key={index} className="flex flex-col gap-1.5 py-2.5 first:pt-2 last:pb-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            {t('regexTester.matchIndex', { index: matchNumber })}
                          </span>
                          <span className="text-muted-foreground font-sans">
                            {t('regexTester.indexRange', { start: item.index, end: item.end })}
                          </span>
                        </div>
                        <div className="font-sans text-sm leading-6 break-all">
                          <mark
                            tabIndex={0}
                            role="button"
                            title={displayText}
                            aria-label={`${t('regexTester.matchIndex', { index: matchNumber })}: ${displayText}`}
                            onClick={() => handleCopyMatch(item.match)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleCopyMatch(item.match);
                              }
                            }}
                            className="bg-primary/15 hover:bg-primary/25 active:bg-primary/30 cursor-pointer transition-colors text-inherit rounded-xs flex w-full px-1.5 py-0.5 whitespace-pre-wrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            {displayText}
                          </mark>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
            {isPending && isValid && Boolean(pattern && testText) && (
              <div
                data-testid="regex-output-spinner"
                className="absolute inset-0 flex items-center justify-center bg-background/50 dark:bg-background/60 backdrop-blur-[1px] rounded-md z-10 transition-opacity duration-300 animate-in fade-in delay-200 fill-mode-backwards"
              >
                <Spinner className="size-6 text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </FlexContainer>
  );
};
