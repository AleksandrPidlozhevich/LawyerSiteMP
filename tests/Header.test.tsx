import React from 'react';
import { beforeAll, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { LocaleProvider } from '@/context/LocaleContext';
import { Header } from '../components/Header';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('../components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle" />,
}));

let currentWidth = 1024;

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      return currentWidth;
    },
  });

  class ResizeObserverMock {
    private callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }

    observe() {
      this.callback([], this as unknown as ResizeObserver);
    }

    unobserve() {}

    disconnect() {}
  }

  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: ResizeObserverMock,
  });
});

afterEach(() => {
  cleanup();
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <LocaleProvider initialLocale="ru">{children}</LocaleProvider>
);

describe('Header', () => {
  it('renders desktop navigation items in Russian', () => {
    currentWidth = 1024;

    render(<Header />, { wrapper: Wrapper });

    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Блог')).toBeInTheDocument();
    expect(screen.getByText('Контакты')).toBeInTheDocument();
    expect(screen.queryByLabelText('Открыть меню')).toBeNull();
  });

  it('renders mobile menu button when width is small', () => {
    currentWidth = 320;

    render(<Header />, { wrapper: Wrapper });

    expect(screen.getByLabelText('Открыть меню')).toBeInTheDocument();
  });

  it('hides header on mobile when isHidden is true', async () => {
    currentWidth = 320;

    render(<Header isHidden />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    });
  });
});
