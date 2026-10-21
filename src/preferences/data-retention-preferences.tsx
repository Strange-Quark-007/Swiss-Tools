'use client';

import { cn } from 'cn';
import { Check, MemoryStick, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/common/button';
import { Heading } from '@/components/typography/heading';
import { Paragraph } from '@/components/typography/paragraph';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DATA_RETENTION_MODE } from '@/constants/common';
import { useT } from '@/i18n/utils';
import { useAppStore } from '@/store/app-store';
import { resetAllRegisteredStores } from '@/store/store-registry';

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

const CARD_BASE_CLASSES =
  'p-5 gap-4 justify-between transition-all select-none text-left bg-secondary min-w-0 w-full shadow-md dark:shadow-secondary';
const CARD_ACTIVE_CLASSES = 'border-primary ring-1 ring-primary/40 cursor-pointer';
const CARD_INACTIVE_CLASSES = 'border-border hover:border-foreground/30 cursor-pointer';

const RADIO_INDICATOR_BASE = 'size-4 rounded-full border flex items-center justify-center transition-all';
const RADIO_INDICATOR_ACTIVE = 'border-primary bg-primary text-primary-foreground';
const RADIO_INDICATOR_INACTIVE = 'border-muted-foreground/40';

const RETENTION_GROUP_NAME = 'data-retention-mode';
const RETENTION_HEADING_ID = 'data-retention-heading';

export const DataRetentionPreferences = () => {
  const { t, richT } = useT();
  const { setDataRetentionMode } = useAppStore();

  // useSyncExternalStore resolves hydration mismatch
  // On server: returns null (neither card is baked as active in SSR HTML)
  // On client: returns actual persisted state from localStorage immediately
  const dataRetentionMode = useSyncExternalStore(
    useAppStore.subscribe,
    () => useAppStore.getState().dataRetentionMode,
    () => undefined
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSelectStrict = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmStrict = () => {
    setIsConfirmOpen(false);
    setDataRetentionMode(DATA_RETENTION_MODE.STRICT);
    resetAllRegisteredStores();
    toast.success(t('preferences.retention.toast.strictActivated'));
  };

  const handleSelectSession = () => {
    setDataRetentionMode(DATA_RETENTION_MODE.SESSION);
    toast.success(t('preferences.retention.toast.sessionActivated'));
  };

  const retentionCards = [
    {
      mode: DATA_RETENTION_MODE.STRICT,
      icon: ShieldCheck,
      labelKey: 'preferences.retention.strict.label',
      summaryKey: 'preferences.retention.strict.summary',
      descriptionKey: 'preferences.retention.strict.description',
      onSelect: handleSelectStrict,
    },
    {
      mode: DATA_RETENTION_MODE.SESSION,
      icon: MemoryStick,
      labelKey: 'preferences.retention.session.label',
      summaryKey: 'preferences.retention.session.summary',
      descriptionKey: 'preferences.retention.session.description',
      onSelect: handleSelectSession,
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full mt-10">
      <div className="flex flex-col gap-1">
        <Heading id={RETENTION_HEADING_ID} level={2} className="text-2xl font-bold tracking-tight">
          {t('preferences.retention.title')}
        </Heading>
        <Paragraph className="text-sm text-muted-foreground">{t('preferences.retention.description')}</Paragraph>
      </div>

      <div role="radiogroup" aria-labelledby={RETENTION_HEADING_ID} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {retentionCards.map(({ mode, icon: Icon, labelKey, summaryKey, descriptionKey, onSelect }) => {
          const isSelected = dataRetentionMode === mode;

          return (
            <Card
              key={mode}
              className={cn(
                CARD_BASE_CLASSES,
                isSelected ? CARD_ACTIVE_CLASSES : CARD_INACTIVE_CLASSES,
                'relative has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/60'
              )}
            >
              <input
                type="radio"
                name={RETENTION_GROUP_NAME}
                value={mode}
                checked={isSelected}
                onChange={onSelect}
                aria-label={`${t(labelKey)} - ${t(summaryKey)}`}
                className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
              />
              <CardHeader className="p-0 flex flex-col gap-3">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={cn('size-5 transition-colors', isSelected ? 'text-primary' : 'text-muted-foreground')}
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className={cn(RADIO_INDICATOR_BASE, isSelected ? RADIO_INDICATOR_ACTIVE : RADIO_INDICATOR_INACTIVE)}
                  >
                    {isSelected && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-2">
                  <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                    {t(labelKey)}
                  </CardTitle>
                  <span className="hidden lg:inline text-muted-foreground/60 select-none" aria-hidden="true">
                    -
                  </span>
                  <CardDescription className="text-sm font-medium text-foreground/80">{t(summaryKey)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">{richT(descriptionKey, CARD_RICH_TEXT_COMPONENTS)}</CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-xs sm:max-w-md bg-card border-border shadow-lg rounded-xl p-6 dark:shadow-secondary">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TriangleAlert className="size-5 text-amber-500 shrink-0" />
              {t('preferences.retention.toast.strictConfirmTitle')}
            </DialogTitle>
            <DialogDescription className="flex text-sm sm:text-base text-muted-foreground pt-1 text-left">
              {t('preferences.retention.toast.strictConfirmDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-4 pt-2">
            <Button disableTracking variant="outline" onClick={() => setIsConfirmOpen(false)}>
              {t('preferences.retention.toast.cancel')}
            </Button>
            <Button disableTracking variant="default" onClick={handleConfirmStrict}>
              {t('preferences.retention.toast.confirmClear')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
