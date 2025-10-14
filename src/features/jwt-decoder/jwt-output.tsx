import { useEffect } from 'react';
import { toast } from 'sonner';

import { PanelActions } from '@/components/app-converter/panel-actions';
import { BaseTextarea } from '@/components/common/base-textarea';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';

import { useJwtDecoderStore } from './jwt-decoder-store';

export const JwtOutput = () => {
  const { t } = useT();
  const { header, payload, error } = useJwtDecoderStore();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCopyHeader = () => {
    if (header) {
      navigator.clipboard.writeText(header.trim());
    }
  };

  const handleCopyPayload = () => {
    if (payload) {
      navigator.clipboard.writeText(payload.trim());
    }
  };

  return (
    <FlexContainer direction="col" className="h-full lg:h-full justify-between lg:justify-start min-w-0">
      <div className="flex justify-between items-center">
        <Text variant="large">{t('label.header').toUpperCase()}:</Text>
        <PanelActions onCopy={handleCopyHeader} copyContext={t('label.header')} />
      </div>
      <BaseTextarea
        value={error ? ' ' : header}
        className={cn('h-full max-h-[15vh]')}
        readOnly
        error={!!error}
        placeholder={t('jwtDecoder.header.placeholder')}
      />
      <div className="flex justify-between items-center lg:pt-6">
        <Text variant="large">{t('label.payload').toUpperCase()}:</Text>
        <PanelActions onCopy={handleCopyPayload} copyContext={t('label.payload')} />
      </div>
      <BaseTextarea
        value={error ? ' ' : payload}
        className={cn('h-full max-h-[30vh] lg:max-h-[54vh]')}
        readOnly
        error={!!error}
        placeholder={t('jwtDecoder.payload.placeholder')}
      />
    </FlexContainer>
  );
};
