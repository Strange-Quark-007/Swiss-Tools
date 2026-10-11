import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MIME_TYPE } from '@/constants/common';
import { useDownloadFile } from '@/hooks/use-download-file';
import { testT } from '@/test-helpers/i18n';

import { LoremGenerator } from '../lorem-generator';
import { useLoremGeneratorStore } from '../lorem-generator-store';
import { LOREM } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useUrlSearchParams: vi.fn(() => [LOREM.word.value, vi.fn()]),
}));

vi.mock('@/hooks/use-download-file', () => ({
  useDownloadFile: vi.fn(),
}));

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: () => vi.fn(),
}));

describe('LoremGenerator', () => {
  const mockDownloadFile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useLoremGeneratorStore.getState().reset();
    vi.mocked(useDownloadFile).mockReturnValue(mockDownloadFile);

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('should generate lorem text and update output on mount', async () => {
    render(<LoremGenerator type={LOREM.paragraph.value} />);

    await vi.waitFor(() => {
      expect(useLoremGeneratorStore.getState().toValue).not.toBe('');
      expect(useLoremGeneratorStore.getState().type).toBe(LOREM.paragraph.value);
    });
  });

  it('should re-generate lorem text when type prop changes', async () => {
    useLoremGeneratorStore.setState({
      type: LOREM.word.value,
      toValue: 'some lorem words',
    });

    const { rerender } = render(<LoremGenerator type={LOREM.word.value} />);

    rerender(<LoremGenerator type={LOREM.sentence.value} />);

    await vi.waitFor(() => {
      expect(useLoremGeneratorStore.getState().type).toBe(LOREM.sentence.value);
    });
  });

  it('should handle copy and download actions', async () => {
    useLoremGeneratorStore.setState({
      type: LOREM.word.value,
      toValue: 'generated lorem ipsum text',
    });

    render(<LoremGenerator type={LOREM.word.value} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('generated lorem ipsum text');

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    fireEvent.click(downloadBtn);
    expect(mockDownloadFile).toHaveBeenCalledWith('generated lorem ipsum text', [LOREM.word.value], MIME_TYPE.TEXT);
  });
});
