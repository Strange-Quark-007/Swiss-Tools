'use client';

import { Sparkles } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { toast } from 'sonner';

import { Paragraph } from '@/components/typography/paragraph';
import { Text } from '@/components/typography/text';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useT } from '@/i18n/utils';
import { useAppStore } from '@/store/store';

export const LabsFeatures = () => {
  const { t } = useT();
  const { setMagicDrop } = useAppStore();

  const magicDrop = useSyncExternalStore(
    useAppStore.subscribe,
    () => useAppStore.getState().magicDrop,
    () => false
  );

  const handleToggle = (checked: boolean) => {
    setMagicDrop(checked);
    toast.success(t(checked ? 'labs.magicDrop.toastEnabled' : 'labs.magicDrop.toastDisabled'));
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
            {t('labs.magicDrop.description')}
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
    </div>
  );
};
