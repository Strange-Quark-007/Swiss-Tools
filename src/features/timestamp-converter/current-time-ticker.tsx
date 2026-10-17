'use client';

import { ArrowDownToLine, Check, Clock, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ButtonWithTooltip } from '@/components/common/button-with-tooltip';
import { Text } from '@/components/typography/text';
import { GA_EVENTS } from '@/constants/ga-events';
import { useT } from '@/i18n/utils';

import { formatTimestamp, TimestampFormatType } from './utils';

interface Props {
  fromFormat: TimestampFormatType;
  onUseNow: (value: string) => void;
}

export const CurrentTimeTicker = ({ fromFormat, onUseNow }: Props) => {
  const { t } = useT();
  const [currentEpoch, setCurrentEpoch] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [copied, setCopied] = useState(false);

  const CopyIcon = copied ? Check : Copy;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(currentEpoch));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleInsert = () => {
    const now = new Date();
    const formatted = formatTimestamp(now, fromFormat);
    onUseNow(formatted);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 px-3 py-2 sm:py-1.5 rounded-md border border-border/60 bg-muted/30 w-full sm:w-fit">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Text variant="small" className="text-muted-foreground text-xs whitespace-nowrap">
          {t('timestampConverter.currentEpoch')}:
        </Text>
        <Text variant="base" className="font-mono font-semibold text-sm tracking-wider">
          {currentEpoch}
        </Text>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <ButtonWithTooltip
          variant="outline"
          size="sm"
          className="h-7 px-2.5 gap-1 hover:cursor-pointer flex-1 sm:flex-none justify-center"
          eventName={GA_EVENTS.COPY_INPUT}
          ariaLabel={t('timestampConverter.copyEpoch')}
          tooltip={t('timestampConverter.copyEpoch')}
          onClick={handleCopy}
        >
          <CopyIcon className="h-3 w-3 shrink-0" />
          <span className="text-xs">{t('timestampConverter.copyEpoch')}</span>
        </ButtonWithTooltip>

        <ButtonWithTooltip
          variant="outline"
          size="sm"
          className="h-7 px-2.5 gap-1 hover:cursor-pointer flex-1 sm:flex-none justify-center"
          eventName={GA_EVENTS.SAMPLE}
          ariaLabel={t('timestampConverter.useCurrent')}
          tooltip={t('timestampConverter.useCurrent')}
          onClick={handleInsert}
        >
          <ArrowDownToLine className="h-3 w-3 shrink-0" />
          <span className="text-xs">{t('timestampConverter.useCurrent')}</span>
        </ButtonWithTooltip>
      </div>
    </div>
  );
};
