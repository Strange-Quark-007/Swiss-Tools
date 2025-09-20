import { Selector } from '@/components/app-converter/selector';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { DATA_FORMATS, DataFormatType } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const DataFormatSelector = ({ type }: Props) => {
  // TODO: INI format lacks proper sample data and is stricter than other formats.
  //     * Evaluate feasibility of INI with other formats; or consider removing it.
  const options = Object.values(DATA_FORMATS).filter((f) => f.value !== 'ini');

  const [from] = useUrlSearchParams<DataFormatType>(SEARCH_PARAM_KEYS.FROM);

  const isTypeTo = type === SEARCH_PARAM_KEYS.TO;

  const filteredOptions = options.map((o) => {
    const incompatible: string[] = isTypeTo && from ? [...DATA_FORMATS[from]?.incompatibleWith] : [];

    return {
      ...o,
      disabled: incompatible.includes(o.value),
      warning: incompatible.includes(o.value) ? 'dataFormatConverter.incompatible' : '',
    };
  });

  return <Selector type={type} options={isTypeTo ? filteredOptions : options} />;
};
