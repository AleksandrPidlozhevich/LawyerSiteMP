import 'vitest';
import type { AxeMatchers } from 'vitest-axe';

declare module 'vitest' {
  export interface Assertion extends AxeMatchers {
    _axe?: never;
  }
  export interface AsymmetricMatchersContaining extends AxeMatchers {
    _axe?: never;
  }
}
