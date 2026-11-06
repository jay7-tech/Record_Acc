'use client';

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@&%?!';

export function TextDecoder({ text, className }: { text: string; className?: string }) {
    const [displayText, setDisplayText] = useState(text);
    const [isDecoding, setIsDecoding] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView && !isDecoding) {
            setIsDecoding(true);
            let iteration = 0;
            const interval = setInterval(() => {
                setDisplayText((prev) =>
                    text
                        .split('')
                        .map((char, index) => {
                            if (index < iteration) {
                                return text[index];
                            }
                            return characters[Math.floor(Math.random() * characters.length)];
                        })
                        .join('')
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 35);
        }
    }, [isInView, text, isDecoding]);

    return (
        <span
            ref={ref}
            className={`${className} inline-block whitespace-nowrap`}
        >
            {displayText}
        </span>
    );
}
