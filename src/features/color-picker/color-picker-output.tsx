import { formatHex, formatHex8, formatHsl, formatRgb, Hsl, Oklch, Rgb } from 'culori/fn';

import { PanelActions } from '@/components/app-converter/panel-actions';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { Input } from '@/components/ui/input';
import { PercentageInput } from '@/components/ui/shadcn-io/color-picker';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';

import { useColorPickerStore } from './color-picker-store';
import { convertColor, formatNum } from './utils';

export const ColorPickerOutput = () => {
  const { color } = useColorPickerStore();
  const converted = convertColor(color);

  return (
    <FlexContainer direction="col" className="justify-between lg:justify-start min-w-0 max-w-sm">
      <HexOutput color={converted.rgb} />
      <RgbaOutput color={converted.rgb} />
      <HslOutput color={converted.hsl} />
      <OklchOutput color={converted.oklch} />
      <ArgbOutput color={converted.rgb} />
    </FlexContainer>
  );
};

const HexOutput = ({ color }: { color: Rgb }) => {
  const { t } = useT();
  const hex = formatHex(color);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Text variant="large">{t('label.hex').toUpperCase()}:</Text>
        <PanelActions onCopy={() => navigator.clipboard.writeText(hex)} />
      </div>
      <div className={cn('-space-x-px relative flex w-full items-center')}>
        <Input className="h-8 !bg-secondary px-2 text-xs shadow-none" readOnly type="text" value={hex} />
      </div>
    </div>
  );
};

const RgbaOutput = ({ color }: { color: Rgb }) => {
  const { t } = useT();
  const { r, g, b, alpha } = color;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Text variant="large">{t('label.rgba').toUpperCase()}:</Text>
        <PanelActions onCopy={() => navigator.clipboard.writeText(formatRgb(color))} />
      </div>
      <div className={cn('-space-x-px relative flex w-full items-center')}>
        {[r, g, b].map((v, i) => (
          <Input
            key={i}
            className={cn(
              'h-8 !bg-secondary px-2 text-xs shadow-none',
              i > 0 && 'rounded-l-none',
              i <= 2 && 'rounded-r-none'
            )}
            readOnly
            type="text"
            value={formatNum(Math.round(v * 255))}
          />
        ))}
        <PercentageInput value={(alpha ?? 0) * 100} className="!bg-secondary rounded-l-none" />
      </div>
    </div>
  );
};

const HslOutput = ({ color }: { color: Hsl }) => {
  const { t } = useT();
  const { h, s, l, alpha } = color;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Text variant="large">{t('label.hsl').toUpperCase()}:</Text>
        <PanelActions onCopy={() => navigator.clipboard.writeText(formatHsl(color))} />
      </div>
      <div className={cn('-space-x-px relative flex w-full items-center')}>
        {[h, s * 100, l * 100].map((v, i) => (
          <Input
            key={i}
            className={cn(
              'h-8 !bg-secondary px-2 text-xs shadow-none',
              i > 0 && 'rounded-l-none',
              i <= 2 && 'rounded-r-none'
            )}
            readOnly
            type="text"
            value={formatNum(v)}
          />
        ))}
        <PercentageInput value={(alpha ?? 0) * 100} className="!bg-secondary rounded-l-none" />
      </div>
    </div>
  );
};

const OklchOutput = ({ color }: { color: Oklch }) => {
  const { t } = useT();
  const { l, c, h, alpha } = color;

  const serializeOklch = () => {
    const L = formatNum(l ?? 0);
    const C = formatNum(c ?? 0);
    const H = h !== null ? formatNum(h) : 0;
    const A = alpha ?? 1;
    return `oklch(${L} ${C} ${H} / ${formatNum(A)})`;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Text variant="large">{t('label.oklch').toUpperCase()}:</Text>
        <PanelActions onCopy={() => navigator.clipboard.writeText(serializeOklch())} />
      </div>
      <div className={cn('-space-x-px relative flex w-full items-center')}>
        {[l, c, h].map((v, i) => (
          <Input
            key={i}
            className={cn(
              'h-8 !bg-secondary px-2 text-xs shadow-none',
              i > 0 && 'rounded-l-none',
              i <= 2 && 'rounded-r-none'
            )}
            readOnly
            type="text"
            value={formatNum(v)}
          />
        ))}
        <PercentageInput value={(alpha ?? 0) * 100} className="!bg-secondary rounded-l-none" />
      </div>
    </div>
  );
};

const ArgbOutput = ({ color }: { color: Rgb }) => {
  const { t } = useT();

  const hex8 = formatHex8(color);
  const argb = `#${hex8.slice(7)}${hex8.slice(1, 7)}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Text variant="large">{t('label.argb').toUpperCase()}:</Text>
        <PanelActions onCopy={() => navigator.clipboard.writeText(argb)} />
      </div>
      <div className={cn('-space-x-px relative flex w-full items-center')}>
        <Input className="h-8 !bg-secondary px-2 text-xs shadow-none" readOnly type="text" value={argb} />
      </div>
    </div>
  );
};
