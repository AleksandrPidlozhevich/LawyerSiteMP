"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const YM_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
const LOAD_DELAY_MS = 8000;

declare global {
  interface Window {
    ym?: (id: string | number | undefined, ...args: unknown[]) => void;
  }
}

export default function YandexMetrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);
  const lastUrlRef = useRef<string>("/");
  const idleHandleRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenersBoundRef = useRef(false);

  useEffect(() => {
    if (!YM_ID || process.env.NODE_ENV !== "production" || initializedRef.current) return;

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

      const boot = () => {
        if (typeof window === "undefined") return;

        const scriptSrc = `https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}`;
        window.ym =
          window.ym ||
          function (...args: unknown[]) {
            ((window.ym as unknown as { a?: unknown[] }).a = (window.ym as unknown as { a?: unknown[] }).a || []).push(args);
          };
        (window.ym as unknown as { l?: number }).l = Number(new Date());

        const alreadyInjected = Array.from(document.scripts).some((script) => script.src === scriptSrc);
        if (!alreadyInjected) {
          const script = document.createElement("script");
          script.async = true;
          script.src = scriptSrc;
          document.head.appendChild(script);
        }

        window.ym(YM_ID, "init", {
          ssr: true,
          webvisor: true,
          clickmap: true,
          referrer: document.referrer,
          url: location.href,
          accurateTrackBounce: true,
          trackLinks: true,
        });

        window.ym(YM_ID, "hit", lastUrlRef.current);
      };

      if (typeof window.requestIdleCallback === "function") {
        idleHandleRef.current = window.requestIdleCallback(() => boot());
      } else {
        boot();
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
      if (idleHandleRef.current !== null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandleRef.current);
        idleHandleRef.current = null;
      }
      if (listenersBoundRef.current) {
        window.removeEventListener("pointerdown", run);
        window.removeEventListener("keydown", run);
        window.removeEventListener("scroll", run);
        window.removeEventListener("touchstart", run);
        listenersBoundRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    const query = searchParams?.toString();
    const url = `${pathname}${query ? `?${query}` : ""}`;
    lastUrlRef.current = url;
    if (initializedRef.current) {
      window.ym?.(YM_ID, "hit", url);
    }
  }, [pathname, searchParams]);

  return null;
}
