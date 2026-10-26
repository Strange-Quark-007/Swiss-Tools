import { cn } from 'cn';
import { formatHex8, formatHsl, formatRgb } from 'culori/fn';

import { PanelActions } from '@/components/app-converter/panel-actions';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { Input } from '@/components/ui/input';
import { PercentageInput } from '@/components/ui/shadcn-io/color-picker';
import { useT } from '@/i18n/utils';

import { useColorPickerStore } from './color-picker-store';
import { convertColor, formatNum } from './utils';

interface ColorChannelsProps {
  alpha?: number;
  values: (number | undefined)[];
}

export const ColorChannels = ({ alpha, values }: ColorChannelsProps) => (
  <div className="flex w-full items-center">
    {values.map((v, i) => (
      <Input
        key={i}
        readOnly
        type="text"
        value={formatNum(v)}
        className={cn('h-8 !bg-secondary px-2 text-xs shadow-none rounded-r-none', i > 0 && 'rounded-l-none')}
      />
    ))}
    <PercentageInput value={Math.round((alpha ?? 0) * 100)} className="!bg-secondary rounded-l-none w-16" />
  </div>
);

export const ColorPickerOutput = () => {
  const { t } = useT();
  const { color } = useColorPickerStore();
  const { hsl, oklch, rgb } = convertColor(color);

  const hex = formatHex8(rgb);
  const argb = `#${hex.slice(7)}${hex.slice(1, 7)}`;
  const oklchStr = `oklch(${formatNum(oklch.l)} ${formatNum(oklch.c)} ${formatNum(oklch.h)} / ${formatNum(oklch.alpha ?? 1)})`;

  const outputs = [
    { label: t('label.hex'), value: hex },
    {
      alpha: rgb.alpha,
      channels: [rgb.r, rgb.g, rgb.b].map((v) => Math.round(v * 255)),
      label: t('label.rgba'),
      value: formatRgb(rgb),
    },
    {
      alpha: hsl.alpha,
      channels: [hsl.h, hsl.s * 100, hsl.l * 100],
      label: t('label.hsl'),
      value: formatHsl(hsl),
    },
    {
      alpha: oklch.alpha,
      channels: [oklch.l, oklch.c, oklch.h],
      label: t('label.oklch'),
      value: oklchStr,
    },
    { label: t('label.argb'), value: argb },
  ];

  return (
    <FlexContainer direction="col" className="justify-between lg:justify-start min-w-0 max-w-3xs w-full shrink-0">
      {outputs.map(({ alpha, channels, label, value }) => (
        <div key={label} className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Text variant="large">{label.toUpperCase()}:</Text>
            <PanelActions
              readOnly
              value={value}
              onCopy={() => navigator.clipboard.writeText(value)}
              copyContext={label}
            />
          </div>
          {channels ? (
            <ColorChannels alpha={alpha} values={channels} />
          ) : (
            <Input className="h-8 !bg-secondary px-2 text-xs shadow-none" readOnly type="text" value={value} />
          )}
        </div>
      ))}
    </FlexContainer>
  );
};
