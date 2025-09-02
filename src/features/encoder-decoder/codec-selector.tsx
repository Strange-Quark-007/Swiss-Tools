import React from 'react';

import { Selector } from '@/components/app-conversion/selector';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { Text } from '@/components/typography/text';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import { CODECS, MODES } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const CodecSelector = ({ type }: Props) => {
  const t = useT();
  const [mode, setMode] = useUrlSearchParams(SEARCH_PARAM_KEYS.MODE);

  const handleChange = (checked: boolean) => {
    setMode(checked ? MODES.encode.value : MODES.decode.value);
  };

  return (
    <Selector
      type={type}
      options={Object.values(CODECS)}
      renderExtra={() => (
        <div className="flex gap-4 items-center">
          <Text>{t('label.mode')}:</Text>
          <Switch
            id="mode-switch"
            className="scale-125"
            checked={mode === MODES.encode.value}
            onCheckedChange={handleChange}
          />
          <Label htmlFor="mode-switch">{mode.toUpperCase()}</Label>
        </div>
      )}
    />
  );
};
