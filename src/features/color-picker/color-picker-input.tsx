import { formatCss, type Hsl } from 'culori';
import { Plus, Save, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/common/button';
import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { Text } from '@/components/typography/text';
import { Input } from '@/components/ui/input';
import {
  ColorPickerAlpha,
  ColorPickerHue,
  ColorPickerSelection,
  ColorPickerWidget,
} from '@/components/ui/shadcn-io/color-picker';
import { useT } from '@/i18n/utils';

import { MAX_SWATCHES, useColorPickerStore } from './color-picker-store';
import { formatColorInput, formatSwatch, parseColor } from './utils';

export const ColorPickerInput = () => {
  const { t } = useT();
  const { color, editingSwatch, swatches, setColor, saveSwatch, updateSwatch, setEditingSwatch, setSelectedSwatch } =
    useColorPickerStore();
  const [draft, setDraft] = useState<string | null>(null);

  const invalid = draft !== null && parseColor(draft) === undefined;
  const isMaxSwatches = swatches.length >= MAX_SWATCHES;
  const isSaveDisabled = !editingSwatch && isMaxSwatches;

  const handleChange = (value: string) => {
    setDraft(value);

    const parsed = parseColor(value);
    if (parsed) {
      setColor(parsed);
    }
  };

  const handleCanvasColorChange = (nextColor: Hsl) => {
    // The widget echoes its controlled value after a swatch selection; treat that as no change.
    const currentColor = useColorPickerStore.getState().color;
    if (formatSwatch(nextColor) === formatSwatch(currentColor)) {
      return;
    }
    setColor(nextColor);
  };

  const handlePickerPointerDown = () => {
    if (editingSwatch) {
      return;
    }
    setSelectedSwatch(null);
    // The canvas calls preventDefault, so the swatch button keeps focus and its tray stays visible.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleAction = () => {
    if (editingSwatch) {
      updateSwatch(editingSwatch, formatSwatch(color));
      setEditingSwatch(null);
    } else {
      saveSwatch(formatSwatch(color));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 h-9">
        <Text variant="large">{t('label.color').toUpperCase()}:</Text>
        <Input
          aria-invalid={invalid}
          aria-label={t('label.custom')}
          className="h-8 w-32 !bg-secondary px-2 font-mono text-xs shadow-none"
          spellCheck={false}
          value={draft ?? formatColorInput(color)}
          onBlur={() => setDraft(null)}
          onChange={(event) => handleChange(event.target.value)}
        />
        <TooltipWrapper
          content={
            isSaveDisabled
              ? t('colorPicker.maxSwatchesReached', { max: MAX_SWATCHES })
              : editingSwatch
                ? t('colorPicker.updateSwatch')
                : t('colorPicker.saveSwatch')
          }
        >
          <span className="inline-flex">
            <Button
              disableTracking
              disabled={isSaveDisabled}
              variant="outline"
              size="icon-sm"
              aria-label={editingSwatch ? t('colorPicker.updateSwatch') : t('colorPicker.saveSwatch')}
              onClick={handleAction}
            >
              {editingSwatch ? <Save className="size-4" /> : <Plus />}
            </Button>
          </span>
        </TooltipWrapper>
        {editingSwatch && (
          <TooltipWrapper content={t('colorPicker.cancelEdit')}>
            <Button
              disableTracking
              variant="ghost"
              size="icon-sm"
              aria-label={t('colorPicker.cancelEdit')}
              onClick={() => setEditingSwatch(null)}
            >
              <X className="size-4" />
            </Button>
          </TooltipWrapper>
        )}
      </div>
      <div className="size-72 lg:size-96">
        <ColorPickerWidget
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
          value={formatCss(color)}
          onColorChange={handleCanvasColorChange}
          onPointerDown={handlePickerPointerDown}
        >
          <ColorPickerSelection />
          <div className="flex items-center gap-4">
            <div className="grid w-full gap-1">
              <ColorPickerHue />
              <ColorPickerAlpha />
            </div>
          </div>
        </ColorPickerWidget>
      </div>
    </div>
  );
};
