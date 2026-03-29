'use client';

import React from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useLocale } from '@/context/LocaleContext';
import { getDictionary } from "@/lib/i18n";
import { EyeOff, Image as ImageIcon, ImageOff, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AccessibilityControls() {
    const { 
        fontSize, setFontSize, 
        contrast, setContrast, 
        images, setImages,
        toggleEnabled
    } = useAccessibility();
    
    const { locale, setLocale } = useLocale();
    const l = getDictionary(locale).accessibilityControls || {
        fontSize: "Размер шрифта",
        colors: "Цвета",
        images: "Изображения",
        normal: "Обычный",
        large: "Крупный",
        extra: "Очень крупный",
        contrastNormal: "Стандарт",
        contrastBW: "Ч/Б",
        contrastWB: "Б/Ч",
        contrastBlue: "Синий",
        imgShow: "Вкл",
        imgHide: "Выкл",
        imgGray: "Ч/Б",
        exit: "Обычная версия",
        language: "Язык",
        langRu: "Рус",
        langEn: "Eng",
        langBy: "Бел"
    };

    return (
        <div className="bg-background border-b-2 border-border p-4 text-foreground w-full" role="region" aria-label="Accessibility Controls">
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
                
                {/* Font Size */}
                <div className="flex flex-col gap-1" role="group" aria-labelledby="font-size-label">
                    <span id="font-size-label" className="text-sm font-bold">{l.fontSize}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setFontSize("normal")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-primary", fontSize === "normal" && "bg-foreground text-background")}
                            aria-label={l.normal}
                            aria-pressed={fontSize === "normal"}
                        >
                            A
                        </button>
                        <button 
                            onClick={() => setFontSize("large")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold text-lg hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-primary", fontSize === "large" && "bg-foreground text-background")}
                            aria-label={l.large}
                            aria-pressed={fontSize === "large"}
                        >
                            A
                        </button>
                        <button 
                            onClick={() => setFontSize("extra")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold text-xl hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-primary", fontSize === "extra" && "bg-foreground text-background")}
                            aria-label={l.extra}
                            aria-pressed={fontSize === "extra"}
                        >
                            A
                        </button>
                    </div>
                </div>

                {/* Contrast */}
                <div className="flex flex-col gap-1" role="group" aria-labelledby="contrast-label">
                    <span id="contrast-label" className="text-sm font-bold">{l.colors}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setContrast("normal")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold bg-white text-black hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-primary", contrast === "normal" && "ring-2 ring-offset-2 ring-foreground")}
                            aria-label={l.contrastNormal}
                            aria-pressed={contrast === "normal"}
                        >
                            C
                        </button>
                        <button 
                            onClick={() => setContrast("black-white")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold bg-white text-black hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-primary", contrast === "black-white" && "ring-2 ring-offset-2 ring-foreground")}
                            aria-label={l.contrastBW}
                            aria-pressed={contrast === "black-white"}
                        >
                            C
                        </button>
                        <button 
                            onClick={() => setContrast("white-black")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold bg-black text-white hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-primary", contrast === "white-black" && "ring-2 ring-offset-2 ring-foreground")}
                            aria-label={l.contrastWB}
                            aria-pressed={contrast === "white-black"}
                        >
                            C
                        </button>
                         <button 
                            onClick={() => setContrast("blue-dark")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold bg-[#9dd1ff] text-[#063462] hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-primary", contrast === "blue-dark" && "ring-2 ring-offset-2 ring-foreground")}
                            aria-label={l.contrastBlue}
                            aria-pressed={contrast === "blue-dark"}
                        >
                            C
                        </button>
                    </div>
                </div>

                {/* Images */}
                <div className="flex flex-col gap-1" role="group" aria-labelledby="images-label">
                    <span id="images-label" className="text-sm font-bold">{l.images}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setImages("show")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-primary", images === "show" && "bg-foreground text-background")}
                            aria-label={l.imgShow}
                            aria-pressed={images === "show"}
                        >
                            <ImageIcon size={20} />
                        </button>
                        <button 
                            onClick={() => setImages("grayscale")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-primary", images === "grayscale" && "bg-foreground text-background")}
                            aria-label={l.imgGray}
                            aria-pressed={images === "grayscale"}
                        >
                            <Monitor size={20} />
                        </button>
                        <button 
                            onClick={() => setImages("hide")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-primary", images === "hide" && "bg-foreground text-background")}
                            aria-label={l.imgHide}
                            aria-pressed={images === "hide"}
                        >
                            <ImageOff size={20} />
                        </button>
                    </div>
                </div>

                {/* Language */}
                <div className="flex flex-col gap-1" role="group" aria-labelledby="language-label">
                    <span id="language-label" className="text-sm font-bold">{l.language}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setLocale("ru")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-primary", locale === "ru" && "bg-foreground text-background")}
                            aria-label={l.langRu}
                            aria-pressed={locale === "ru"}
                        >
                            {l.langRu}
                        </button>
                        <button 
                            onClick={() => setLocale("by")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-primary", locale === "by" && "bg-foreground text-background")}
                            aria-label={l.langBy}
                            aria-pressed={locale === "by"}
                        >
                            {l.langBy}
                        </button>
                        <button 
                            onClick={() => setLocale("en")}
                            className={cn("px-3 py-1 border-2 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-primary", locale === "en" && "bg-foreground text-background")}
                            aria-label={l.langEn}
                            aria-pressed={locale === "en"}
                        >
                            {l.langEn}
                        </button>
                    </div>
                </div>

                {/* Exit Button */}
                <div className="ml-auto">
                    <button 
                        onClick={toggleEnabled}
                        className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-bold border-2 border-transparent hover:bg-background hover:text-foreground hover:border-foreground transition-colors focus:outline-none focus:ring-4 focus:ring-primary"
                        aria-label={l.exit}
                    >
                        <EyeOff size={20} />
                        <span>{l.exit}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
