'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export type FontSize = "normal" | "large" | "extra";
export type Contrast = "normal" | "black-white" | "white-black" | "blue-dark";
export type ImagesMode = "show" | "hide" | "grayscale";

export interface AccessibilityContextProps {
    isEnabled: boolean;
    fontSize: FontSize;
    contrast: Contrast;
    images: ImagesMode;
    toggleEnabled: () => void;
    setFontSize: (size: FontSize) => void;
    setContrast: (contrast: Contrast) => void;
    setImages: (mode: ImagesMode) => void;
    resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps>({
    isEnabled: false,
    fontSize: "normal",
    contrast: "normal",
    images: "show",
    toggleEnabled: () => {},
    setFontSize: () => {},
    setContrast: () => {},
    setImages: () => {},
    resetSettings: () => {},
});

const A11Y_STYLE_ID = "a11y-mode-styles";
const A11Y_STYLES = `
.a11y {
    --background: oklch(1 0 0);
    --foreground: oklch(0.1 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.1 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.1 0 0);
    --primary: oklch(0.12 0 0);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.92 0 0);
    --secondary-foreground: oklch(0.1 0 0);
    --muted: oklch(0.92 0 0);
    --muted-foreground: oklch(0.3 0 0);
    --accent: oklch(0.15 0 0 / 0.12);
    --accent-foreground: oklch(0.1 0 0);
    --destructive: oklch(0.5 0.2 27.3);
    --border: oklch(0.8 0 0);
    --input: oklch(0.85 0 0);
    --ring: oklch(0.2 0 0);
}

.skip-link {
    position: absolute;
    top: -9999px;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    color: #fff;
    padding: 1rem;
    z-index: 9999;
    text-decoration: none;
    font-weight: bold;
    border-radius: 0 0 8px 8px;
}

.skip-link:focus {
    top: 0;
    outline: 3px solid #fbbf24;
}

.a11y {
    font-size: 20px;
}

.a11y body {
    line-height: 1.8;
    font-size: 1rem;
}

@media (max-width: 768px) {
    .a11y {
        font-size: 18px;
    }

    .a11y body {
        line-height: 1.7;
    }
}

.a11y a {
    text-decoration: underline;
    text-underline-offset: 3px;
}

.a11y :focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
}

.a11y .backdrop-blur-sm {
    backdrop-filter: none;
}

.a11y .card-base {
    box-shadow: none;
    border: 2px solid var(--border);
    background: var(--card);
}

.a11y .reveal {
    opacity: 1;
    transform: none;
    transition: none;
}

.a11y .bg-background\\/40,
.a11y .bg-background\\/50,
.a11y .bg-background\\/60,
.a11y .bg-background\\/90 {
    background-color: var(--background);
}

.a11y.fs-large {
    font-size: 24px;
}

.a11y.fs-extra {
    font-size: 28px;
}

.a11y.cnt-bw {
    --background: #ffffff;
    --foreground: #000000;
    --card: #ffffff;
    --card-foreground: #000000;
    --popover: #ffffff;
    --popover-foreground: #000000;
    --primary: #000000;
    --primary-foreground: #ffffff;
    --secondary: #f0f0f0;
    --secondary-foreground: #000000;
    --muted: #f0f0f0;
    --muted-foreground: #666666;
    --accent: #e0e0e0;
    --accent-foreground: #000000;
    --destructive: #cc0000;
    --border: #000000;
    --input: #000000;
    --ring: #000000;
    filter: grayscale(100%);
}

.a11y.cnt-wb {
    --background: #000000;
    --foreground: #ffffff;
    --card: #000000;
    --card-foreground: #ffffff;
    --popover: #000000;
    --popover-foreground: #ffffff;
    --primary: #ffffff;
    --primary-foreground: #000000;
    --secondary: #333333;
    --secondary-foreground: #ffffff;
    --muted: #333333;
    --muted-foreground: #aaaaaa;
    --accent: #444444;
    --accent-foreground: #ffffff;
    --destructive: #ff6666;
    --border: #ffffff;
    --input: #ffffff;
    --ring: #ffffff;
}

.a11y.cnt-bd {
    --background: #063462;
    --foreground: #9dd1ff;
    --card: #063462;
    --card-foreground: #9dd1ff;
    --popover: #063462;
    --popover-foreground: #9dd1ff;
    --primary: #9dd1ff;
    --primary-foreground: #063462;
    --secondary: #0a4b8f;
    --secondary-foreground: #9dd1ff;
    --muted: #0a4b8f;
    --muted-foreground: #6baed6;
    --accent: #0d5aa6;
    --accent-foreground: #9dd1ff;
    --destructive: #ff6666;
    --border: #9dd1ff;
    --input: #9dd1ff;
    --ring: #9dd1ff;
}

.img-hide img,
.img-hide video,
.img-hide .bg-image {
    display: none !important;
}

.img-gray img,
.img-gray video,
.img-gray .bg-image {
    filter: grayscale(100%) !important;
}

.a11y *,
.a11y *::before,
.a11y *::after {
    transition: none !important;
    animation: none !important;
}

.a11y-content {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--background);
    color: var(--foreground);
    border: 2px solid var(--border);
    padding: 2rem;
}
`;

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<{
        isEnabled: boolean;
        fontSize: FontSize;
        contrast: Contrast;
        images: ImagesMode;
    }>({
        isEnabled: false,
        fontSize: "normal",
        contrast: "normal",
        images: "show",
    });

