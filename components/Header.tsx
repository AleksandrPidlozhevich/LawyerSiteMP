'use client';

import * as React from 'react';
import {useEffect, useId, useRef, useState} from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import {Eye, FileTextIcon, GlobeIcon, HomeIcon, MenuIcon, PhoneIcon, ScaleIcon, X} from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from '@/components/ui/navigation-menu';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetDescription} from "@/components/ui/sheet";
import {cn} from '@/lib/utils';
import ThemeToggle from "./ThemeToggle";
import {useLocale} from '@/context/LocaleContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getDictionary } from "@/lib/i18n";

interface NavItem {
    href: string;
    key: 'home' | 'blog' | 'contact';
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
    {href: "/", key: 'home', icon: HomeIcon},
    {href: "/blog", key: 'blog', icon: FileTextIcon},
    {href: "/contacts", key: 'contact', icon: PhoneIcon},
];

const languages = [
    {value: "ru", label: "Рус"},
    {value: "by", label: "Бел"},
    {value: "en", label: "Eng"},
];

interface HeaderProps {
    isHidden?: boolean;
}

export function Header({ isHidden = false }: HeaderProps) {
    const {locale, setLocale} = useLocale();
    const { isEnabled, toggleEnabled } = useAccessibility();
    const pathname = usePathname();
    const t = getDictionary(locale);

    const openMenuLabel = locale === 'ru' ? 'Открыть меню' : locale === 'en' ? 'Open menu' : 'Адкрыць меню';
    const closeMenuLabel = locale === 'ru' ? 'Закрыть меню' : locale === 'en' ? 'Close menu' : 'Закрыць меню';
    const languageSelectLabel = locale === 'ru' ? 'Выбор языка' : locale === 'en' ? 'Select language' : 'Выбар мовы';
    const a11yLabel = locale === 'ru' ? 'Версия для слабовидящих' : locale === 'en' ? 'Low vision mode' : 'Версія для людзей са слабым зрокам';
    const themeLabel = locale === 'ru' ? 'Тема' : locale === 'en' ? 'Theme' : 'Тэма';

    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const selectId = useId();

    useEffect(() => {
        const checkWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setIsMobile(width < 768);
            }
        };
        checkWidth();
        const resizeObserver = new ResizeObserver(checkWidth);
        if (containerRef.current) resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Hide the header in the mobile version when isHidden = true
    if (isHidden && isMobile) {
        return null;
    }

    return (
        <header
            ref={containerRef}
            className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6")}
        >
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">

                {/* Left block: logo */}
                <Link
                    href="/"
                    onClick={() => {
                        if (pathname === '/') {
                            window.location.reload();
                        }
                    }}
                    className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-colors"
                    aria-label={t.logo}
                >
                    <ScaleIcon size={24} aria-hidden="true" />
                    {/* Mobile version: two words in a line*/}
                    <span className="flex flex-col sm:hidden leading-tight" aria-hidden="true">
                        {t.logo.split(" ").reduce<string[][]>((acc, word, i) => {
                            if (i % 2 === 0) {
                                acc.push([word]);
                            } else {
                                acc[acc.length - 1].push(word);
                            }
                            return acc;
                        }, []).map((pair, idx) => (<span key={idx}>{pair.join(" ")}</span>
                        ))}
                    </span>

                    {/* Desktop version */}
                    <span className="hidden sm:inline" aria-hidden="true">{t.logo}</span>
                </Link>

                <div className="flex items-center gap-4">
                    {!isMobile && (
                        <>
                            <NavigationMenu>
                                <NavigationMenuList className="gap-2">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;
                                        return (
                                            <NavigationMenuItem key={item.href}>
                                                <NavigationMenuLink
                                                    asChild
                                                    active={isActive}
                                                    className={cn(
                                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                                        isActive && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    <Link 
                                                        href={item.href}
                                                        aria-current={isActive ? 'page' : undefined}
                                                    >
                                                        <Icon size={16} aria-hidden="true" />
                                                        <span>{t[item.key]}</span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        );
                                    })}
                                </NavigationMenuList>
                            </NavigationMenu>

                            <ThemeToggle/>
                            <button
                                type="button"
                                aria-label={a11yLabel}
                                aria-pressed={isEnabled}
                                onClick={toggleEnabled}
                                className={cn(
                                    "h-9 w-9 min-h-9 min-w-9 shrink-0 rounded-md border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground transition-colors inline-flex items-center justify-center leading-none",
                                    isEnabled && "bg-accent text-accent-foreground"
                                )}
                            >
                                <Eye size={16} />
                            </button>

                            <Select value={locale} onValueChange={(v) => setLocale(v as "ru" | "en" | "by")}>
                                <SelectTrigger
                                    id={`language-${selectId}`}
                                    aria-label={languageSelectLabel}
                                    className="h-8 border-none px-2 shadow-none hover:bg-accent hover:text-accent-foreground"
                                >
                                    <GlobeIcon size={16}/>
                                    <SelectValue className="hidden sm:inline-flex"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    {/* Mobile menu */}
                    {isMobile && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <button
                                    type="button"
                                    aria-label={openMenuLabel}
                                    className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                                >
                                    <MenuIcon size={20}/>
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-64 bg-white dark:bg-gray-950 border-l border-border">
                                <SheetHeader className="flex flex-row items-center justify-between">
                                    <SheetTitle>{t.menuTitle}</SheetTitle>
                                    <SheetDescription className="sr-only">
                                        {t.menuTitle}
                                    </SheetDescription>
                                    <SheetClose asChild>
                                        <button
                                            type="button"
                                            aria-label={closeMenuLabel}
                                            className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </SheetClose>
                                </SheetHeader>
                                <nav className="flex flex-col gap-2 mt-4">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;
                                        return (
                                            <SheetClose asChild key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    aria-current={isActive ? 'page' : undefined}
                                                    className={cn(
                                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                                        isActive && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    <Icon size={16} aria-hidden="true" />
                                                    <span>{t[item.key]}</span>
                                                </Link>
                                            </SheetClose>
                                        );
                                    })}
                                </nav>

                                <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-border">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-sm font-medium">{themeLabel}</span>
                                        <ThemeToggle />
                                    </div>

                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-sm font-medium">{a11yLabel}</span>
                                        <button
                                            type="button"
                                            aria-label={a11yLabel}
                                            aria-pressed={isEnabled}
                                            onClick={toggleEnabled}
                                            className={cn(
                                                "h-9 w-9 min-h-9 min-w-9 shrink-0 rounded-md border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground transition-colors inline-flex items-center justify-center leading-none",
                                                isEnabled && "bg-accent text-accent-foreground"
                                            )}
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-sm font-medium">{languageSelectLabel}</span>
                                        <Select value={locale} onValueChange={(v) => setLocale(v as "ru" | "en" | "by")}>
                                            <SelectTrigger className="w-[100px]">
                                                <GlobeIcon size={16} className="mr-2"/>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {languages.map((lang) => (
                                                    <SelectItem key={lang.value} value={lang.value}>
                                                        {lang.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}
                </div>
            </div>
        </header>
    );
}
