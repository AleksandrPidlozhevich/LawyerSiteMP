import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import HomeClient from '../components/HomeClient';
import * as AccessibilityContext from '../context/AccessibilityContext';
import * as LocaleContext from '../context/LocaleContext';

// Mock contexts
vi.mock('../context/AccessibilityContext', () => ({
  useAccessibility: vi.fn(),
}));

vi.mock('../context/LocaleContext', () => ({
  useLocale: vi.fn(),
}));

// Mock FlipWords
vi.mock('@/components/ui/flip-words', () => ({
  FlipWords: () => <span data-testid="flip-words">FlipWords</span>
}));

// Mock lucide-react explicitly
vi.mock('lucide-react', () => {
  const IconMock = (name: string) => {
    const Icon = (props: React.ComponentProps<'svg'>) => <svg {...props} data-testid={`icon-${name}`} />;
    Icon.displayName = name;
    return Icon;
  };
  return {
    Trophy: IconMock('Trophy'),
    Users: IconMock('Users'),
    Calendar: IconMock('Calendar'),
    CheckCircle: IconMock('CheckCircle'),
    HomeIcon: IconMock('HomeIcon'),
    Handshake: IconMock('Handshake'),
    HeartHandshake: IconMock('HeartHandshake'),
    BriefcaseBusiness: IconMock('BriefcaseBusiness'),
    ScrollText: IconMock('ScrollText'),
    ClipboardList: IconMock('ClipboardList'),
    Gavel: IconMock('Gavel'),
    Building2: IconMock('Building2'),
    MessageCircle: IconMock('MessageCircle'),
    FileSignature: IconMock('FileSignature'),
    User: IconMock('User'),
    Shield: IconMock('Shield'),
    ClipboardCheck: IconMock('ClipboardCheck'),
    PenTool: IconMock('PenTool'),
    Phone: IconMock('Phone'),
    Users2: IconMock('Users2'),
    FileText: IconMock('FileText'),
    Briefcase: IconMock('Briefcase'),
  };
});

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: React.ComponentProps<'div'>) => <div className={className} data-testid="card">{children}</div>,
  CardHeader: ({ children, className }: React.ComponentProps<'div'>) => <div className={className} data-testid="card-header">{children}</div>,
  CardTitle: ({ children, className }: React.ComponentProps<'h3'>) => <h3 className={className} data-testid="card-title">{children}</h3>,
  CardContent: ({ children, className }: React.ComponentProps<'div'>) => <div className={className} data-testid="card-content">{children}</div>,
  CardDescription: ({ children, className }: React.ComponentProps<'p'>) => <p className={className} data-testid="card-description">{children}</p>,
  CardFooter: ({ children, className }: React.ComponentProps<'div'>) => <div className={className} data-testid="card-footer">{children}</div>,
}));

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: React.ComponentProps<'img'>) => <img {...props} alt={props.alt || 'mock image'} />
}));

// Mock dynamic imports
vi.mock('next/dynamic', () => ({
  default: () => {
    const DynamicComponent = (props: Record<string, unknown>) => {
      if (props.onClose) {
        return (
          <div role="dialog" aria-modal="true" aria-label="Callback Modal">
            <button onClick={props.onClose as () => void} aria-label="Close">Close</button>
            Callback Modal Content
          </div>
        );
      }
      return <div data-testid="waves">Waves</div>;
    };
    return DynamicComponent;
  }
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.ComponentProps<'h1'>) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: React.ComponentProps<'h2'>) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: React.ComponentProps<'h3'>) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: React.ComponentProps<'p'>) => <p {...props}>{children}</p>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
    ul: ({ children, ...props }: React.ComponentProps<'ul'>) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }: React.ComponentProps<'li'>) => <li {...props}>{children}</li>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock i18n
