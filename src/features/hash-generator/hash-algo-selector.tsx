import { Text } from '@/components/typography/text';
import { Selector } from '@/components/app-converter/selector';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import { HASH_ENCODINGS, HASHING_ALGOS } from './util';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

const HashAlgoSelector = ({ type }: Props) => {
  const t = useT();
  const [encoding, setEncoding] = useUrlSearchParams(SEARCH_PARAM_KEYS.ENCODING);
  return (
    <Selector
      type={type}
      options={Object.values(HASHING_ALGOS)}
      renderExtra={() => (
        <div className="flex gap-4">
          <Text>{t('label.encoding').toUpperCase()}:</Text>
          <RadioGroup value={encoding} onValueChange={setEncoding} className="flex gap-6">
            {Object.values(HASH_ENCODINGS).map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`encoding-${opt.value}`} className="cursor-pointer" />
                <Label htmlFor={`encoding-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    />
  );
};

export default HashAlgoSelector;
