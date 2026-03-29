"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const LOAD_DELAY_MS = 6000;

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: Array<unknown>;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);
  const listenersBoundRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!GA_ID || process.env.NODE_ENV !== "production" || initializedRef.current) return;

    const run = () => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      if (listenersBoundRef.current) {
        window.removeEventListener("pointerdown", run);
        window.removeEventListener("keydown", run);
        window.removeEventListener("scroll", run);
        window.removeEventListener("touchstart", run);
        listenersBoundRef.current = false;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      });

      const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      const alreadyInjected = Array.from(document.scripts).some((script) => script.src === scriptSrc);
      
      if (!alreadyInjected) {
        const script = document.createElement("script");
        script.async = true;
        script.src = scriptSrc;
        document.head.appendChild(script);
      }
    };

    timeoutRef.current = setTimeout(run, LOAD_DELAY_MS);
    window.addEventListener("pointerdown", run, { once: true, passive: true });
    window.addEventListener("keydown", run, { once: true });
    window.addEventListener("scroll", run, { once: true, passive: true });
    window.addEventListener("touchstart", run, { once: true, passive: true });
    listenersBoundRef.current = true;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (listenersBoundRef.current) {
        window.removeEventListener("pointerdown", run);
        window.removeEventListener("keydown", run);
        window.removeEventListener("scroll", run);
        window.removeEventListener("touchstart", run);
      }
    };
  }, []);
  
  useEffect(() => {
    if (initializedRef.current && window.gtag && GA_ID) {
      window.gtag("config", GA_ID, {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      });
    }
  }, [pathname, searchParams]);

  return null;
}
