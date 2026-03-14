"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function GoogleTagManager() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!GTM_ID) return;

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

  if (!GTM_ID || !shouldLoad) return null;

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
      >
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
