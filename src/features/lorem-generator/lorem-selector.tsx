'use client';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Selector } from '@/components/app-converter/selector';
import { Text } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import { useLoremGeneratorStore } from './lorem-generator-store';
import { LOREM, MAX_COUNT } from './utils';

interface Props {
  onGenerateNew: () => void;
}

export const LoremSelector = ({ onGenerateNew }: Props) => {
  const { t } = useT();
  const { count, setCount } = useLoremGeneratorStore();

  const handleSetCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!Number.isFinite(value) || value < 0) {
      toast.warning(t('loremGenerator.invalidCount'));
      return;
    }
    if (value > MAX_COUNT) {
      toast.warning(t('loremGenerator.countWarning', { maxCount: MAX_COUNT }));
      return;
    }
    setCount(value);
  };

  return (
    <Selector
      type={SEARCH_PARAM_KEYS.TYPE}
      options={Object.values(LOREM)}
      renderExtra={() => {
        return (
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex gap-2 items-center">
              <Text variant="large">{`${t('label.count').toUpperCase()}:`}</Text>
              <Input
                value={count ? count : ''}
                onChange={handleSetCount}
                className="w-32"
                placeholder={t('loremGenerator.countPlaceholder')}
              />
            </div>
            <Button onClick={onGenerateNew} className="group">
              <RefreshCw className="transition-all duration-150 group-active:rotate-180" />
              <Text variant="small">{t('label.generateNew')}</Text>
            </Button>
          </div>
        );
      }}
    />
  );
};
