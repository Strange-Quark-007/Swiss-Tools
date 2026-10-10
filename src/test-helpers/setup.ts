import { vi } from 'vitest';

import { testRichT, testT } from './i18n';

vi.mock('@/i18n/utils', () => ({
  getT: async () => ({ t: testT, richT: testRichT }),
  useT: () => ({ t: testT, richT: testRichT }),
}));