    const { isEnabled, fontSize, contrast, images } = settings;

    const ensureStyles = useCallback(() => {
        if (typeof document === "undefined") return;
        if (document.getElementById(A11Y_STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = A11Y_STYLE_ID;
        style.textContent = A11Y_STYLES;
        document.head.appendChild(style);
    }, []);

    const applySettings = useCallback((enabled: boolean, fs: FontSize, cnt: Contrast, img: ImagesMode) => {
        if (typeof document === 'undefined') return;

        if (enabled) {
            ensureStyles();
        }

        const root = document.documentElement;
        const body = document.body;
        
        // Remove existing a11y classes
        const classesToRemove = [
            "a11y", 
            "fs-normal", "fs-large", "fs-extra", 
            "cnt-normal", "cnt-bw", "cnt-wb", "cnt-bd", 
            "img-show", "img-hide", "img-gray"
        ];
        root.classList.remove(...classesToRemove);
        body.classList.remove(...classesToRemove);

        if (enabled) {
            root.classList.add("a11y");
            body.classList.add("a11y");
            
            // Font Size
            const fsClass = `fs-${fs}`;
            root.classList.add(fsClass);
            body.classList.add(fsClass);

            // Contrast
            let cntClass = "cnt-normal";
            if (cnt === "black-white") cntClass = "cnt-bw";
            else if (cnt === "white-black") cntClass = "cnt-wb";
            else if (cnt === "blue-dark") cntClass = "cnt-bd";
            root.classList.add(cntClass);
            body.classList.add(cntClass);

            // Images
            let imgClass = "img-show";
            if (img === "hide") imgClass = "img-hide";
            else if (img === "grayscale") imgClass = "img-gray";
            root.classList.add(imgClass);
            body.classList.add(imgClass);
        }
    }, [ensureStyles]);

    // Load settings from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedEnabled = localStorage.getItem("a11y_enabled") === "true";
            const savedFontSize = (localStorage.getItem("a11y_fontSize") as FontSize) || "normal";
            const savedContrast = (localStorage.getItem("a11y_contrast") as Contrast) || "normal";
            const savedImages = (localStorage.getItem("a11y_images") as ImagesMode) || "show";

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSettings({
                isEnabled: savedEnabled,
                fontSize: savedFontSize,
                contrast: savedContrast,
                images: savedImages
            });
            
            applySettings(savedEnabled, savedFontSize, savedContrast, savedImages);
        }
    }, [applySettings]);

    const updateSetting = (key: string, value: string) => {
        localStorage.setItem(key, value);
    };

    const toggleEnabled = () => {
        const next = !isEnabled;
        setSettings(prev => ({ ...prev, isEnabled: next }));
        updateSetting("a11y_enabled", String(next));
        applySettings(next, fontSize, contrast, images);
    };

    const handleSetFontSize = (size: FontSize) => {
        setSettings(prev => ({ ...prev, fontSize: size }));
        updateSetting("a11y_fontSize", size);
        applySettings(isEnabled, size, contrast, images);
    };

    const handleSetContrast = (cnt: Contrast) => {
        setSettings(prev => ({ ...prev, contrast: cnt }));
        updateSetting("a11y_contrast", cnt);
        applySettings(isEnabled, fontSize, cnt, images);
    };

    const handleSetImages = (mode: ImagesMode) => {
        setSettings(prev => ({ ...prev, images: mode }));
        updateSetting("a11y_images", mode);
        applySettings(isEnabled, fontSize, contrast, mode);
    };

    const resetSettings = () => {
        setSettings({
            isEnabled: false,
            fontSize: "normal",
            contrast: "normal",
            images: "show",
        });
        localStorage.removeItem("a11y_enabled");
        localStorage.removeItem("a11y_fontSize");
        localStorage.removeItem("a11y_contrast");
        localStorage.removeItem("a11y_images");
        applySettings(false, "normal", "normal", "show");
    };

    return (
        <AccessibilityContext.Provider value={{
            isEnabled,
            fontSize,
            contrast,
            images,
            toggleEnabled,
            setFontSize: handleSetFontSize,
            setContrast: handleSetContrast,
            setImages: handleSetImages,
            resetSettings,
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export const useAccessibility = () => useContext(AccessibilityContext);
