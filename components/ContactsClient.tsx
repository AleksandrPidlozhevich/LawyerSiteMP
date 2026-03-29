"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { useLocale } from '@/context/LocaleContext';
import { useAccessibility } from "@/context/AccessibilityContext";
import { getDictionary } from '@/lib/i18n';
import { useEffect, useMemo, useState } from 'react';

export default function ContactsClient() {
    const { locale } = useLocale();
    const { isEnabled } = useAccessibility();
    const t = getDictionary(locale);
    const contactItems = useMemo(() => [
        {
            icon: Phone,
            label: t.phone,
            value: "+375 (29) 779-88-27",
            href: "tel:+375297798827",
            color: "text-green-600 dark:text-green-400"
        },
        {
            icon: Mail,
            label: t.email,
            value: "pidlogevich@gmail.com",
            href: "mailto:pidlogevich@gmail.com",
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            icon: MapPin,
            label: t.officeAddress,
            value: t.address,
            href: null,
            color: "text-red-600 dark:text-red-400"
        },
        {
            icon: Clock,
            label: t.workingHours,
            value: t.workingHoursText,
            href: null,
            color: "text-purple-600 dark:text-purple-400"
        }
    ], [t]);

    const mapLinks = useMemo(() => ({
        yandex: "https://yandex.by/maps/org/advokat_pidlozhevich_nikolay_yevstafyevich/235297475101/?utm_medium=mapframe&utm_source=maps",
        google: "https://www.google.com/maps/place/Bronevoi+6,+Minsk,+Minskaja+voblas%C4%87,+Belarus/@53.90476544152037,27.579465151655672,20z"
    }), []);

    const animationVariants = {
        header: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } },
        contactInfo: { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2, duration: 0.6 } },
        maps: { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4, duration: 0.6 } }
    };
    const [mapsReady, setMapsReady] = useState(() => {
        if (typeof window === "undefined") {
            return { yandex: false, google: false };
        }
        if (!("IntersectionObserver" in window)) {
            return { yandex: true, google: true };
        }
        return { yandex: false, google: false };
    });

    useEffect(() => {
        if (isEnabled) return; // Skip in a11y mode

        const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "1700px 0px", threshold: 0.05 },
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [isEnabled]);

    useEffect(() => {
        if (isEnabled) return; // Skip in a11y mode
        if (!("IntersectionObserver" in window)) return;
        const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-map]"));
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const target = entry.target;
                    if (!(target instanceof HTMLElement)) return;
                    const key = target.dataset.map;
                    if (key === "yandex" || key === "google") {
                        setMapsReady((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
                        observer.unobserve(target);
                    }
                });
            },
            { rootMargin: "1700px 0px", threshold: 0.01 },
        );

        targets.forEach((target) => observer.observe(target));
        return () => observer.disconnect();
    }, [isEnabled]);

    if (isEnabled) {
        return (
            <div className="space-y-8 py-8">
                <h1 className="text-4xl font-bold mb-4">{t.contactsTitle}</h1>
                <p className="text-xl mb-8">{t.contactsSubtitle}</p>
                
                <section aria-labelledby="contact-info-heading">
                    <h2 id="contact-info-heading" className="text-2xl font-bold mb-6">{t.contactInfo}</h2>
                    <ul className="space-y-6">
                        {contactItems.map((item, index) => (
                            <li key={index} className="flex flex-col gap-2 border-b-2 border-current pb-4">
                                 <div className="font-bold text-xl flex items-center gap-2">
                                     {item.label}
                                 </div>
                                 {item.href ? (
                                     <a href={item.href} className="text-xl underline hover:no-underline font-semibold">{item.value}</a>
                                 ) : (
                                     <div className="text-xl">{item.value}</div>
                                 )}
                            </li>
                        ))}
                    </ul>
                </section>
    
                <section aria-labelledby="maps-heading">
                     <h2 id="maps-heading" className="text-2xl font-bold mb-6">{t.yandexMaps} / {t.googleMaps}</h2>
                     <div className="flex flex-col gap-4">
                         <a href={mapLinks.yandex} target="_blank" rel="noopener noreferrer" className="text-xl underline font-bold block p-4 border-2 border-current hover:bg-black hover:text-white text-center">
                             {t.openInYandex}
                         </a>
                         <a href={mapLinks.google} target="_blank" rel="noopener noreferrer" className="text-xl underline font-bold block p-4 border-2 border-current hover:bg-black hover:text-white text-center">
                             {t.openInGoogle}
                         </a>
                     </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <motion.div
                {...animationVariants.header}
                className="reveal bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-16"
                data-reveal
            >
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            {t.contactsTitle}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {t.contactsSubtitle}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div {...animationVariants.contactInfo} className="reveal" data-reveal>
                        <h2 className="text-2xl font-semibold text-foreground mb-8">
                            {t.contactInfo}
                        </h2>
                        
                        <div className="space-y-6">
                            {contactItems.map((item, index) => {
                                const IconComponent = item.icon;
                                const content = (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                        className={`card-base flex items-start gap-4 p-6 border border-border bg-card transition-all duration-300 ${
                                            item.href ? 'cursor-pointer hover:scale-[1.02]' : ''
                                        }`}
                                    >
                                        <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-800 ${item.color}`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground mb-1">
                                                {item.label}
                                            </h3>
                                            <p className="text-muted-foreground whitespace-pre-line">
                                                {item.value}
                                            </p>
                                        </div>
                                        {item.href && (
                                            <ExternalLink size={16} className="text-muted-foreground" />
                                        )}
                                    </motion.div>
                                );

                                return item.href ? (
                                    <a key={index} href={item.href} aria-label={`${item.label}: ${item.value}`}>
                                        {content}
                                    </a>
                                ) : (
                                    content
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Maps Section */}
                    <motion.div {...animationVariants.maps} className="reveal space-y-8" data-reveal>
                        {/* Yandex Maps */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-foreground">
                                    {t.yandexMaps}
                                </h3>
                                <a
                                    href={mapLinks.yandex}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={t.openInYandex}
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                    {t.openInYandex}
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className="card-base relative overflow-hidden border border-border" data-map="yandex">
                                {mapsReady.yandex ? (
                                    <iframe 
                                        src="https://yandex.by/map-widget/v1/?ll=27.579988%2C53.904926&mode=poi&poi%5Bpoint%5D=27.579742%2C53.904936&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D235297475101&z=17" 
                                        width="100%" 
                                        height="300" 
                                        frameBorder="0" 
                                        allowFullScreen={true} 
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        title={`${t.yandexMaps} - ${t.officeAddress}`}
                                    />
                                ) : (
                                    <div className="h-[300px] w-full bg-muted/30" />
                                )}
                            </div>
                        </div>

                        {/* Google Maps */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-foreground">
                                    {t.googleMaps}
                                </h3>
                                <a
                                    href={mapLinks.google}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={t.openInGoogle}
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                    {t.openInGoogle}
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className="card-base relative overflow-hidden border border-border" data-map="google">
                                {mapsReady.google ? (
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d329.7959371992532!2d27.579465151655672!3d53.90476544152037!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfb9e9d2989f%3A0xde397e96fc7bc989!2sBronevoi%206%2C%20Minsk%2C%20Minskaja%20voblas%C4%87%2C%20Belarus!5e0!3m2!1sen!2spl!4v1759661693259!5m2!1sen!2spl"
                                        width="100%"
                                        height="300"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`${t.googleMaps} - ${t.officeAddress}`}
                                    />
                                ) : (
                                    <div className="h-[300px] w-full bg-muted/30" />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
