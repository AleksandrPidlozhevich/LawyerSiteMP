import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import AppLayout from '../components/AppLayout';
import * as AccessibilityContext from '../context/AccessibilityContext';
import * as LocaleContext from '../context/LocaleContext';

// Mock contexts
vi.mock('../context/AccessibilityContext', () => ({
  useAccessibility: vi.fn(),
  AccessibilityProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock('../context/LocaleContext', () => ({
  useLocale: vi.fn(),
  LocaleProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() })
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

describe('Accessibility.test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Default mock implementation
    vi.mocked(LocaleContext.useLocale).mockReturnValue({ 
      locale: 'ru',
      setLocale: vi.fn()
    });
  });

  it('should have no accessibility violations in normal mode', async () => {
    vi.mocked(AccessibilityContext.useAccessibility).mockReturnValue({
      isEnabled: false,
      fontSize: 'normal',
      contrast: 'normal',
      images: 'show',
      toggleEnabled: vi.fn(),
      setFontSize: vi.fn(),
      setContrast: vi.fn(),
      setImages: vi.fn(),
      resetSettings: vi.fn(),
    });

    const { container } = render(
      <AppLayout>
        <h1>Test Content</h1>
        <p>This is a test paragraph.</p>
      </AppLayout>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations in accessibility mode', async () => {
    vi.mocked(AccessibilityContext.useAccessibility).mockReturnValue({
      isEnabled: true,
      fontSize: 'large',
      contrast: 'white-black',
      images: 'hide',
      toggleEnabled: vi.fn(),
      setFontSize: vi.fn(),
      setContrast: vi.fn(),
      setImages: vi.fn(),
      resetSettings: vi.fn(),
    });

    const { container } = render(
      <AppLayout>
        <h1>Test Content</h1>
        <p>This is a test paragraph.</p>
      </AppLayout>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
