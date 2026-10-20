'use client';

import { cn } from 'cn';

import { PanelActions } from '@/components/app-converter/panel-actions';
import { BaseSelect } from '@/components/common/base-select';
import { ButtonWithTooltip } from '@/components/common/button-with-tooltip';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { useT } from '@/i18n/utils';
import { Option } from '@/types/selector';

import { useRegexTesterStore } from './regex-tester-store';
import { buildFlagsString, REGEX_FLAGS, REGEX_PRESETS, ValidationResult } from './utils';

export const RegexPatternInput = ({ isValid }: ValidationResult) => {
  const { t } = useT();
  const [, setUrlPattern] = useUrlSearchParams(SEARCH_PARAM_KEYS.PATTERN);
  const {
    pattern,
    flags,
    selectedPreset,
    autoPopulateSample,
    setPattern,
    toggleFlag,
    loadPreset,
    setAutoPopulateSample,
  } = useRegexTesterStore();

  const flagsString = buildFlagsString(flags);
  const fullRegexString = `/${pattern}/${flagsString}`;

  const handleCopyRegex = () => {
    if (pattern) {
      navigator.clipboard.writeText(fullRegexString);
    }
  };

  const handleClear = () => {
    setPattern('');
    setUrlPattern('');
  };

  const matchingPreset = selectedPreset ? REGEX_PRESETS.find((p) => p.id === selectedPreset) : undefined;

  const selectValue = matchingPreset ? matchingPreset.id : pattern ? 'custom' : '';

  const presetOptions: Option<string>[] = [
    ...(selectValue === 'custom' ? [{ value: 'custom', label: t('label.custom'), disabled: true }] : []),
    ...REGEX_PRESETS.map((preset) => ({
      value: preset.id,
      label: preset.label,
      group: preset.group,
    })),
  ];

  return (
    <FlexContainer id="regex-pattern-container" direction="col" className="w-full shrink-0 gap-3">
      <div className="flex flex-wrap items-center gap-3 w-full min-w-0">
        <Text variant="large">{t('regexTester.pattern').toUpperCase()}:</Text>
        <div className="w-full sm:w-56 shrink-0">
          <BaseSelect
            value={selectValue}
            onValueChange={(val) => {
              if (val && val !== 'custom') {
                loadPreset(val);
              }
            }}
            options={presetOptions}
            placeholder={t('regexTester.presetsPlaceholder')}
            ariaLabel={t('regexTester.presetsPlaceholder')}
            triggerClassName="w-full h-9"
            contentPosition="popper"
          />
        </div>

        <div className="flex flex-1 items-center gap-3 min-w-[280px]">
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                'flex items-center gap-2 rounded-md border border-input bg-transparent dark:bg-input/30 px-3 h-9 w-full transition-colors',
                !isValid && pattern && 'border-destructive'
              )}
            >
              <span className="text-muted-foreground select-none" aria-hidden="true">
                /
              </span>
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder={t('regexTester.patternPlaceholder')}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
                aria-label={t('regexTester.expression')}
                aria-invalid={!isValid && !!pattern}
              />
              <span className="text-muted-foreground select-none" aria-hidden="true">
                /
              </span>
            </div>
          </div>

          <PanelActions
            supportsMagicDrop={false}
            onCopy={handleCopyRegex}
            onClear={handleClear}
            copyContext={t('regexTester.expression')}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <Checkbox
            id="auto-populate-sample-checkbox"
            checked={autoPopulateSample}
            onCheckedChange={(checked) => setAutoPopulateSample(!!checked)}
            className="cursor-pointer"
          />
          <Label
            htmlFor="auto-populate-sample-checkbox"
            className="text-sm text-muted-foreground cursor-pointer select-none font-normal"
          >
            {t('regexTester.autoPopulateSample')}
          </Label>
        </div>
        <div className="flex items-center gap-1.5" role="group" aria-label={t('regexTester.flags')}>
          {REGEX_FLAGS.map(({ key, char, label }) => {
            const active = flags[key];
            return (
              <ButtonWithTooltip
                key={key}
                disableTracking
                tooltip={`${char}: ${label}`}
                ariaLabel={`${char} (${label})`}
                aria-pressed={active}
                onClick={() => toggleFlag(key)}
                contentProps={{ side: 'top' }}
                variant={active ? 'default' : 'outline'}
                className={cn(
                  'size-7 rounded-md text-xs p-0 font-normal transition-colors',
                  active ? 'border-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {char}
              </ButtonWithTooltip>
            );
          })}
        </div>
      </div>
    </FlexContainer>
  );
};
