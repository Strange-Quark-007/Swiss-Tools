import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAppStore } from '@/store/store';
import { testT } from '@/test-helpers/i18n';

import { LabsFeatures } from '../labs-features';

describe('LabsFeatures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({ magicDrop: false });
  });

  it('should render on the server via getServerSnapshot without crashing', () => {
    const html = renderToString(<LabsFeatures />);

    expect(html).toContain(testT('labs.magicDrop.title'));
    expect(html).toContain(testT('labs.magicDrop.description'));
    expect(html).toContain('aria-checked="false"');
  });

  it('should render the magic drop feature card in default off state', () => {
    render(<LabsFeatures />);

    expect(screen.getByText(testT('labs.magicDrop.title'))).toBeDefined();
    expect(screen.getByText(testT('labs.magicDrop.description'))).toBeDefined();

    const switchEl = screen.getByRole('switch', { name: testT('labs.magicDrop.title') });
    expect(switchEl).toBeDefined();
    expect(switchEl.getAttribute('aria-checked')).toBe('false');
  });

  it('should toggle magic drop feature on and trigger success toast', () => {
    render(<LabsFeatures />);

    const switchEl = screen.getByRole('switch', { name: testT('labs.magicDrop.title') });
    fireEvent.click(switchEl);

    expect(useAppStore.getState().magicDrop).toBe(true);
    expect(switchEl.getAttribute('aria-checked')).toBe('true');
    expect(toast.success).toHaveBeenCalledWith(testT('labs.magicDrop.toastEnabled'));
  });

  it('should toggle magic drop feature off and trigger disabled toast', () => {
    useAppStore.setState({ magicDrop: true });
    render(<LabsFeatures />);

    const switchEl = screen.getByRole('switch', { name: testT('labs.magicDrop.title') });
    expect(switchEl.getAttribute('aria-checked')).toBe('true');

    fireEvent.click(switchEl);

    expect(useAppStore.getState().magicDrop).toBe(false);
    expect(switchEl.getAttribute('aria-checked')).toBe('false');
    expect(toast.success).toHaveBeenCalledWith(testT('labs.magicDrop.toastDisabled'));
  });
});
