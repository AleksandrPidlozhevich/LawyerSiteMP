"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Trophy,
  Users,
  Calendar,
  CheckCircle,
  HomeIcon,
  Handshake,
  HeartHandshake,
  BriefcaseBusiness,
  ScrollText,
  ClipboardList,
  Gavel,
  Building2,
  MessageCircle,
  FileSignature,
  User,
  Shield,
  ClipboardCheck,
  PenTool,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FlipWords } from "@/components/ui/flip-words";
import { useLocale } from "@/context/LocaleContext";
import { useAccessibility } from "@/context/AccessibilityContext";
import { getDictionary } from "@/lib/i18n";

// Dynamic imports: non-SSR components for performance
const Waves = dynamic(() => import("./Waves"), { ssr: false });
const CallbackModal = dynamic(() => import("./CallbackModal"), { ssr: false });
const WorkingStepper = dynamic(() => import("./WorkingStepper"), { ssr: false });

// Root component: renders the client-facing homepage
export default function HomeClient() {
  // UI state: controls callback modal visibility
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [showWaves, setShowWaves] = useState(false);
  const [showWorkingStepper, setShowWorkingStepper] = useState(false);
  const workingStepperAnchorRef = useRef<HTMLDivElement | null>(null);

  const [showPracticeAreas, setShowPracticeAreas] = useState(false);
  const practiceAreasAnchorRef = useRef<HTMLDivElement | null>(null);

  // Localization: select translation dictionary by current locale
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const { isEnabled } = useAccessibility();
  const shouldRenderWorkingStepper = isEnabled || showWorkingStepper;
  const shouldRenderPracticeAreas = isEnabled || showPracticeAreas;

  // Progressive enhancement: enable waves when idle or after timeout
  useEffect(() => {
    if (isEnabled) return; // Disable waves in a11y mode

    let cancelled = false;

    const enable = () => {
      if (!cancelled) setShowWaves(true);
    };

    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(enable, { timeout: 1500 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }

    const id = window.setTimeout(enable, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [isEnabled]);

  useEffect(() => {
    if (isEnabled) return; // Skip intersection observer in a11y mode

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [isEnabled]);

  useEffect(() => {
    if (isEnabled) return;

    const anchor = workingStepperAnchorRef.current;
    if (!anchor || !("IntersectionObserver" in window)) {
      const timeoutId = window.setTimeout(() => {
        setShowWorkingStepper(true);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowWorkingStepper(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "1700px 0px", threshold: 0.01 },
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [isEnabled]);

  useEffect(() => {
    if (isEnabled) return;

    const anchor = practiceAreasAnchorRef.current;
    if (!anchor || !("IntersectionObserver" in window)) {
      const timeoutId = window.setTimeout(() => {
        setShowPracticeAreas(true);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowPracticeAreas(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "1700px 0px", threshold: 0.01 },
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [isEnabled]);

  // Data: achievements stats shown as cards
  const achievements = useMemo(
    () => [
      {
        icon: Trophy,
        value: "100+",
        label: t.wonCases,
        color: "text-amber-600 dark:text-amber-500",
      },
      {
        icon: Users,
        value: "200+",
        label: t.satisfiedCustomers,
        color: "text-slate-600 dark:text-slate-400",
      },
      {
        icon: Calendar,
        value: "10+",
        label: t.yearsOfExperience,
        color: "text-slate-700 dark:text-slate-300",
      },
      {
        icon: CheckCircle,
        value: "24/7",
        label: t.clientSupport,
        color: "text-slate-600 dark:text-slate-400",
      },
    ],
    [t],
  );

  // Data: practice areas listed in the services grid
  const practiceAreas = useMemo(
    () => [
      {
        icon: Handshake,
        title: t.practiceCivil,
        preview: t.practiceCivilPreview,
        details: t.practiceCivilDetails,
        color: "text-blue-600 dark:text-blue-400",
      },
      {
        icon: HeartHandshake,
        title: t.practiceFamily,
        preview: t.practiceFamilyPreview,
        details: t.practiceFamilyDetails,
        color: "text-rose-600 dark:text-rose-400",
      },
      {
        icon: BriefcaseBusiness,
        title: t.practiceLabor,
        preview: t.practiceLaborPreview,
        details: t.practiceLaborDetails,
        color: "text-cyan-600 dark:text-cyan-400",
      },
      {
        icon: HomeIcon,
        title: t.practiceHousing,
        preview: t.practiceHousingPreview,
        details: t.practiceHousingDetails,
        color: "text-emerald-600 dark:text-emerald-400",
      },
      {
        icon: ScrollText,
        title: t.practiceInheritance,
        preview: t.practiceInheritancePreview,
        details: t.practiceInheritanceDetails,
        color: "text-violet-600 dark:text-violet-400",
      },
      {
        icon: ClipboardList,
        title: t.practiceAdministrative,
        preview: t.practiceAdministrativePreview,
        details: t.practiceAdministrativeDetails,
        color: "text-slate-600 dark:text-slate-400",
      },
      {
        icon: Gavel,
        title: t.practiceCriminal,
        preview: t.practiceCriminalPreview,
        details: t.practiceCriminalDetails,
        color: "text-amber-600 dark:text-amber-500",
      },
      {
        icon: Building2,
        title: t.practiceCommercial,
        preview: t.practiceCommercialPreview,
        details: t.practiceCommercialDetails,
        color: "text-indigo-600 dark:text-indigo-400",
      },
    ],
    [t],
  );


  const trustPoints = useMemo(() => t.trustPoints as string[], [t]);

  // Data: primary service items displayed in the services section
  const serviceItems = useMemo(
    () => [
      {
        icon: MessageCircle,
        title: t.serviceConsultations,
        color: "text-blue-600 dark:text-blue-400",
      },
      {
        icon: FileSignature,
        title: t.serviceDocuments,
        color: "text-violet-600 dark:text-violet-400",
      },
      {
        icon: User,
        title: t.serviceRepresentation,
        color: "text-emerald-600 dark:text-emerald-400",
      },
      {
        icon: Shield,
        title: t.serviceCriminalDefense,
        color: "text-amber-600 dark:text-amber-500",
      },
      {
        icon: ClipboardCheck,
        title: t.serviceAdministrativeDefense,
        color: "text-slate-600 dark:text-slate-400",
      },
      {
        icon: PenTool,
        title: t.serviceLegalActions,
        color: "text-indigo-600 dark:text-indigo-400",
      },
    ],
    [t],
  );

  // SIMPLIFIED RENDER FOR ACCESSIBILITY MODE
  if (isEnabled) {
    return (
      <div className="space-y-12 py-8">
        <section>
           <h1 className="text-4xl font-bold mb-6">{t.your} {t.flipWords[0]} {t.lawyer}</h1>
           <p className="text-xl mb-6">{t.professionalAssistance}</p>
           <div className="flex flex-col sm:flex-row gap-4">
             <button 
               onClick={() => setShowCallbackModal(true)}
               className="px-8 py-4 bg-primary text-primary-foreground font-bold border-2 border-primary hover:bg-secondary hover:text-secondary-foreground text-xl rounded-none transition-colors text-center"
             >
               {t.orderCallback}
             </button>
             <a 
               href="tel:+375297798827"
               className="px-8 py-4 bg-primary text-primary-foreground font-bold border-2 border-primary hover:bg-secondary hover:text-secondary-foreground text-xl rounded-none transition-colors text-center"
             >
               {t.callNow}
             </a>
           </div>
        </section>

        <section aria-labelledby="achievements-heading">
          <h2 id="achievements-heading" className="text-3xl font-bold mb-4">{t.trustTitle}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <li key={index} className="border-2 border-current p-4">
                 <div className="text-3xl font-bold">{achievement.value}</div>
                 <div className="text-lg">{achievement.label}</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="services-heading">
           <h2 id="services-heading" className="text-3xl font-bold mb-4">{t.practiceAreasTitle}</h2>
           <div className="grid grid-cols-1 gap-6">
              {practiceAreas.map((area, index) => (
                <div key={index} className="border-b-2 border-current pb-4">
                  <h3 className="text-2xl font-bold mb-2">{area.title}</h3>
                  <p className="text-lg">{area.details}</p>
                </div>
              ))}
           </div>
        </section>

        <section aria-labelledby="working-stepper-heading" ref={workingStepperAnchorRef}>
          {shouldRenderWorkingStepper ? <WorkingStepper /> : <div className="mb-12" />}
        </section>

        {showCallbackModal && (
          <CallbackModal
            onClose={() => setShowCallbackModal(false)}
          />
        )}
      </div>
    );
  }

  // STANDARD RENDER
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 h-full w-full z-0 filter">
        {showWaves ? (
          <Waves
            backgroundColor="transparent"
            waveSpeedX={0.05}
            waveSpeedY={0.05}
            waveAmpX={25}
            waveAmpY={25}
            xGap={15}
            yGap={15}
            className="absolute inset-0"
          />
        ) : (
          <div className="absolute inset-0" />
        )}
      </div>

      <section className="flex flex-col items-center py-16 px-4 relative z-10">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-center lg:text-left leading-tight">
                <div>{t.your}</div>
                <div className="text-blue-600 h-[1.2em] relative">
                  <FlipWords words={t.flipWords} duration={3500} />
                </div>
                <div>{t.lawyer}</div>
              </h1>

              <p className="text-lg mb-8 whitespace-pre-line text-muted-foreground">
                {t.professionalAssistance}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => setShowCallbackModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:translate-y-0 group"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer skew-x-[-20deg]" />
                  <span className="relative z-10">{t.orderCallback}</span>
                </button>
                <a
                  href="tel:+375297798827"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 relative overflow-hidden text-center hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:-translate-y-1 active:translate-y-0 group"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer skew-x-[-20deg]" />
                  <span className="relative z-10">{t.callNow}</span>
                </a>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full max-h-[420px] sm:max-h-none">
                  <Image
                    src="/PidlozhevichM.png"
                    alt={t.professionalLawyer}
                    fill
                    className="object-cover object-top rounded-2xl shadow-2xl"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  />
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl -z-10" />
                </div>
              </div>
            </div>
          </div>

          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-6 mb-20" data-reveal>
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={index}
                  className="card-base bg-card/90 backdrop-blur-sm border border-border p-6 transition-all duration-300"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div
                      className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-800 ${achievement.color}`}
                    >
                      <IconComponent size={24} />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{achievement.value}</div>
                    <div className="text-sm text-muted-foreground text-center">
                      {achievement.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="reveal text-center mb-6" data-reveal>
            {/* Membership line: MGKA link, dot, and logo */}
            <p className="text-muted-foreground max-w-4xl mx-auto text-sm sm:text-base leading-relaxed">
              {t.membershipPrefix}
              <span className="inline-flex flex-wrap items-center justify-center gap-2 align-baseline">
                <a
                  href="https://www.advokat.by/advokat/reestr/pidlozhevich_nikolay_evstafevich/?sphrase_id=128396"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:opacity-80 underline underline-offset-4"
                >
                  {t.membershipMgkaName}
                </a>
                {t.membershipSuffix}
                <svg
                  viewBox="0 0 181.7403 219.18822"
                  aria-hidden="true"
                  focusable="false"
                  className="w-12 h-12 sm:w-15 sm:h-15 sm:ml-2"
                >
                  <g transform="matrix(.35278 0 0 -.35278 -12.89 236.322)" fillRule="evenodd">
                    <path
                      d="M53.084 598.407c74.444 6.517 147.465 16.064 216.662 42.26 4.194 1.587 23.207 10.54 24.662 10.464.626-.033 21.023-9.876 25.007-11.492 9.347-3.793 17.335-6.682 27.253-9.858 19.09-6.114 38.848-10.34 59.033-14.06 21.212-3.906 43.167-6.792 64.687-9.573 20.322-2.625 45.235-4.285 64.787-8.382 1.07-9.697-1.63-54.41-2.064-70.39-.244-9.03-4.1-9.967-8.878-14.497-18.336-17.386-27.884-46.32-18.712-71.405 15.343-41.962 25.72-6.91 9.05-69.58C483.214 253.99 413.685 140.87 322.343 81.552c-4.78-3.106-10.38-6.277-15.757-9.354-15.748-9.01-15.51-10.18-46.6 12.36-41.2 29.87-66.23 57.825-96.067 98.257-22.254 30.156-54.733 87.683-68.416 124.85-8.84 24.01-17.25 46.054-23.62 72.498-1.637 6.796-3.093 13.57-4.512 20.543-2.33 11.44-.432 10.18 4.17 17.884 13.5 22.597 22.41 49.88 7.363 74.45-4.884 7.974-9.74 14.245-16.2 19.822L55.89 518.7zM36.54 614.16l2.645-79.088c.3-9.54-1.66-17.27 4.98-22.177 24.683-18.24 36.078-43.106 22.024-72.623-12.6-26.468-17.546-19.134-13.86-37.192 18.627-91.234 67.11-190.47 123.662-257.287 8.1-9.572 16.015-19.792 25.228-28.266l27.723-26.89c5.938-5.464 55.93-45.117 65.925-41.882 7.338 2.374 28.042 15.556 34.148 19.533a309.706 309.706 0 0 1 31.27 23.33C399.52 124.9 431.734 164.134 459 209.106c13.943 22.993 25.867 46.076 37.41 71.807 11.098 24.74 20.883 51.096 29.115 78.96 4.098 13.867 8.103 28.493 11.288 43.367 2.86 13.36 4.176 10.562-3.05 19.485-30.016 37.073-19.113 62.33 8.113 89.99 8.394 8.526 7.072 3.91 7.496 20.175.228 8.743.518 17.49.775 26.234.5 17.048 1.98 36.774 1.448 53.497-.276.174-.713.697-.877.435l-7.353 1.734c-69.07 8.56-160.598 17.228-222.147 43.013-46.85 19.63-6.203 14.525-83.11-9.354C179.207 630.16 98 618.77 36.54 614.16"
                      fill="#d3d2d2"
                    />
                    <path
                      d="M82.284 569.24l2.276-30.915c.78-8.992 5.213-7.265 13.758-19.286 20.28-28.528 21.693-74.37 4.525-105.565-4.76-8.65-5.1-5.463-2.63-17.033 2.61-12.233 5.328-24.116 8.92-35.8 7.406-24.076 15.25-43.042 24.65-64.895 15.546-36.138 43.65-80.394 67.802-110.166l30.937-34.578c4.093-4.08 7.692-6.915 11.747-11.202 4.21-4.45 44.71-38.54 51.697-36.315 3.658 1.164 21.956 15.175 25.716 18.012 39.69 29.94 77.288 77.07 102.634 119.015 22.4 37.072 41.923 80.88 54.27 123.59 3.486 12.057 6.366 23.49 9.203 35.74 2.328 10.056.26 8.375-4.163 15.34-21.764 34.27-14.214 89.27 15.087 116.66 7.344 6.867 4.632 3.546 5.786 16.28.628 6.933 1.818 13.215 1.385 20.435-16.586 3.71-39.42 5.243-56.96 7.417-18.82 2.334-37.7 4.97-56.162 8.29-25.612 4.61-52.502 11.075-76.044 21.068-30.83 13.087-14.56 12.887-44.12.874-7.58-3.08-15.867-6.018-24.227-8.553-50.674-15.37-113.008-24.75-166.09-28.414"
                      fill="#d3d2d2"
                    />
                    <path
                      d="M171.717 379.208c-10.186 7.856-18.187 25.606-41.67 19.76-.606-8.943 8.92-17.023 14.635-20.243 10.172-5.733 16.597-4.506 28.028-2.174 3.87-5.054 24.475-52.197 30.186-62.974l33.69-61.053c-17.665-.854-36.57-8.076-37.687-23.638 19.335-3.93 33.768 8.04 37.49 22.45 3.293-1.993.937.25 3.684-3.284l14.948-24.714c-9.47-4.7-13.087-2.096-21.776-10.306-4.896-4.627-9.975-10.553-12.167-18.92 14.643-2.686 26.63 10.49 32.143 21.782.283.578 1.11 2.377 1.52 2.97 2.02 2.922.11.875 2.54 2.765 2.164-5.053 10.248-16.356 13.725-21.207 4.762-6.645 10.445-13.822 14.6-20.755-1.922-5.226-5.206-6.462-8.537-10.918l.512-21.95c6.104 4.577 11.088 16.015 17.345 20.61 3.2-4.417 12.814-17.975 16.31-20.422 2.458 33.05-.654 17.205-8.116 32.424 6.267 11.235 20.89 29.36 29.264 42.628 5.234-6.822 13.162-30.673 35.48-28.113-1.838 8.45-7.545 14.873-12.158 19.17-8.468 7.89-12.6 5.758-21.828 10.24 1.622 4.186 5.847 9.816 8.374 13.874l9.52 13.844c6.335-9.616 13.025-27.18 38.262-22.177-.323 8.38-7.63 14.578-12.947 17.572-7.196 4.05-15.542 5.69-24.76 6.032 3.85 10.214 13.128 21.082 17.333 31.514 3.23-2.384-.185.773 2.22-2.096.644-.768 1.396-2.012 1.91-2.832 1.46-2.317.997-1.892 3.175-4.34 7.787-8.747 20.093-15.73 32.856-12.56 3.913 6.626-7.403 15.008-12.416 17.706-7.49 4.03-16.462 4.748-26.03 5.26 1.462 5.03 8.046 15.993 10.873 21.253 11.238 20.903 21.174 42.21 30.71 64.266l13.842 33.085c1.986 4.366 4.118 6.163 6.462 9.96 7.467 12.093 12.295 38.45 3.674 51.906-10.477-9.135-14.017-29.655-12.482-44.297.82-7.828 3.07-9.11-.15-16.083-5.458-11.812-16.138-37.75-23.036-49.007-.126-.207-.288-.484-.424-.68l-2.123-2.415c-3.597 7.662-8.448 34.01-24.8 42.378-1.677-10.077 1.357-21.163 5.616-28.706 4.41-7.812 9.107-11.75 16.747-14.77l2.078-.95-15.037-27.627c-2.254 8.864-6.616 17.456-11.04 24.137-3.277 4.95-11.823 14.59-17.857 16.31 2.132-20.494 9.08-39.818 28.75-41.464-2.416-6.354-14.036-27.37-18.302-32.75-3.344 3.184-8.364 18.24-11.792 23.42-3.39 5.124-11.906 15.665-17.25 16.998 1.997-18.525 7.163-38.2 27.883-41.96-1.803-5.326-5.36-9.927-8.35-14.89-2.59-4.305-4.81-9.205-8.128-12.786-1.708-1.844.107-.377-2.016-1.75-7.007 10.207-10.776 35.156-31.093 42.507 1.246-15.653 5.61-29.702 17.69-38.85l8.883-4.16c1.37-.53.03.14 1.545-.645 2.002-1.035 1.023-.36 2.13-1.475-3.522-5.567-15.724-24.996-20.18-27.945-4.028 17.915-14.695 42.687-28.68 46.043-.588-17.128 5.056-38.42 22.028-44.568 1.23-.444 2.267-.64 3.117-.987l3.9-2.274c-6.484-5.55-20.48-28.292-29.564-36.923-4.186 1.812-12.99 14.333-15.872 18.044-4.42 5.694-12.074 14.29-14.75 20.49 20.057 2.384 29.818 23.126 29.158 46.407-13.78-4.1-25.738-28.325-28.756-46.29-9.234 5.403-54.94 83.535-58.663 93.51 11.845 5.984 12.82 1.47 20.616 14.768 3.958 6.755 6.728 18.57 7.815 27.746-14.224-5-25.182-26.31-28.834-40.57-3.606 2.903-5.708 9-7.952 13.29-2.646 5.057-4.907 9.62-7.377 14.078.212.165.6.592.714.374l1.488.69c.212.084.55.205.79.294l8.387 4.707c2.49 2.36 5.49 5.95 7.632 9.82 4.26 7.703 7.246 18.236 5.69 28.693-14.376-7.73-21.015-27.274-24.355-42.595-3.39 2.63-5.456 8.22-7.295 12.202l-18.828 40.16c-3.893 8.8 6.676 45.364-12.64 60.29-7.19-11.477-4.612-35.446.98-46.878 5.446-11.142 14.282-21.09 18.773-39.456"
                      fill="#2e3564"
                    />
                    <path
                      d="M 138.43 343.837 c 7.875 -16.06 39.658 -9.18 45.994 5.404 c -14.717 5.105 -39.756 10.175 -45.993 -5.403 m 19.233 -39.903 c 10.1 -14.762 40.564 -3.383 44.74 11.958 c -15.3 2.938 -40.807 4.355 -44.74 -11.957 m 274.859 0.014 c -10.1 -14.762 -40.563 -3.383 -44.738 11.96 c 15.298 2.935 40.805 4.353 44.738 -11.96 m -29.12 45.576 c 6.348 -13.313 35.616 -22.34 45.96 -5.283 c -5.958 15.398 -31.466 10.85 -45.96 5.283 m 12.802 28.238 c 2.177 -1.504 1.26 -1.647 6.49 -2.466 c 18.12 -2.835 36.403 11.996 35.516 24.125 c -18.186 4.916 -35.644 -9.747 -42.005 -21.66 m -238.442 2.447 c 0.706 16.127 -1.306 24.845 4.95 39.765 c 2.914 6.95 5.786 10.092 7.756 12.506 c 2.184 2.677 3.374 4.217 4.7 3.837 c 1.82 -0.523 1.38 -8.088 1.425 -12.73 c 0.097 -10.455 -2.637 -23.933 -9.11 -35.493 c -2.218 -3.962 -5.368 -7.562 -9.72 -7.884 m 233.375 -0.901 c -0.704 16.125 1.308 24.844 -4.95 39.764 c -2.912 6.95 -5.784 10.09 -7.754 12.505 c -2.185 2.675 -3.374 4.216 -4.7 3.835 c -1.82 -0.523 -1.382 -8.088 -1.425 -12.73 c -0.097 -10.455 2.638 -23.932 9.11 -35.492 c 2.218 -3.963 5.368 -7.562 9.72 -7.884 m -266.526 23.827 c 2.816 0 5.113 2.388 5.113 5.315 c 0 2.928 -2.297 5.316 -5.113 5.316 c -2.816 0 -5.113 -2.388 -5.113 -5.316 c 0 -2.927 2.297 -5.315 5.113 -5.315 m 14.445 -44.695 c 3.043 0 5.524 2.58 5.524 5.742 s -2.48 5.74 -5.523 5.74 c -3.04 0 -5.52 -2.578 -5.52 -5.74 c 0 -3.163 2.48 -5.742 5.522 -5.742 m 39.115 25.97 c 3.042 0 5.522 2.578 5.522 5.74 c 0 3.163 -2.48 5.742 -5.522 5.742 c -3.042 0 -5.522 -2.58 -5.522 -5.74 c 0 -3.164 2.48 -5.743 5.522 -5.743 m 15.744 -33.273 c 3.042 0 5.522 2.58 5.522 5.742 s -2.48 5.74 -5.522 5.74 c -3.042 0 -5.523 -2.578 -5.523 -5.74 c 0 -3.163 2.48 -5.742 5.522 -5.742 m 18.256 -28.688 c 3.042 0 5.523 2.58 5.523 5.74 c 0 3.164 -2.48 5.743 -5.523 5.743 c -3.042 0 -5.522 -2.578 -5.522 -5.74 c 0 -3.163 2.48 -5.742 5.522 -5.742 m 21.511 -30.515 c 3.042 0 5.522 2.58 5.522 5.742 s -2.48 5.74 -5.522 5.74 c -3.042 0 -5.523 -2.578 -5.523 -5.74 c 0 -3.163 2.48 -5.742 5.523 -5.742 m 18.909 -30.028 c 2.86 0 5.193 2.426 5.193 5.4 s -2.333 5.4 -5.193 5.4 c -2.86 0 -5.193 -2.426 -5.193 -5.4 s 2.333 -5.4 5.193 -5.4 m 43.099 -0.32 c 2.995 0 5.437 2.54 5.437 5.653 c 0 3.114 -2.442 5.654 -5.437 5.654 s -5.438 -2.54 -5.438 -5.655 s 2.443 -5.654 5.438 -5.654 m 19.078 29.982 c 3.07 0 5.574 2.604 5.574 5.796 s -2.504 5.796 -5.574 5.796 s -5.575 -2.604 -5.575 -5.796 s 2.504 -5.796 5.574 -5.796 m 21.907 31.321 c 3.085 0 5.602 2.616 5.602 5.824 c 0 3.21 -2.517 5.826 -5.603 5.826 s -5.603 -2.617 -5.603 -5.825 c 0 -3.207 2.517 -5.823 5.602 -5.823 m 18.587 28.605 c 3.04 0 5.52 2.58 5.52 5.74 c 0 3.163 -2.48 5.742 -5.52 5.742 c -3.042 0 -5.522 -2.58 -5.522 -5.74 c 0 -3.163 2.48 -5.742 5.522 -5.742 m 15.175 32.941 c 2.938 0 5.334 2.49 5.334 5.545 c 0 3.055 -2.396 5.545 -5.333 5.545 c -2.937 0 -5.333 -2.49 -5.333 -5.545 c 0 -3.054 2.396 -5.545 5.334 -5.545 m 20.695 36.218 c 2.773 0 5.036 2.352 5.036 5.236 c 0 2.883 -2.263 5.235 -5.036 5.235 c -2.774 0 -5.037 -2.352 -5.037 -5.236 c 0 -2.885 2.263 -5.237 5.037 -5.237 m 32.865 -17.186 c 2.55 0 4.63 2.163 4.63 4.814 c 0 2.652 -2.08 4.814 -4.63 4.814 s -4.63 -2.162 -4.63 -4.815 c 0 -2.652 2.08 -4.815 4.63 -4.815 m -14.242 -45.336 c 3.117 0 5.66 2.643 5.66 5.884 c 0 3.24 -2.543 5.884 -5.66 5.884 c -3.116 0 -5.658 -2.643 -5.658 -5.883 s 2.542 -5.883 5.658 -5.883 m -10.08 -38.985 c 2.982 0 5.416 2.53 5.416 5.63 c 0 3.103 -2.434 5.633 -5.417 5.633 c -2.984 0 -5.418 -2.53 -5.418 -5.632 s 2.434 -5.63 5.417 -5.63 m -14.018 -37.303 c 3.01 0 5.465 2.553 5.465 5.682 c 0 3.13 -2.454 5.68 -5.464 5.68 c -3.01 0 -5.464 -2.55 -5.464 -5.68 s 2.455 -5.682 5.465 -5.682 m -21.08 -33.272 c 3.353 0 6.086 2.842 6.086 6.326 c 0 3.486 -2.733 6.328 -6.086 6.328 c -3.352 0 -6.085 -2.842 -6.085 -6.328 c 0 -3.484 2.733 -6.327 6.085 -6.327 m -23.958 -29.544 c 3.098 0 5.625 2.627 5.625 5.85 c 0 3.22 -2.528 5.847 -5.626 5.847 c -3.1 0 -5.626 -2.628 -5.626 -5.848 c 0 -3.222 2.527 -5.85 5.626 -5.85 m -191.985 99.711 c 3.268 0 5.933 2.77 5.933 6.168 c 0 3.397 -2.664 6.168 -5.932 6.168 c -3.268 0 -5.933 -2.77 -5.933 -6.167 s 2.665 -6.168 5.933 -6.168 m 13.878 -37.616 c 3.268 0 5.933 2.77 5.933 6.168 c 0 3.397 -2.665 6.168 -5.933 6.168 s -5.933 -2.77 -5.933 -6.168 c 0 -3.397 2.665 -6.168 5.933 -6.168 m 21.911 -32.3 c 3.268 0 5.933 2.772 5.933 6.17 c 0 3.396 -2.664 6.167 -5.932 6.167 c -3.268 0 -5.933 -2.77 -5.933 -6.168 s 2.665 -6.17 5.933 -6.17 M 227.8 218.55 c 3.27 0 5.934 2.77 5.934 6.168 c 0 3.397 -2.665 6.17 -5.933 6.17 c -3.267 0 -5.932 -2.773 -5.932 -6.17 s 2.665 -6.168 5.933 -6.168 m -50.157 201.992 c 2.816 0 5.112 2.388 5.112 5.316 c 0 2.927 -2.296 5.315 -5.112 5.315 c -2.816 0 -5.113 -2.388 -5.113 -5.315 c 0 -2.928 2.297 -5.316 5.113 -5.316 m -1.535 -157.68 c 9.35 19.147 21.923 22.698 42.73 22.698 c -9.474 -14.432 -23.198 -29.8 -42.73 -22.698 m 48.122 25.721 c 0 11.736 17.53 37.354 30.108 43.174 c -3.576 -15.806 -7.278 -44.473 -30.108 -43.174"
                      fill="#2e3564"
                    />
                    <path
                      d="M244.237 258.253c0 11.736 17.53 37.354 30.108 43.174-3.576-15.806-7.28-44.472-30.108-43.174m184.056 265.885c-3.608.075-12.58 1.19-16.92 1.565-.434.05-.614.398-.457.82 1.24 3.257 8.565 17.78 11.096 22.757.41.72.613.59.865-.097.805-1.624 4.615-18.49 5.838-24.215.07-.337-.314-.842-.422-.83m-.532 39.293c-.54.062-1.022-.322-1.876-1.104-.892-1.105-2.722-3.75-3.84-4.94-.254-.3-.278-.517-.314-.84-.06-.542-.374-1.384-.905-2.2-6.07-11.158-22.07-42.463-25.177-47.705-3.926-6.682-5.37-6.85-10.987-8.084-1.683-.36-2.55-1.248-2.623-1.897-.072-.65.42-1.145 2.368-1.363 1.624-.18 7.313-.27 11.318-.72 4.005-.447 6.674-1.075 8.513-1.28 1.408-.16 3.068-.015 3.19 1.067.084.758-.926 1.528-2.705 2.275-4.7 2.06-4.927 3.948-4.78 5.248.3 2.705 4.145 11.59 7.747 18.31.252.3.855.78 1.288.733 2.31.07 11.845-.887 17.798-1.553 3.14-.352 3.5-1.05 3.56-1.495 1.713-7.205 3.62-14.652 3.988-19.186.18-2.322.37-4.535-4.946-5.036-1.984-.106-2.73-.9-2.792-1.44-.06-.542.504-1.372 3.21-1.675 2.706-.303 4.246-.256 7.71-.644 4.762-.533 10.005-1.667 13.576-2.067 2.706-.303 3.536.262 3.62 1.02.086.757-.72 1.395-2.39 2.13-4.738 1.736-6.372 2.796-8.95 12.07-1.343 4.645-7.062 26.983-10.92 43.416-1.427 5.857-2.722 10.934-3.26 13.953-.6 2.48-.985 2.96-1.417 3.008m-114.088 4.045c-.037-1.197 1.694-1.578 4.175-2.418 3.238-.972 4.382-2.752 4.48-6.568.205-3.93.137-6.107-.388-22.98-.37-11.757-.69-18.612-1.102-24.81-.44-7.178-2.435-8.206-7.694-9.13-2.412-.47-3.296-.88-3.327-1.86-.024-.76 1.154-1.45 2.677-1.5 3.484-.108 7.304.1 10.787-.008 3.376-.106 10.224-.646 12.618-.72 1.743-.054 3.175.446 3.202 1.317.024.76-.824 1.55-2.77 2.046-5.398 1.585-5.89 3.235-5.997 6.834-.096 3.926.094 20.482.52 23.63.127.65.256 1.3.8 1.282 4.457-.357 6.36-2.27 9.06-6.494 6.44-10.116 11.123-17.236 16.256-23.825 2.517-3.13 7.76-6.235 14.51-6.445 1.63-.05 4.238-.35 6.208-.085 1.207.29 2.527.685 2.564 1.882.01.326-.52.78-.844.898-5.946 1.493-9.423 1.82-15.796 10.626-6.895 9.476-15.83 23.484-18.205 27.698-.105.112-.208.333.017.545 2.93 3.068 5.776 7.01 10.35 13.95 4 5.98 7.39 9.796 12.614 9.633.98-.03 2.605-.3 3.58-.547 1.295-.37 2.173-.178 2.962.67.452.53.925 1.714.955 2.693.095 3.048-2.266 4.212-4.988 4.296-6.42.2-10.925-4.454-15.49-11.068-3.2-4.804-4.928-7.8-8.01-12.28-5.82-8.428-9.018-9.636-15.662-9.538-.435.014-.74.677-.727 1.112-.14 2.51.484 19.054.817 22.748.46 4.236 1.466 5.076 5.633 5.927 1.864.378 2.855.674 2.885 1.654.027.87-.83 1.334-2.572 1.388-2.612.082-7.194-.102-10.46 0-3.374.105-7.824.68-10.437.76-1.633.05-3.167-.228-3.2-1.317m-32.58.607l-14.154-.314c-3.376-.075-7.195.167-11.986.06-1.742-.038-3.036-.61-3.02-1.374.018-.762.465-1.296 2.655-1.793 4.925-1.088 6.708-2.9 7.008-6.597.28-2.826.424-9.25.65-19.486.48-21.56.113-29.628-.138-33.01-.08-1.31-.24-3.928-6.09-5.366-1.733-.473-2.805-1.26-2.783-2.24.014-.652.788-1.18 2.966-1.13 2.178.047 8.478.84 12.616.933 4.137.09 7.846-.153 10.677-.09 1.96.043 3.037.61 3.023 1.265-.02.87-1.02 1.72-2.66 2.01-7 1.26-7.375 3.432-7.556 6.696-.196 3.918-.943 27.758-1.01 30.807-.16 7.188-.25 21.13-.1 24.074-.01.436.516 1.32 1.82 1.457 2.282.27 12.953.506 16.776.046 3.605-.465 4.866-3.27 6.617-8.568.704-2.272 1.708-3.34 2.58-3.32.87.02 1.488 1.667 1.347 3.08-.19 3.7-.54 9.684-.394 12.846-.014.654-.68 1.184-1.22 1.063-1.195-.245-2.49-.71-17.626-1.045m-132.038-10.1c.076-.76 1.128-1.42 1.908-1.56 1.44-.184 2.894-.477 4.79-.833 4.79-.834 5.42-4.93 5.508-5.797.6-8.15 1.348-39.598 1.015-47.184-.247-6.265-.713-8.173-7.235-10.798-1.376-.466-2.06-1.3-2.016-1.735.12-1.192 1.345-1.397 2.97-1.234 2.71.272 6.036.934 8.637 1.195 2.818.283 7.402.415 10.87.763 1.733.175 2.882.728 2.795 1.595-.098.975-.683 1.355-3.133 1.765-5.7 1.18-6.72 2.61-7.49 8.115-1.327 9.937-2.877 37.364-2.466 42.003-.013 1.203.323 1.127.725.402 4.934-8.81 15.54-25.04 22.826-38.756 2.582-4.995 4.134-8.452 5.164-11.084.445-1.16 1.182-1.962 1.832-1.896.76.076 1.31.022 2.188 3.284 1.2 4.39 3.128 10.275 5.163 16.17 3.334 9.31 13.078 34.37 14.248 36.896.357.802.78-.14.932-.563.88-5.493 4.25-36.898 4.307-41.818.077-4.042.11-6.556-4.2-8.303-1.475-.587-2.72-1.26-2.623-2.234.11-1.084 1.887-1.343 3.08-1.224 2.6.26 6.143.945 8.202 1.153 4.01.402 12.408.698 13.6.817 1.626.163 3.09.857 3 1.724-.074.76-1.137 1.528-3.13 1.766-5.355.995-6.656 1.96-7.795 6.77-.63 3.002-3.204 16.644-6.228 46.77-.566 5.635.96 7.868 2.52 8.682 1.56.813 3.035 1.4 4.736 1.898 1.918.52 2.72 1.258 2.643 2.017-.098.974-1.53 1.05-2.938.908-.975-.098-9.72-1.304-13.62-1.696-.218-.022-.987-1.084-1.04-1.636-.433-2.233-1.798-6.092-1.863-6.536-1.277-4.726-17.702-45.013-18.492-46.953-.184-.347-.867-.087-1.116.216-1.725 1.907-16.906 26.653-24.258 38.83-2.635 4.443-3.405 5.57-5.108 9.45-.162.53-1.116 1.31-1.333 1.288-6.285-.63-7.5-.533-14.543-1.24-2.384-.24-3.143-.315-3.034-1.4"
                      fill="#2e3564"
                    />
                  </g>
                </svg>
              </span>
            </p>
          </div>

          <div className="reveal" data-reveal ref={workingStepperAnchorRef}>
            {shouldRenderWorkingStepper ? <WorkingStepper className="mb-20" /> : <div className="mb-20" />}
          </div>

          <div className="reveal mb-20" data-reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-base bg-card/90 backdrop-blur-sm border border-border p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                  {t.trustTitle}
                </h2>
                <p className="text-muted-foreground mb-5 whitespace-pre-line">
                  {t.trustIntro}
                </p>

                <div className="space-y-3">
                  {trustPoints.map((text, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle size={16} />
                      </div>
                      <div className="text-muted-foreground">{text}</div>
                    </div>
                  ))}
                </div>

                <p className="text-muted-foreground mt-5 whitespace-pre-line">
                  {t.trustOutro}
                </p>
              </div>

              <div className="card-base bg-card/90 backdrop-blur-sm border border-border p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                  {t.servicesTitle}
                </h2>
                <p className="text-muted-foreground mb-5 whitespace-pre-line">
                  {t.servicesIntro}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {serviceItems.map((item, index) => {
                    const IconComponent = item.icon;

                    return (
                      <div
                        key={index}
                        className="card-base flex items-start gap-3 p-4 border border-border bg-background/40"
                      >
                        <div
                          className={`p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 ${item.color}`}
                        >
                          <IconComponent size={18} />
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {item.title}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <details className="mt-6">
                  <summary 
                    className="cursor-pointer select-none text-sm font-medium text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
                    aria-label={t.servicesFullToggle}
                  >
                    {t.servicesFullToggle}
                  </summary>
                  <div className="mt-4 text-muted-foreground whitespace-pre-line">
                    {t.servicesFullText}
                  </div>
                </details>
              </div>
            </div>
          </div>

          <div className="reveal mb-20" data-reveal ref={practiceAreasAnchorRef}>
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {t.practiceAreasTitle}
              </h2>
              <p className="text-muted-foreground max-w-4xl mx-auto">
                {t.practiceAreasIntro}
              </p>
            </div>

            {shouldRenderPracticeAreas ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {practiceAreas.map((area, index) => {
                  const IconComponent = area.icon;

                  return (
                    <div
                      key={index}
                      className="card-base bg-card/90 backdrop-blur-sm border border-border p-6 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-800 ${area.color}`}
                        >
                          <IconComponent size={22} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">{area.title}</div>
                          <div className="text-sm text-muted-foreground mt-2 line-clamp-3">
                            {area.preview}
                          </div>
                          <details className="mt-3">
                            <summary 
                              className="cursor-pointer select-none text-sm font-medium text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
                              aria-label={t.practiceReadMore}
                            >
                              {t.practiceReadMore}
                            </summary>
                            <div className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                              {area.details}
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="min-h-[400px]"></div>
            )}
          </div>
        </div>

        {showCallbackModal && <CallbackModal onClose={() => setShowCallbackModal(false)} />}
      </section>
    </div>
  );
}
