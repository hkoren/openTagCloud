import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// jsdom has no ResizeObserver; the layout engine only needs construct/observe/disconnect.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as Record<string, unknown>)['ResizeObserver'] ??=
  ResizeObserverStub;
