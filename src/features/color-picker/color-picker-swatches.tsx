import { cn } from 'cn';
import { Check, Copy, Palette, Pencil, Save, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/common/button';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { useT } from '@/i18n/utils';

import { MAX_SWATCHES, useColorPickerStore } from './color-picker-store';
import { formatColorInput, formatSwatch, parseColor } from './utils';

export interface SwatchProps {
  swatch: string;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (swatch: string) => void;
  onEdit: (swatch: string) => void;
  onSave: (oldSwatch: string, newSwatch: string) => void;
  onCancelEdit: () => void;
  onRemove: (swatch: string) => void;
}

export const Swatch = ({
  swatch,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onSave,
  onCancelEdit,
  onRemove,
}: SwatchProps) => {
  const { t } = useT();
  const color = useColorPickerStore((state) => state.color);
  const setColor = useColorPickerStore((state) => state.setColor);
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const parsed = parseColor(swatch);
  const hexCode = parsed ? formatColorInput(parsed) : swatch;

  const handleSave = () => {
    const storeColor = useColorPickerStore.getState().color;
    const finalColor = draft ? (parseColor(draft) ?? storeColor) : storeColor;
    onSave(swatch, formatSwatch(finalColor));
    setDraft(null);
  };

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(hexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleChangeDraft = (value: string) => {
    setDraft(value);
    const parsedDraft = parseColor(value);
    if (parsedDraft) {
      setColor(parsedDraft);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setDraft(null);
      onCancelEdit();
    }
  };

  const handleCardBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (isEditing && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
      if (draft && !parseColor(draft)) {
        setDraft(null);
        onCancelEdit();
      } else {
        handleSave();
      }
    }
  };

  return (
    <div
      onBlur={handleCardBlur}
      className={cn(
        'group relative w-full h-28 sm:h-32 rounded-md border bg-card shadow-xs overflow-hidden select-none',
        'transition-colors duration-150',
        isEditing
          ? 'border-primary ring-1 ring-primary'
          : isSelected
            ? 'border-primary ring-1 ring-primary/40'
            : 'border-border hover:border-foreground/40'
      )}
    >
      <button
        type="button"
        aria-label={swatch}
        title={hexCode}
        onClick={() => onSelect(swatch)}
        className="absolute inset-0 size-full outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        <div
          className="size-full"
          style={{
            backgroundImage: `linear-gradient(${swatch}, ${swatch}), repeating-conic-gradient(#ccc 0% 25%, #eee 0% 50%)`,
            backgroundSize: '12px 12px',
          }}
        />
      </button>

      {!isEditing && (
        <Button
          disableTracking
          variant="secondary"
          size="icon-xs"
          className={cn(
            'absolute top-2 left-2 z-20 size-6 rounded-full p-0 flex items-center justify-center',
            'bg-background/85 hover:bg-muted text-foreground backdrop-blur-xs',
            'border border-border/50 shadow-xs',
            'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
            'transition-opacity duration-150 cursor-pointer'
          )}
          aria-label={t('aria.copyContext', { context: hexCode })}
          title={copied ? t('label.copy') : t('aria.copyContext', { context: hexCode })}
          onClick={handleCopy}
        >
          {copied ? <Check className="size-3 shrink-0 text-emerald-500" /> : <Copy className="size-3 shrink-0" />}
        </Button>
      )}

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 w-full px-1.5 py-1 shadow-xs',
          'flex items-center justify-between gap-1',
          'transition-transform duration-200 ease-out',
          isEditing
            ? 'translate-y-0 bg-primary text-primary-foreground border-t border-primary/40'
            : isSelected
              ? 'translate-y-0 bg-background/90 dark:bg-card/90 backdrop-blur-xs border-t border-border/50 text-foreground'
              : 'translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 bg-background/90 dark:bg-card/90 backdrop-blur-xs border-t border-border/50 text-foreground'
        )}
      >
        {isEditing ? (
          <div className="flex w-full items-center justify-between gap-1">
            <input
              type="text"
              spellCheck={false}
              aria-label={`${t('colorPicker.editSwatch')}: ${swatch}`}
              value={draft ?? formatColorInput(color)}
              onChange={(event) => handleChangeDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              onClick={(event) => event.stopPropagation()}
              className={cn(
                'flex-1 min-w-0 bg-background/25 text-primary-foreground placeholder:text-primary-foreground/50',
                'px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold tracking-wider outline-none',
                'border border-primary-foreground/30 focus:border-primary-foreground/70 focus:bg-background/30'
              )}
            />
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                aria-label={t('colorPicker.saveSwatch')}
                title={t('colorPicker.saveSwatch')}
                onClick={(event) => {
                  event.stopPropagation();
                  handleSave();
                }}
                className="p-1 cursor-pointer rounded transition-colors text-primary-foreground/90 hover:text-primary-foreground hover:bg-background/20"
              >
                <Save className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label={t('colorPicker.cancelEdit')}
                title={t('colorPicker.cancelEdit')}
                onClick={(event) => {
                  event.stopPropagation();
                  setDraft(null);
                  onCancelEdit();
                }}
                className="p-1 cursor-pointer rounded transition-colors text-primary-foreground/90 hover:text-primary-foreground hover:bg-background/20"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-1">
            <span className="font-mono text-[11px] font-semibold tracking-wider text-foreground">{hexCode}</span>
            <button
              type="button"
              aria-label={`${t('colorPicker.editSwatch')}: ${swatch}`}
              title={t('colorPicker.editSwatch')}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(swatch);
              }}
              className="p-1 cursor-pointer rounded transition-colors text-muted-foreground hover:text-foreground"
            >
              <Pencil className="size-3" />
            </button>
          </div>
        )}
      </div>

      {!isEditing && (
        <Button
          disableTracking
          variant="secondary"
          size="icon-xs"
          className={cn(
            'absolute top-2 right-2 z-20 size-6 rounded-full p-0 flex items-center justify-center',
            'bg-background/85 hover:bg-destructive hover:text-destructive-foreground backdrop-blur-xs',
            'border border-border/50 shadow-xs',
            'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
            'transition-opacity duration-150 cursor-pointer'
          )}
          aria-label={`${t('colorPicker.removeSwatch')}: ${swatch}`}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(swatch);
          }}
        >
          <X className="size-3 shrink-0 stroke-[2.5]" />
        </Button>
      )}
    </div>
  );
};

