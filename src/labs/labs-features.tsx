'use client';

import { Sparkles } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';

import { Paragraph } from '@/components/typography/paragraph';
import { Text } from '@/components/typography/text';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DATA_RETENTION_MODE } from '@/constants/common';
import { useT } from '@/i18n/utils';
import { usePreferencesStore } from '@/store/preferences-store';

import { MagicDropStrictNotice } from './magic-drop-strict-notice';

export const LabsFeatures = () => {
  const { t, richT } = useT();
  const setLabsFlag = usePreferencesStore((state) => state.setLabsFlag);
  const magicDrop = useSyncExternalStore(
    usePreferencesStore.subscribe,
    () => usePreferencesStore.getState().labs.magicDrop,
    () => false
  );
  const [isStrictNoticeOpen, setIsStrictNoticeOpen] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (!checked) {
      setLabsFlag('magicDrop', false);
      toast.success(t('labs.magicDrop.toastDisabled'));
      return;
    }

    const { dataRetentionMode, labs } = usePreferencesStore.getState();

    if (dataRetentionMode === DATA_RETENTION_MODE.STRICT && !labs.magicDropStrictNoticeOptOut) {
      setIsStrictNoticeOpen(true);
      return;
    }

    setLabsFlag('magicDrop', true);
    toast.success(t('labs.magicDrop.toastEnabled'));
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-10">
      <Card className="p-5 flex-row items-center justify-between gap-6 bg-secondary shadow-sm dark:shadow-secondary rounded-xl border border-border">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary shrink-0" />
            <Text className="text-base font-semibold tracking-tight text-foreground">{t('labs.magicDrop.title')}</Text>
          </div>
          <Paragraph className="text-sm text-foreground/60 leading-normal text-balance">
            {richT('labs.magicDrop.description')}
          </Paragraph>
        </div>
        <Switch
          id="magic-drop-switch"
          checked={magicDrop}
          onCheckedChange={handleToggle}
          aria-label={t('labs.magicDrop.title')}
          className="shrink-0 cursor-pointer"
        />
      </Card>

      {isStrictNoticeOpen && <MagicDropStrictNotice onDismiss={() => setIsStrictNoticeOpen(false)} />}
    </div>
  );
};
