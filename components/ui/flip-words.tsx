"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

type FlipWordsProps = Omit<React.ComponentProps<"span">, "children"> & {
    words: string[]
    duration?: number
}

export function FlipWords({
                              ref,
                              words,
                              duration = 4000,
                              className,
                              ...props
                          }: FlipWordsProps) {
    const localRef = React.useRef<HTMLSpanElement>(null)
    React.useImperativeHandle(ref, () => localRef.current as HTMLSpanElement)
    const normalizedWords = React.useMemo(() => (words.length > 0 ? words : [""]), [words])

    const [currentIndex, setCurrentIndex] = React.useState(0)

    React.useEffect(() => {
        if (normalizedWords.length <= 1) return
        const interval = window.setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % normalizedWords.length)
        }, duration)
        return () => window.clearInterval(interval)
    }, [normalizedWords, duration])

    return (
        <span
            ref={localRef}
            {...props}
            className={cn("inline-flex relative w-full h-full items-center justify-center lg:justify-start", className)}
            style={{
                display: "inline-block",
                position: "relative",
                width: "100%",
                height: "100%",
            }}
        >
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={normalizedWords[currentIndex]}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { 
                            opacity: 1, 
                            transition: { staggerChildren: 0.04 } 
                        },
                        exit: { 
                            opacity: 0, 
                            transition: { staggerChildren: 0.015, staggerDirection: 1 } 
                        },
                    }}
                    className="absolute left-0 top-0 flex w-full h-full items-center justify-center lg:justify-start whitespace-nowrap"
                >
                    {normalizedWords[currentIndex].split("").map((letter, index) => (
                        <motion.span
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 15, scale: 0.9 },
                                visible: { 
                                    opacity: 1, 
                                    y: 0, 
                                    scale: 1,
                                    transition: { type: "spring", damping: 14, stiffness: 150 }
                                },
                                exit: { 
                                    opacity: 0, 
                                    y: -15, 
                                    scale: 0.9,
                                    transition: { duration: 0.2, ease: "easeInOut" }
                                },
                            }}
                            className="inline-block"
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                    ))}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