export const ColorPickerSwatches = () => {
  const { t } = useT();
  const {
    swatches,
    editingSwatch,
    selectedSwatch,
    setColor,
    removeSwatch,
    clearSwatches,
    updateSwatch,
    setEditingSwatch,
    setSelectedSwatch,
  } = useColorPickerStore();

  const handleSelect = (swatch: string) => {
    const parsed = parseColor(swatch);
    if (parsed) {
      setColor(parsed);
    }
    setSelectedSwatch(swatch);
  };

  const handleEdit = (swatch: string) => {
    setEditingSwatch(swatch);
    setSelectedSwatch(swatch);
    const parsed = parseColor(swatch);
    if (parsed) {
      setColor(parsed);
    }
  };

  const handleSave = (oldSwatch: string, newSwatch: string) => {
    updateSwatch(oldSwatch, newSwatch);
    setEditingSwatch(null);
  };

  const handleCancelEdit = () => {
    setEditingSwatch(null);
  };

  return (
    <FlexContainer direction="col" className="gap-2 flex-1 md:min-w-sm shrink-0">
      <div className="flex items-center gap-3 h-9">
        <Text variant="large">{t('colorPicker.swatches').toUpperCase()}:</Text>
        {swatches.length > 0 && (
          <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs font-medium text-muted-foreground">
            {swatches.length} / {MAX_SWATCHES}
          </span>
        )}
        {swatches.length > 0 && (
          <Button disableTracking variant="ghost" size="xs" onClick={clearSwatches}>
            {t('label.clearAll')}
          </Button>
        )}
      </div>

      {swatches.length === 0 ? (
        <div className="flex items-center gap-3 w-sm rounded-xl border border-dashed border-border/80 bg-secondary/20 p-5 text-sm text-muted-foreground">
          <Palette className="size-5 shrink-0 text-muted-foreground/70" />
          <span>{t('colorPicker.emptySwatches')}</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
          {swatches.map((swatch) => {
            const isEditing = editingSwatch === swatch;
            const isSelected = selectedSwatch === swatch;

            return (
              <Swatch
                key={swatch}
                swatch={swatch}
                isSelected={isSelected}
                isEditing={isEditing}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancelEdit={handleCancelEdit}
                onRemove={removeSwatch}
              />
            );
          })}
        </div>
      )}
    </FlexContainer>
  );
};
