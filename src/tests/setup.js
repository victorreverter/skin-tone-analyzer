import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

const storage = {};

global.localStorage = {
    getItem: vi.fn((key) => storage[key] || null),
    setItem: vi.fn((key, value) => { storage[key] = value; }),
    removeItem: vi.fn((key) => { delete storage[key]; }),
    clear: vi.fn(() => { Object.keys(storage).forEach(key => delete storage[key]); }),
};

global.navigator = {
    clipboard: {
        writeText: () => Promise.resolve(),
        readText: () => Promise.resolve(''),
    },
    serviceWorker: {
        register: () => Promise.resolve(),
    },
    mediaQueryList: {
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
    },
};

global.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
});
