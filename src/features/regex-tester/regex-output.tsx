'use client';

import { cn } from 'cn';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

import { PanelActions } from '@/components/app-converter/panel-actions';
import { BaseTextarea } from '@/components/common/base-textarea';
import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { customScrollbarCss, MIME_TYPE } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { useT } from '@/i18n/utils';

import { useRegexTesterStore } from './regex-tester-store';
import { MatchResult } from './utils';

export interface Props {
  matches: MatchResult[];
  isValid?: boolean;
  error?: string;
  isCapped?: boolean;
  isPending?: boolean;
  hasEvaluated?: boolean;
}

export const RegexOutput = ({
  matches,
  isValid = true,
  error,
  isCapped = false,
  isPending = false,
  hasEvaluated = false,
}: Props) => {
  const { t } = useT();
  const downloadFile = useDownloadFile();
  const { pattern, testText, toError, maxMatches } = useRegexTesterStore();

  const isInvalid = !isValid && Boolean(pattern);
  const activeError = toError || (isInvalid ? error || t('regexTester.invalidPattern') : undefined);

  const hasEvaluatedEmpty = Boolean(
    hasEvaluated && !isPending && pattern && testText && isValid && !activeError && matches.length === 0
  );

  const handleCopyMatch = (matchText: string) => {
    navigator.clipboard.writeText(matchText);
    toast.success(t('regexTester.matchCopied'));
  };

  const handleCopy = () => {
    if (!isPending && !activeError && matches.length > 0) {
      const cleanText = matches.map((m) => m.match).join('\n');
      navigator.clipboard.writeText(cleanText);
    }
  };

  const handleDownload = () => {
    if (!isPending && !activeError && matches.length > 0) {
      const textToDownload = matches.map((m) => m.match).join('\n');
      downloadFile(textToDownload, ['regex', 'matches'], MIME_TYPE.TEXT);
    }
  };

  const showMatchesList = !activeError && matches.length > 0;
  const showBadge = (matches.length > 0 || hasEvaluatedEmpty) && !activeError;

  return (
    <FlexContainer direction="col" className="flex-1 lg:h-full justify-start min-w-0 gap-2">
      <div className="flex justify-between items-center gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <Text variant="large">{t('regexTester.resultsLabel').toUpperCase()}:</Text>
          {showBadge && (
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className={cn('transition-opacity duration-200', isPending && 'opacity-60')}>
                {isCapped
                  ? t('regexTester.matchCountCapped', { count: matches.length })
                  : t('regexTester.matchCount', { count: matches.length })}
              </Badge>
              {isCapped && (
                <TooltipWrapper
                  content={t('regexTester.matchesCappedHint', { max: maxMatches })}
                  contentProps={{ side: 'top', align: 'center' }}
                >
                  <span
                    tabIndex={0}
                    role="button"
                    aria-label={t('regexTester.matchesCappedHint', { max: maxMatches })}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    <Info className="size-3.5" />
                  </span>
                </TooltipWrapper>
              )}
            </div>
          )}
        </div>
        <PanelActions readOnly onCopy={handleCopy} onDownload={handleDownload} copyContext={t('label.result')} />
      </div>
      <div className="relative flex-1 lg:h-full min-h-0 w-full">
        {!showMatchesList ? (
          <BaseTextarea
            readOnly
            role={activeError ? 'alert' : undefined}
            error={!!activeError}
            value={activeError || ''}
            aria-label={t('regexTester.resultsLabel')}
            className={cn(
              'font-sans text-sm md:text-sm leading-6 md:leading-6 h-[220px] sm:h-[260px] lg:h-full max-h-[32vh] lg:max-h-[69vh]',
              activeError && 'border-destructive focus-visible:border-destructive text-destructive'
            )}
            placeholder={hasEvaluatedEmpty ? t('regexTester.noMatchesHint') : t('converter.resultPlaceholder')}
          />
        ) : (
          <div
            role="region"
            aria-label={t('regexTester.resultsLabel')}
            aria-live="polite"
            tabIndex={0}
            className={cn(
              'h-[220px] sm:h-[260px] lg:h-full max-h-[32vh] lg:max-h-[69vh] w-full overflow-y-auto divide-y divide-border rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 font-sans text-sm leading-6 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-opacity duration-200',
              isPending && 'opacity-60 pointer-events-none',
              customScrollbarCss
            )}
          >
            {matches.map((item, index) => (
              <div key={index} className="flex flex-col gap-1.5 py-2.5 first:pt-2 last:pb-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">
                    {t('regexTester.matchIndex', { index: index + 1 })}
                  </span>
                  <span className="text-muted-foreground font-sans">
                    {t('regexTester.indexRange', { start: item.index, end: item.end })}
                  </span>
                </div>
                <div className="font-sans text-sm leading-6 break-all">
                  <mark
                    tabIndex={0}
                    role="button"
                    aria-label={`${t('regexTester.matchIndex', { index: index + 1 })}: ${item.match}`}
                    onClick={() => handleCopyMatch(item.match)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCopyMatch(item.match);
                      }
                    }}
                    className="bg-primary/15 hover:bg-primary/25 active:bg-primary/30 cursor-pointer transition-colors text-inherit rounded-xs flex w-full px-1.5 py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {item.match}
                  </mark>
                </div>
              </div>
            ))}
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
    </FlexContainer>
  );
};
