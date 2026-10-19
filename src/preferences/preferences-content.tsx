'use client';

import { cn } from 'cn';
import { Check, MemoryStick, ShieldCheck } from 'lucide-react';

import { Heading } from '@/components/typography/heading';
import { Paragraph } from '@/components/typography/paragraph';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DATA_RETENTION_MODE } from '@/constants/common';
import { useT } from '@/i18n/utils';
import { useAppStore } from '@/store/store';

const CARD_RICH_TEXT_COMPONENTS = {
  ul: (chunk: React.ReactNode) => <ul className="flex flex-col gap-2 text-sm text-muted-foreground">{chunk}</ul>,
  li: (chunk: React.ReactNode) => (
    <li className="flex items-start gap-2">
      <span className="size-1.5 rounded-full shrink-0 mt-2 bg-muted-foreground" />
      <span className="leading-snug">{chunk}</span>
    </li>
  ),
  b: (chunk: React.ReactNode) => <strong className="text-foreground font-medium">{chunk}</strong>,
};

const CARD_BASE_CLASSES = 'p-5 gap-4 justify-between transition-all select-none text-left bg-secondary min-w-0 w-full';
const CARD_ACTIVE_CLASSES = 'border-primary ring-1 ring-primary/40 cursor-pointer';
const CARD_INACTIVE_CLASSES = 'border-border hover:border-foreground/30 cursor-pointer';

const RADIO_INDICATOR_BASE = 'size-4 rounded-full border flex items-center justify-center transition-all';
const RADIO_INDICATOR_ACTIVE = 'border-primary bg-primary text-primary-foreground';
const RADIO_INDICATOR_INACTIVE = 'border-muted-foreground/40';

export function PreferencesContent() {
  const { t, richT } = useT();
  const dataRetentionMode = useAppStore((state) => state.dataRetentionMode);
  const setDataRetentionMode = useAppStore((state) => state.setDataRetentionMode);

  return (
    <div className="flex flex-col gap-6 w-full mt-10">
      <div className="flex flex-col gap-1">
        <Heading level={2} className="text-2xl font-bold tracking-tight">
          {t('preferences.retention.title')}
        </Heading>
        <Paragraph className="text-sm text-muted-foreground">{t('preferences.retention.description')}</Paragraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Strict Privacy */}
        <Card
          role="radio"
          aria-checked={dataRetentionMode === DATA_RETENTION_MODE.STRICT}
          tabIndex={0}
          onClick={() => setDataRetentionMode(DATA_RETENTION_MODE.STRICT)}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              setDataRetentionMode(DATA_RETENTION_MODE.STRICT);
            }
          }}
          className={cn(
            CARD_BASE_CLASSES,
            dataRetentionMode === DATA_RETENTION_MODE.STRICT ? CARD_ACTIVE_CLASSES : CARD_INACTIVE_CLASSES
          )}
        >
          <CardHeader className="p-0 flex flex-col gap-3">
            <div className="flex w-full items-center justify-between">
              <ShieldCheck
                className={cn(
                  'size-5 transition-colors',
                  dataRetentionMode === DATA_RETENTION_MODE.STRICT ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <div
                className={cn(
                  RADIO_INDICATOR_BASE,
                  dataRetentionMode === DATA_RETENTION_MODE.STRICT ? RADIO_INDICATOR_ACTIVE : RADIO_INDICATOR_INACTIVE
                )}
              >
                {dataRetentionMode === DATA_RETENTION_MODE.STRICT && <Check className="size-2.5 stroke-[3]" />}
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-2">
              <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                {t('preferences.retention.strict.label')}
              </CardTitle>
              <span className="hidden lg:inline text-muted-foreground/60 select-none" aria-hidden="true">
                -
              </span>
              <CardDescription className="text-sm font-medium text-foreground/80">
                {t('preferences.retention.strict.summary')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {richT('preferences.retention.strict.description', CARD_RICH_TEXT_COMPONENTS)}
          </CardContent>
        </Card>

        {/* Card 2: Session Memory */}
        <Card
          role="radio"
          aria-checked={dataRetentionMode === DATA_RETENTION_MODE.SESSION}
          tabIndex={0}
          onClick={() => setDataRetentionMode(DATA_RETENTION_MODE.SESSION)}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              setDataRetentionMode(DATA_RETENTION_MODE.SESSION);
            }
          }}
          className={cn(
            CARD_BASE_CLASSES,
            dataRetentionMode === DATA_RETENTION_MODE.SESSION ? CARD_ACTIVE_CLASSES : CARD_INACTIVE_CLASSES
          )}
        >
          <CardHeader className="p-0 flex flex-col gap-3">
            <div className="flex w-full items-center justify-between">
              <MemoryStick
                className={cn(
                  'size-5 transition-colors',
                  dataRetentionMode === DATA_RETENTION_MODE.SESSION ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <div
                className={cn(
                  RADIO_INDICATOR_BASE,
                  dataRetentionMode === DATA_RETENTION_MODE.SESSION ? RADIO_INDICATOR_ACTIVE : RADIO_INDICATOR_INACTIVE
                )}
              >
                {dataRetentionMode === DATA_RETENTION_MODE.SESSION && <Check className="size-2.5 stroke-[3]" />}
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-2">
              <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                {t('preferences.retention.session.label')}
              </CardTitle>
              <span className="hidden lg:inline text-muted-foreground/60 select-none" aria-hidden="true">
                -
              </span>
              <CardDescription className="text-sm font-medium text-foreground/80">
                {t('preferences.retention.session.summary')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {richT('preferences.retention.session.description', CARD_RICH_TEXT_COMPONENTS)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
