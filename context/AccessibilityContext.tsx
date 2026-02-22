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

    const applySettings = useCallback((enabled: boolean, fs: FontSize, cnt: Contrast, img: ImagesMode) => {
        if (typeof document === 'undefined') return;

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
    }, []);

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
