import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import ContactsClient from '../components/ContactsClient';
import * as AccessibilityContext from '../context/AccessibilityContext';
import * as LocaleContext from '../context/LocaleContext';

// Mock contexts
vi.mock('../context/AccessibilityContext', () => ({
  useAccessibility: vi.fn(),
}));

vi.mock('../context/LocaleContext', () => ({
  useLocale: vi.fn(),
}));

const defaultAccessibilityValues: AccessibilityContext.AccessibilityContextProps = {
    isEnabled: false,
    fontSize: "normal",
    contrast: "normal",
    images: "show",
    toggleEnabled: vi.fn(),
    setFontSize: vi.fn(),
    setContrast: vi.fn(),
    setImages: vi.fn(),
    resetSettings: vi.fn(),
};

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Phone: () => <svg data-testid="icon-phone" />,
  Mail: () => <svg data-testid="icon-mail" />,
  MapPin: () => <svg data-testid="icon-map-pin" />,
  Clock: () => <svg data-testid="icon-clock" />,
  ExternalLink: () => <svg data-testid="icon-external-link" />,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.ComponentProps<'h1'>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.ComponentProps<'p'>) => <p {...props}>{children}</p>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
    ul: ({ children, ...props }: React.ComponentProps<'ul'>) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }: React.ComponentProps<'li'>) => <li {...props}>{children}</li>,
  },
}));

// Mock i18n
vi.mock('@/lib/i18n', () => ({
  getDictionary: () => ({
    contactsTitle: "Contacts",
    contactsSubtitle: "Get in touch",
    contactInfo: "Contact Information",
    phone: "Phone",
    email: "Email",
    officeAddress: "Office Address",
    address: "123 Main St",
    workingHours: "Working Hours",
    workingHoursText: "Mon-Fri 9-6",
    yandexMaps: "Yandex Maps",
    googleMaps: "Google Maps",
    openInYandex: "Open in Yandex",
    openInGoogle: "Open in Google",
  })
}));

describe('ContactsClient Accessibility', () => {
  let observerCallback: IntersectionObserverCallback;
  let observe: Mock;
  let unobserve: Mock;
  let disconnect: Mock;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(LocaleContext.useLocale).mockReturnValue({ locale: 'en', setLocale: vi.fn() });
    
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();

    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      root: Element | Document | null = null;
      rootMargin: string = '';
      thresholds: ReadonlyArray<number> = [];
      takeRecords = vi.fn();
      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    } as unknown as typeof IntersectionObserver;
  });

  it('should have no accessibility violations in standard mode', async () => {
    vi.mocked(AccessibilityContext.useAccessibility).mockReturnValue(defaultAccessibilityValues);

    const { container } = render(<ContactsClient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations in accessibility mode', async () => {
    vi.mocked(AccessibilityContext.useAccessibility).mockReturnValue({
      ...defaultAccessibilityValues,
      isEnabled: true,
    });

    const { container } = render(<ContactsClient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render simplified layout in accessibility mode', () => {
    vi.mocked(AccessibilityContext.useAccessibility).mockReturnValue({
      ...defaultAccessibilityValues,
      isEnabled: true,
    });

    render(<ContactsClient />);
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Get in touch')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    
    // Check for simplified map links
    expect(screen.getByText('Open in Yandex')).toHaveAttribute('href');
    expect(screen.getByText('Open in Google')).toHaveAttribute('href');
  });

  it('should render map iframes when visible in standard mode', async () => {
    vi.mocked(AccessibilityContext.useAccessibility).mockReturnValue(defaultAccessibilityValues);

    render(<ContactsClient />);
    
    // Trigger intersection
    const mapContainers = document.querySelectorAll('[data-map]');
    if (observerCallback && mapContainers.length > 0) {
        // We need to wrap state updates in act, but render triggers useEffect which sets up observer
        // The observer callback will trigger setState
        
        // Create mock entries
        const entries = Array.from(mapContainers).map(target => ({
            isIntersecting: true,
            target: target,
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRatio: 1,
            intersectionRect: target.getBoundingClientRect(),
            rootBounds: null,
            time: Date.now(),
        } as IntersectionObserverEntry));

        await import('react').then(({ act }) => {
            act(() => {
                observerCallback(entries, {} as IntersectionObserver);
            });
        });
    }

    // Iframes should be rendered
    const iframes = screen.getAllByTitle(/Maps/);
    expect(iframes.length).toBeGreaterThan(0);
  });
});
