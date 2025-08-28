import { useForm } from 'react-hook-form';

import { Selector } from '@/components/app-conversion/selector';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import { BASES, BaseType, CustomBaseFormValues, getCustomBaseValidationRules, validateCustomBase } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
  onCustomBaseChange?: (value: string) => void;
}

export const BaseSelector = ({ type, onCustomBaseChange }: Props) => {
  const t = useT();
  const [base] = useUrlSearchParams<BaseType>(type);

  const form = useForm<CustomBaseFormValues>({
    defaultValues: {
      customBase: '',
    },
    mode: 'onChange',
  });

  const handleCustomBaseChange = (value: string) => {
    if (onCustomBaseChange) {
      const validatedValue = validateCustomBase(value);
      onCustomBaseChange(validatedValue);
    }
  };

  return (
    <Selector
      type={type}
      options={Object.values(BASES)}
      renderExtra={() =>
        base === BASES.custom.value && (
          <Form {...form}>
            <FormField
              control={form.control}
              name="customBase"
              rules={getCustomBaseValidationRules(t)}
              render={({ field }) => (
                <FormItem className="flex-1 m-0 relative">
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      type="text"
                      maxLength={2}
                      placeholder={t('numberConversion.customPlaceholder')}
                      onChange={(e) => {
                        if (/^[0-9]*$/.test(e.target.value) && e.target.value.length <= 2) {
                          field.onChange(e);
                          handleCustomBaseChange(e.target.value);
                        }
                      }}
                      onBlur={() => {
                        form.trigger('customBase');
                      }}
                    />
                  </FormControl>
                  <FormMessage className="absolute text-sm right-0 m-2" />
                </FormItem>
              )}
            />
          </Form>
        )
      }
    />
  );
};
