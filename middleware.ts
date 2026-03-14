import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = new Set(['ru', 'en', 'by']);

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const normalizedPathname = pathname.replace(/[)\]]+$/g, '') || '/';

    if (normalizedPathname !== pathname) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = normalizedPathname;
        return NextResponse.redirect(redirectUrl, 308);
    }

    const lang = request.nextUrl.searchParams.get('lang');

    if (!lang || !supportedLocales.has(lang)) {
        return NextResponse.next();
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('accept-language', lang);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.cookies.set('NEXT_LOCALE', lang, { path: '/', sameSite: 'lax' });
    return response;
}

export const config = {
    matcher: ['/((?!_next|.*\\..*).*)'],
};
