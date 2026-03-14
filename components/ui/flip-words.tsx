"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

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
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
        if (normalizedWords.length <= 1) return
        const interval = window.setInterval(() => {
            setIsVisible(false)
            window.setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % normalizedWords.length)
                setIsVisible(true)
            }, 180)
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
            <span
                key={normalizedWords[currentIndex]}
                className="absolute left-0 top-0 flex w-full h-full items-center justify-center lg:justify-start whitespace-nowrap transition-all duration-200"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(8px)",
                    filter: isVisible ? "blur(0px)" : "blur(4px)",
                }}
            >
                {normalizedWords[currentIndex]}
            </span>
        </span>
    )
}

