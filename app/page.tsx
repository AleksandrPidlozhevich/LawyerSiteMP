// app/page.tsx

import HomeClient from "@/components/HomeClient";
import { cookies, headers } from "next/headers";
import { getBaseUrl, getDictionary, resolveLocale } from "@/lib/i18n";

const BASE_URL = getBaseUrl();

export default async function Home() {
    const cookieStore = await cookies();
    const headerList = await headers();
    const locale = resolveLocale(cookieStore.get("NEXT_LOCALE")?.value, headerList.get("accept-language"));
    const t = getDictionary(locale);

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": t.home,
                "item": `${BASE_URL}/`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <HomeClient />
        </>
    );
}
