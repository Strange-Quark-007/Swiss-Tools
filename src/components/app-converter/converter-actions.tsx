import { CheckedState } from '@radix-ui/react-checkbox';
import { ArrowRight, Repeat, RotateCw } from 'lucide-react';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { GA_EVENTS } from '@/constants/gaEvents';
import { useTrackEvent } from '@/hooks/use-ga-events';
import { useT } from '@/i18n/utils';

import { ButtonWithTooltip } from '../common/button-with-tooltip';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const buttonProps = { size: 'icon', contentProps: { side: 'top' } } as const;

interface Props {
  auto: boolean;
  disableSwap?: boolean;
  setAuto: (value: boolean) => void;
  onConvert: () => void;
  onSwap?: () => void;
  onReset: () => void;
}

export const ConverterActions = ({ auto, disableSwap, setAuto, onConvert, onSwap, onReset }: Props) => {
  const { t } = useT();
  const trackEvent = useTrackEvent();

  const handleCheckedChange = (checked: CheckedState) => {
    setAuto(!!checked);
    trackEvent(checked ? GA_EVENTS.AUTO_UNCHECK : GA_EVENTS.AUTO_CHECK);
  };

  return (
    <FlexContainer
      direction="row"
      id="converter-actions"
      className="w-full lg:w-10 lg:mt-13 items-center justify-center gap-8 lg:flex-col min-h-fit"
    >
      <div className="flex lg:flex-col items-center justify-center gap-1.5">
        <Checkbox
          id="auto-checkbox"
          className="hover:cursor-pointer"
          checked={auto}
          onCheckedChange={handleCheckedChange}
        />
        <Label htmlFor="auto-checkbox" className="text-sm cursor-pointer">
          {t('label.auto')}
        </Label>
      </div>
      <ButtonWithTooltip
        eventName={GA_EVENTS.CONVERT}
        type="submit"
        className="group text-white bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
        disabled={auto}
        tooltip={t('label.convert')}
        ariaLabel={t('label.convert')}
        onClick={onConvert}
        {...buttonProps}
      >
        <ArrowRight className="size-4 transition-transform duration-150 group-active:translate-x-1.5" />
      </ButtonWithTooltip>
      {onSwap && (
        <ButtonWithTooltip
          eventName={GA_EVENTS.SWAP}
          variant="outline"
          className="group"
          disabled={disableSwap}
          tooltip={t('label.swap')}
          ariaLabel={t('label.swap')}
          onClick={onSwap}
          {...buttonProps}
        >
          <Repeat className="size-4 transition-transform duration-150 group-active:[transform:rotateY(180deg)]" />
        </ButtonWithTooltip>
      )}
      <ButtonWithTooltip
        eventName={GA_EVENTS.RESET}
        type="reset"
        variant="outline"
        className="group"
        tooltip={t('label.reset')}
        ariaLabel={t('label.reset')}
        onClick={onReset}
        {...buttonProps}
      >
        <RotateCw className="size-4 text-destructive transition-transform duration-150 group-active:rotate-45" />
      </ButtonWithTooltip>
    </FlexContainer>
  );
};
