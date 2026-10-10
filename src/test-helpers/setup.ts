import { createMockStorage } from './local-storage';

// Initialize in-memory Web Storage for test environment
globalThis.localStorage = createMockStorage();
