// app/page.tsx

import HomeClient from "@/components/HomeClient";
import { cookies } from "next/headers";
import { getDictionary, parseLocale } from "@/lib/i18n";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pidlozhevich.by";

export default async function Home() {
    const cookieStore = await cookies();
    const locale = parseLocale(cookieStore.get("NEXT_LOCALE")?.value);
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
