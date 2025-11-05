"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


gsap.registerPlugin(useGSAP);

export type DecryptHandle = {
  tl: gsap.core.Timeline | null;
  play: () => void;
  reverse: () => void;
  seek: (timeOrLabel: number | string) => void;
};

interface DecryptingTypewriterProps {
  text: string;
  className?: string;
  // seconds per character (controls overall speed)
  perChar?: number;
  // fraction of each character’s slot to show scramble before locking the real char (0..1)
  scramblePhase?: number;
  // characters to scramble with
  charset?: string;
}

const DEFAULT_CHARS = "!<>-_\\/[]{}—=+*^?#_";

const DecryptingTypewriter = forwardRef<DecryptHandle, DecryptingTypewriterProps>(
  (
    {
      text,
      className,
      perChar,
      scramblePhase,
      charset = DEFAULT_CHARS,
    },
    ref
  ) => {
    const el = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useGSAP(
      () => {
        // Kill any prior timeline for prop changes
        tlRef.current?.kill();
        const letters = Array.from(text);
        const proxy = { index: 0 }; // will tween 0 -> letters.length
        const total = letters.length;
        let totalDuration
        if(perChar){
          totalDuration = Math.max(0.0001, total * perChar);
        }

        const randChar = () => charset[Math.floor(Math.random() * charset.length)] || "";

        const tl = gsap.timeline({ paused: true });

        tl.to(proxy, {
          index: total,
          duration: totalDuration,
          ease: "none",
          onUpdate: () => {
            // Determine how many characters are “finalized” and whether the current slot is still scrambling
            const i = Math.floor(proxy.index);
            const frac = proxy.index - i;
            let out = letters.slice(0, i).join("");

            if (i < total && scramblePhase) {
              // while in scramblePhase of the slot, show a random char; otherwise commit the real char
              out += frac < scramblePhase ? randChar() : letters[i];
            }

            if (el.current) el.current.textContent = out;
          },
          onComplete: () => {
            if (el.current) el.current.textContent = text;
          },
          onReverseComplete: () => {
            if (el.current) el.current.textContent = "";
          },
        });

        tlRef.current = tl;
      },
      { dependencies: [text, perChar, scramblePhase, charset], scope: el }
    );

    useImperativeHandle(
      ref,
      () => ({
        tl: tlRef.current,
        play: () => tlRef.current?.play(0),
        reverse: () => tlRef.current?.reverse(),
        seek: (t) => tlRef.current?.seek(t),
      }),
      []
    );

    return (
      <div
        ref={el}
        className={`tracking-widest ${className}`}
      />
    );
  }
);

DecryptingTypewriter.displayName = "DecryptingTypewriter";

export default DecryptingTypewriter;
