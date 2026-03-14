"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: Array<unknown>;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;

    const load = () => setShouldLoad(true);
    const timeoutId = window.setTimeout(load, 12000);
    const options: AddEventListenerOptions = { once: true, passive: true };

    window.addEventListener("pointerdown", load, options);
    window.addEventListener("keydown", load, { once: true });
    window.addEventListener("scroll", load, options);
    window.addEventListener("touchstart", load, options);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
      window.removeEventListener("scroll", load);
      window.removeEventListener("touchstart", load);
    };
  }, []);

  useEffect(() => {
    if (GA_ID && shouldLoad && window.gtag) {
      window.gtag("config", GA_ID, {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      });
    }
  }, [pathname, searchParams, shouldLoad]);

  if (!GA_ID || !shouldLoad) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
