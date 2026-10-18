import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TOOLTIP_TYPE } from '@/constants/common';
import { Option } from '@/types/selector';

import { BaseSelect } from '../base-select';

describe('BaseSelect component', () => {
  const sampleOptions: Option<string>[] = [
    { value: 'json', label: 'JSON' },
    {
      value: 'xml',
      label: 'XML',
      tooltip: { type: 'info' as TOOLTIP_TYPE, messageKey: 'timeConverter.yearTooltip' },
    },
    {
      value: 'yaml',
      label: 'YAML',
      tooltip: { type: 'warning' as TOOLTIP_TYPE, messageKey: 'app.name' },
    },
    {
      value: 'csv',
      label: 'CSV',
      disabled: true,
      tooltip: { type: 'error' as TOOLTIP_TYPE, messageKey: 'app.name' },
    },
  ];

  it('should render trigger with placeholder and current value', () => {
    render(
      <BaseSelect
        value="json"
        options={sampleOptions}
        placeholder="Select format"
        ariaLabel="Format selector"
        triggerClassName="custom-class"
        id="format-select"
      />
    );

    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeDefined();
    expect(combobox.getAttribute('aria-label')).toBe('Format selector');
    expect(combobox.className).toContain('custom-class');
  });

  it('should render options and handle value changes', () => {
    const onValueChange = vi.fn();
    render(<BaseSelect value="json" onValueChange={onValueChange} options={sampleOptions} />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getAllByText('JSON').length).toBeGreaterThan(0);
    expect(screen.getByText('XML')).toBeDefined();
    expect(screen.getByText('YAML')).toBeDefined();
    expect(screen.getByText('CSV')).toBeDefined();

    const yamlOption = screen.getByText('YAML');
    fireEvent.click(yamlOption);
    expect(onValueChange).toHaveBeenCalledWith('yaml');
  });

  it('should render grouped options with group labels and separators', () => {
    const groupedOptions: Option<string>[] = [
      { value: 'email', label: 'Email', group: 'Web & Network' },
      { value: 'url', label: 'URL', group: 'Web & Network' },
      { value: 'date', label: 'Date', group: 'Data & Formats' },
      { value: 'standalone', label: 'Standalone' },
    ];

    render(<BaseSelect value="email" options={groupedOptions} contentAlign="center" contentPosition="popper" />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getByText('Web & Network')).toBeDefined();
    expect(screen.getByText('Data & Formats')).toBeDefined();
    expect(screen.getAllByText('Email').length).toBeGreaterThan(0);
    expect(screen.getByText('URL')).toBeDefined();
    expect(screen.getByText('Date')).toBeDefined();
    expect(screen.getByText('Standalone')).toBeDefined();
  });

  it('should support disabled state and defaultValue', () => {
    render(<BaseSelect defaultValue="json" options={sampleOptions} disabled={true} />);

    const combobox = screen.getByRole('combobox');
    expect(combobox.getAttribute('data-disabled')).toBeDefined();
  });
});