vi.mock('@/lib/i18n', () => ({
  getDictionary: () => ({
    wonCases: "Won Cases",
    satisfiedCustomers: "Satisfied Customers",
    yearsOfExperience: "Years Experience",
    clientSupport: "Client Support",
    practiceCivil: "Civil Law",
    practiceFamily: "Family Law",
    practiceLabor: "Labor Law",
    practiceHousing: "Housing Law",
    practiceInheritance: "Inheritance Law",
    practiceAdministrative: "Administrative Law",
    practiceCriminal: "Criminal Law",
    practiceCommercial: "Commercial Law",
    trustPoints: ["Point 1", "Point 2"],
    serviceConsultations: "Consultations",
    serviceDocuments: "Documents",
    serviceRepresentation: "Representation",
    serviceCriminalDefense: "Criminal Defense",
    serviceAdministrativeDefense: "Admin Defense",
    serviceLegalActions: "Legal Actions",
    your: "Your",
    flipWords: ["Lawyer", "Advocate"],
    lawyer: "Lawyer",
    professionalAssistance: "Professional Assistance",
    orderCallback: "Order Callback",
    professionalServices: "Professional Services",
    whyChooseUs: "Why Choose Us",
    years: "Years",
    cases: "Cases",
    clients: "Clients",
    support: "Support",
    reviews: "Reviews",
    howToStartWorking: "How to Start Working",
    step1Title: "Step 1",
    step1Description: "Description 1",
    step2Title: "Step 2",
    step2Description: "Description 2",
    step3Title: "Step 3",
    step3Description: "Description 3",
    step4Title: "Step 4",
    step4Description: "Description 4",
    // Added keys for Accessibility mode
    trustTitle: "Why Choose Us",
    practiceAreasTitle: "Practice Areas",
    // Added keys for service details
    practiceCivilPreview: "Civil Law Preview",
    practiceCivilDetails: "Civil Law Details",
    practiceFamilyPreview: "Family Law Preview",
    practiceFamilyDetails: "Family Law Details",
    practiceLaborPreview: "Labor Law Preview",
    practiceLaborDetails: "Labor Law Details",
    practiceHousingPreview: "Housing Law Preview",
    practiceHousingDetails: "Housing Law Details",
    practiceInheritancePreview: "Inheritance Law Preview",
    practiceInheritanceDetails: "Inheritance Law Details",
    practiceAdministrativePreview: "Administrative Law Preview",
    practiceAdministrativeDetails: "Administrative Law Details",
    practiceCriminalPreview: "Criminal Law Preview",
    practiceCriminalDetails: "Criminal Law Details",
    practiceCommercialPreview: "Commercial Law Preview",
    practiceCommercialDetails: "Commercial Law Details",
    practiceReadMore: "Read More",
    servicesFullToggle: "Show Full Services",
    servicesShortToggle: "Show Less Services",
    membershipMgkaName: "MGKA",
    membershipPrefix: "Member of ",
    membershipSuffix: ".",
    trustIntro: "Trust Intro",
    trustOutro: "Trust Outro",
    servicesTitle: "Services",
    servicesIntro: "Services Intro",
    servicesFullText: "Services Full Text",
    practiceAreasIntro: "Practice Areas Intro",
  })
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

describe('HomeClient Accessibility', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(LocaleContext.useLocale).mockReturnValue({ locale: 'en', setLocale: vi.fn() });
    
    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      root: Element | Document | null = null;
      rootMargin: string = '';
      thresholds: ReadonlyArray<number> = [];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
    } as unknown as typeof IntersectionObserver;

    // Mock requestIdleCallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).requestIdleCallback = (cb: () => void) => {
      cb();
      return 1;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).cancelIdleCallback = () => {};
  });

  it('should have no accessibility violations in standard mode', async () => {
    vi.mocked(AccessibilityContext.useAccessibility).mockReturnValue(defaultAccessibilityValues);

    const { container } = render(<HomeClient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations in accessibility mode', async () => {
    vi.mocked(AccessibilityContext.useAccessibility).mockReturnValue({
      ...defaultAccessibilityValues,
      isEnabled: true,
    });

    const { container } = render(<HomeClient />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render simplified layout in accessibility mode', () => {
    vi.mocked(AccessibilityContext.useAccessibility).mockReturnValue({
      ...defaultAccessibilityValues,
      isEnabled: true,
    });

    render(<HomeClient />);
    
    // Check for core content
    expect(screen.getByText(/Your.*Lawyer/)).toBeInTheDocument();
    expect(screen.getByText('Professional Assistance')).toBeInTheDocument();
    
    // Waves should NOT be rendered (mock returns Waves text)
    expect(screen.queryByTestId('waves')).not.toBeInTheDocument();
  });

  it('should render callback modal when button is clicked', async () => {
    vi.mocked(AccessibilityContext.useAccessibility).mockReturnValue(defaultAccessibilityValues);

    render(<HomeClient />);
    
    // Use findByText to wait for rendering if needed, though getByText is usually fine
    const button = screen.getByText('Order Callback');
    expect(button).toBeInTheDocument();
    
    // Click button
    // Use fireEvent which is imported from @testing-library/react (need to add import)
    // Or just use click() wrapped in act if needed, but findBy is better
    button.click();

    // Modal should be visible - use findByRole to wait for state update
    expect(await screen.findByRole('dialog', { name: 'Callback Modal' })).toBeInTheDocument();
  });
});
