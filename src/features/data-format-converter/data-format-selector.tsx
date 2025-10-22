import { Selector } from '@/components/app-converter/selector';
import { Button } from '@/components/common/button';
import { SEARCH_PARAM_KEYS, TOOLTIP_TYPE } from '@/constants/common';
import { GA_EVENTS } from '@/constants/gaEvents';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { useT } from '@/i18n/utils';

import { DATA_FORMATS, DataFormatType } from './utils';
interface Props {
  type: SEARCH_PARAM_KEYS;
  onMinify: () => void;
  onPrettyPrint: () => void;
}

export const DataFormatSelector = ({ type, onMinify, onPrettyPrint }: Props) => {
  const { t } = useT();

  // TODO: INI format lacks proper sample data and is stricter than other formats.
  //     * Evaluate feasibility of INI with other formats; or consider removing it.
  const options = Object.values(DATA_FORMATS).filter((f) => f.value !== 'ini');

  const [from] = useUrlSearchParams<DataFormatType>(SEARCH_PARAM_KEYS.FROM);
  const [to] = useUrlSearchParams<DataFormatType>(SEARCH_PARAM_KEYS.TO);

  const isTypeTo = type === SEARCH_PARAM_KEYS.TO;
  const showExtras = isTypeTo && (to === DATA_FORMATS.json.value || to === DATA_FORMATS.xml.value);

  const filteredOptions = options.map((o) => {
    const incompatible: string[] = isTypeTo && from ? [...DATA_FORMATS[from]?.incompatibleWith] : [];

    return {
      ...o,
      disabled: incompatible.includes(o.value),
      tooltip: incompatible.includes(o.value)
        ? { type: TOOLTIP_TYPE.error, messageKey: 'dataFormatConverter.incompatible' }
        : undefined,
    };
  });

  return (
    <Selector
      type={type}
      options={isTypeTo ? filteredOptions : options}
      renderExtra={() => {
        return (
          showExtras && (
            <div className="flex gap-3">
              <Button
                eventName={GA_EVENTS.MINIFY}
                type="button"
                variant="outline"
                onClick={onMinify}
                aria-label={t('label.minify')}
              >
                {t('label.minify')}
              </Button>
              <Button
                eventName={GA_EVENTS.PRETTY}
                type="button"
                variant="outline"
                onClick={onPrettyPrint}
                aria-label={t('label.prettyPrint')}
              >
                {t('label.prettyPrint')}
              </Button>
            </div>
          )
        );
      }}
    />
  );
};
