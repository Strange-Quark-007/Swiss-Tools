import { ArrowRight, Repeat, RotateCw } from 'lucide-react';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { useT } from '@/i18n/utils';

import { ButtonWithTooltip } from '../common/button-with-tooltip';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

const buttonProps = { size: 'icon', contentProps: { side: 'top' } } as const;

interface Props {
  auto: boolean;
  setAuto: (value: boolean) => void;
  onConvert: () => void;
  onSwap?: () => void;
  onReset: () => void;
}

export const ConverterActions = ({ auto, setAuto, onConvert, onSwap, onReset }: Props) => {
  const t = useT();
  return (
    <FlexContainer
      direction="row"
      className="w-full lg:w-10 lg:mt-13 shadow-xs items-center justify-center gap-8 lg:flex-col"
    >
      <div className="flex lg:flex-col items-center justify-center gap-1.5">
        <Checkbox
          id="auto-checkbox"
          className="hover:cursor-pointer"
          checked={auto}
          onCheckedChange={(checked) => setAuto(!!checked)}
        />
        <Label htmlFor="auto-checkbox" className="text-sm cursor-pointer">
          {t('label.auto')}
        </Label>
      </div>
      <ButtonWithTooltip
        className="group text-white bg-blue-700 hover:bg-blue-500"
        tooltip={t('label.convert')}
        disabled={auto}
        onClick={onConvert}
        {...buttonProps}
      >
        <ArrowRight className="size-4 transition-transform duration-150 group-active:translate-x-1.5" />
      </ButtonWithTooltip>
      {onSwap && (
        <ButtonWithTooltip
          variant="outline"
          className="group"
          tooltip={t('label.swap')}
          onClick={onSwap}
          {...buttonProps}
        >
          <Repeat className="size-4 transition-transform duration-150 group-active:[transform:rotateY(180deg)]" />
        </ButtonWithTooltip>
      )}
      <ButtonWithTooltip
        variant="outline"
        className="group"
        tooltip={t('label.reset')}
        onClick={onReset}
        {...buttonProps}
      >
        <RotateCw className="size-4 text-destructive transition-transform duration-150 group-active:rotate-45" />
      </ButtonWithTooltip>
    </FlexContainer>
  );
};
