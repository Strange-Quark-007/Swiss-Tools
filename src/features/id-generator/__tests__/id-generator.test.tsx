import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MIME_TYPE } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { testT } from '@/test-helpers/i18n';

import { IdGenerator } from '../id-generator';
import { useIdGeneratorStore } from '../id-generator-store';
import { IDS } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useUrlSearchParams: vi.fn(() => [IDS.uuidv4.value, vi.fn()]),
}));

describe('IdGenerator', () => {
  const mockDownloadFile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useIdGeneratorStore.getState().reset();
    vi.mocked(useDownloadFile).mockReturnValue(mockDownloadFile);
  });

  it('should generate IDs and update output on mount', async () => {
    render(<IdGenerator type={IDS.uuidv4.value} />);

    await vi.waitFor(() => {
      expect(useIdGeneratorStore.getState().toValue).not.toBe('');
      expect(useIdGeneratorStore.getState().type).toBe(IDS.uuidv4.value);
    });
  });

  it('should re-generate IDs when type prop changes', async () => {
    useIdGeneratorStore.setState({
      type: IDS.uuidv1.value,
      toValue: 'some-previous-id',
    });

    const { rerender } = render(<IdGenerator type={IDS.uuidv1.value} />);

    rerender(<IdGenerator type={IDS.nanoid.value} />);

    await vi.waitFor(() => {
      expect(useIdGeneratorStore.getState().type).toBe(IDS.nanoid.value);
    });
  });

  it('should handle copy and download actions', async () => {
    useIdGeneratorStore.setState({
      toValue: 'generated-uuid-1234',
    });

    render(<IdGenerator type={IDS.uuidv4.value} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('generated-uuid-1234');

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    fireEvent.click(downloadBtn);
    expect(mockDownloadFile).toHaveBeenCalledWith('generated-uuid-1234', [IDS.uuidv4.value], MIME_TYPE.TEXT);
  });

  it('should not call clipboard when value is empty', () => {
    useIdGeneratorStore.setState({
      toValue: '',
    });

    render(<IdGenerator type={IDS.uuidv4.value} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });
});
