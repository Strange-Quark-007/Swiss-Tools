'use client';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { PanelActions } from '@/components/app-converter/panel-actions';
import { BaseTextarea } from '@/components/common/base-textarea';
import { Text } from '@/components/typography/text';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';

import { useJwtDecoderStore } from './jwt-decoder-store';

export const JwtInput = () => {
  const t = useT();
  const { input, setInput } = useJwtDecoderStore();

  const handleSample = () => {
    setInput(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30'
    );
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <FlexContainer direction="col" className="h-full justify-between lg:justify-start min-w-0">
      <div className="flex justify-between items-center">
        <Text variant="large">{t('label.input').toUpperCase()}:</Text>
        <PanelActions onSample={handleSample} onClear={handleClear} />
      </div>
      <BaseTextarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={cn('h-full max-h-[35vh] lg:max-h-[75vh]')}
        placeholder={t('jwtDecoder.input.placeholder')}
      />
    </FlexContainer>
  );
};
