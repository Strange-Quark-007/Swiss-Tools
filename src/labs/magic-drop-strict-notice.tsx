'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { usePreferencesStore } from '@/store/preferences-store';

interface Props {
  onDismiss: () => void;
}

export const MagicDropStrictNotice = ({ onDismiss }: Props) => {
  const { t, richT } = useT();
  const setLabsFlag = usePreferencesStore((state) => state.setLabsFlag);
  const setDataRetentionMode = usePreferencesStore((state) => state.setDataRetentionMode);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const enableMagicDrop = () => {
    if (dontShowAgain) {
      setLabsFlag('magicDropStrictNoticeOptOut', true);
    }

    setLabsFlag('magicDrop', true);
    toast.success(t('labs.magicDrop.toastEnabled'));
    onDismiss();
  };

  const handleUseSessionRetention = () => {
    setDataRetentionMode(DATA_RETENTION_MODE.SESSION);
    toast.success(t('preferences.retention.toast.sessionActivated'));
    enableMagicDrop();
  };

  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="max-w-sm sm:max-w-xl max-h-[calc(100svh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('labs.magicDrop.strictRetentionTitle')}</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="leading-relaxed">
            {richT('labs.magicDrop.strictRetentionDescription', { classNames: { p: 'mt-2 first:mt-0' } })}
          </div>
        </DialogDescription>
        <DialogFooter className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 justify-center">
            <Checkbox
              id="magic-drop-strict-notice-dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            />
            <label htmlFor="magic-drop-strict-notice-dont-show" className="text-sm whitespace-nowrap">
              {t('label.dontShowAgain')}
            </label>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row items-center sm:shrink-0">
            <Button variant="link" className="whitespace-nowrap" onClick={handleUseSessionRetention}>
              {t('labs.magicDrop.useSessionInstead')}
            </Button>
            <Button size="sm" className="max-w-fit" onClick={enableMagicDrop}>
              {t('label.ok')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
