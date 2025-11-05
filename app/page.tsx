"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import DecryptingTypewriter, { type DecryptHandle } from "./components/DecryptingTypewriter";
import SkillsCard from "./components/SkillsCard";
import SplitGlassCard from "./components/SplitGlassCard";
import TargetCursor from "./components/TargetCursor";
import HeroGlassCard from "./components/HeroGlassCard";
import { Linkedin, Mail, Twitter, Github, Heart, ChevronUp, ExternalLink } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const slideTop = useRef<HTMLDivElement>(null);
  const slideBottom = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadingRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const decryptScanRef = useRef<DecryptHandle>(null);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroGlassCardRef = useRef<HTMLDivElement>(null);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const introRef = useRef<DecryptHandle>(null);
  const decryptSkillsRef = useRef<DecryptHandle>(null);
  const decryptProjectsRef = useRef<DecryptHandle>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const heroIntroTlRef = useRef<gsap.core.Timeline | null>(null);
  const playedRef = useRef(false);
  const progressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const contactSectionRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [showExplore, setShowExplore] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const tickerRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (overlayVisible) {
      document.body.classList.add("overlay-active");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("overlay-active");
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "auto";
    }
    return () => {
      document.body.classList.remove("overlay-active");
      document.body.style.overflow = "";
    };
  }, [overlayVisible]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2, // Add this for better mobile sensitivity
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    tickerRef.current = (time: number) => {
      lenis.raf(time * 1000);
    };
    if (tickerRef.current) {
      gsap.ticker.add(tickerRef.current);
    }
    gsap.ticker.lagSmoothing(0);

    if (overlayVisible) {
      lenis.stop();
    }

    return () => {
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (!overlayVisible) {
      lenis.start();
    } else {
      lenis.stop();
    }
  }, [overlayVisible]);

  const scrollToEl = (el: HTMLElement | null) => {
    const lenis = lenisRef.current;
    console.log("scrollToEl called:", { el, overlayVisible, lenisExists: !!lenis });

    if (!el) {
      console.warn("scrollToEl: target element is null");
      return;
    }
    if (!lenis) {
      console.warn("scrollToEl: lenis not initialized yet");
      return;
    }

    const target: string | HTMLElement = el.id ? `#${el.id}` : el;
    lenis.start();

    setTimeout(() => {
      console.log("lenis.scrollTo ->", target);
      try {
        lenis.scrollTo(target as string | HTMLElement, { offset: -10, duration: 1.2 });
      } catch (err) {
        console.error("lenis.scrollTo error:", err);
      }
    }, 50);
  };

  useGSAP(
    () => {
      gsap.set(heroGlassCardRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(imageRef.current, { opacity: 0, x: 100, scale: 0.9 });

      const heroTl = gsap.timeline({ paused: true });

      heroTl
        .to(heroGlassCardRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        })
        .to(
          imageRef.current,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.2)",
          },
          "+=0.1"
        )
        .call(() => introRef.current?.play(), undefined, "+=0.1");

      heroIntroTlRef.current = heroTl;
    },
    { scope: heroSectionRef, dependencies: [] }
  );

  useGSAP(
    () => {
      gsap.set([slideTop.current, slideBottom.current], { yPercent: 0 });

      const tl = gsap.timeline({ paused: true });

      tl.to([loadingRef.current, exploreRef.current], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
        .call(() => decryptScanRef.current?.reverse(), undefined, 0)
        .to(slideTop.current, { yPercent: -100, duration: 1.5, ease: "power2.inOut" }, 1)
        .to(slideBottom.current, { yPercent: 100, duration: 1.5, ease: "power2.inOut" }, 1)
        .to(containerRef.current, { opacity: 0, duration: 0.3 }, 1.8)
        .eventCallback("onComplete", () => {
          setOverlayVisible(false);
          heroIntroTlRef.current?.play();
          ScrollTrigger.refresh();
        });

      tlRef.current = tl;
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: skillsSectionRef.current,
        start: "top 80%",
        onEnter: () => decryptSkillsRef.current?.play(),
        onEnterBack: () => decryptSkillsRef.current?.play(),
      });
    },
    { scope: skillsSectionRef }
  );

  useGSAP(() => {
    const section = projectsSectionRef.current;
    if (!section) return;

    const cards = gsap.utils.toArray<HTMLElement>(".project-card", section);

    gsap.set(cards, {
      opacity: 0,
      z: 100,
      rotationY: -90,
      transformPerspective: 800,
      transformOrigin: "left center",
    });

    const tl = gsap.timeline({ paused: true });

    tl.call(() => {
      if (decryptProjectsRef.current) decryptProjectsRef.current.play();
    });

    tl.fromTo(cards, { opacity: 0, z: 100, rotationY: -90 }, {
      opacity: 1,
      z: 0,
      rotationY: 0,
      ease: "power2.out",
      stagger: 0.25,
      duration: 1.2,
    });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      onEnter: () => {
        console.log("Projects scroll trigger fired");
        tl.play(0);
      },
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, { scope: projectsSectionRef });

  useEffect(() => {
    const obj = { value: 0 };
    const tween = gsap.to(obj, {
      value: 100,
      duration: 0.7,
      ease: "none",
      onUpdate: () => {
        const v = Math.round(obj.value);
        progressRef.current = v;
        setProgress(v);
      },
      onComplete: () => setShowExplore(true),
    });
    return () => {
      tween.kill();
    };
  }, []);

  useEffect(() => {
    decryptScanRef.current?.play();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onClick = () => {
      if (playedRef.current || progressRef.current < 100) return;
      playedRef.current = true;
      tlRef.current?.play(0);
    };

    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, []);

  return (
    <div className={`relative w-screen min-h-screen overflow-x-hidden`}>
      <TargetCursor spinDuration={15} hideDefaultCursor />

      {/* Background Grid */}
      <div className="grid-background absolute inset-0 -z-10" />

      {/* Main Content */}
      <div
        ref={mainContentRef}
        className={`w-screen min-h-screen text-white overflow-x-hidden transition-opacity duration-700 ${
          overlayVisible ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Navigation - Responsive */}
        <div className="w-full flex justify-center md:justify-end px-4 sm:px-6 md:px-8 py-3 md:py-4 top-0 z-[100]">
          <div className="inline-flex flex-wrap gap-3 sm:gap-4 md:gap-6 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 backdrop-blur-md bg-white/5 border border-white/10 -skew-x-12 relative z-[100]">
            <button
              onClick={() => scrollToEl(heroSectionRef.current)}
              className="text-white hover:text-white/70 transition-colors tracking-[0.2em] sm:tracking-[0.25em] md:tracking-widest text-xs sm:text-sm skew-x-12 cursor-pointer relative z-[100] cursor-target"
            >
              [About]
            </button>
            <button
              onClick={() => scrollToEl(skillsSectionRef.current)}
              className="text-white hover:text-white/70 transition-colors tracking-[0.2em] sm:tracking-[0.25em] md:tracking-widest text-xs sm:text-sm skew-x-12 cursor-pointer relative z-[100] cursor-target"
            >
              [Skills]
            </button>
            <button
              onClick={() => scrollToEl(projectsSectionRef.current)}
              className="text-white hover:text-white/70 transition-colors tracking-[0.2em] sm:tracking-[0.25em] md:tracking-widest text-xs sm:text-sm skew-x-12 cursor-pointer relative z-[100] cursor-target"
            >
              [Projects]
            </button>
            <button
              onClick={() => scrollToEl(contactSectionRef.current)}
              className="text-white hover:text-white/70 transition-colors tracking-[0.2em] sm:tracking-[0.25em] md:tracking-widest text-xs sm:text-sm skew-x-12 cursor-pointer relative z-[100] cursor-target"
            >
              [Contact]
            </button>
            
            <Link
              href="https://drive.google.com/file/d/1QH9KGt5WBQquPbR9gmYVcirAhFgeZHuI/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/70 transition-colors tracking-[0.2em] sm:tracking-[0.25em] md:tracking-widest text-xs sm:text-sm skew-x-12 cursor-pointer relative z-[100] cursor-target"
            >
              [
              <span className="inline-flex items-center gap-1">
                <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px] md:w-[15px] md:h-[15px]" />
                <span>Resume</span>
              </span>
              ]
            </Link>
          </div>
        </div>

        {/* Hero Section - Responsive */}
        <div
          id="about"
          ref={heroSectionRef}
          className="relative w-screen h-screen flex items-center justify-center overflow-hidden z-[5] -mt-8 sm:-mt-12 md:-mt-16"
        >
          <div className="flex items-center justify-center w-full h-full px-4 sm:px-6 md:px-0">
            <div ref={heroGlassCardRef} className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw]">
              <HeroGlassCard
                className="flex flex-col md:flex-row items-center justify-center 
                         w-full
                         h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[83vh]
                         rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row items-center justify-between w-full h-full px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-0">
                  <div className="flex flex-col items-start justify-center gap-3 sm:gap-4 text-left max-w-full md:max-w-[450px] lg:max-w-[500px] xl:max-w-[600px] mb-6 md:mb-0">
                    <DecryptingTypewriter
                      ref={introRef}
                      text="Hi, I'm Anusha — a coder who loves turning ideas into clean, functional code."
                      perChar={0.03}
                      scramblePhase={100}
                      className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-white font-light leading-tight"
                    />
                  </div>

                  <Image
                    ref={imageRef}
                    src="/heroImg.png"
                    alt="profile"
                    width={450}
                    height={450}
                    className="w-[200px] sm:w-[240px] md:w-[300px] lg:w-[380px] xl:w-[450px] object-contain pointer-events-none"
                  />
                </div>
              </HeroGlassCard>
            </div>
          </div>
        </div>

        {/* Skills Section - Responsive */}
        <div
          id="skills"
          ref={skillsSectionRef}
          className="w-screen min-h-screen py-12 sm:py-16 md:py-0 md:h-screen flex flex-col items-center justify-center text-center gap-5 sm:gap-6 md:gap-5 px-4 sm:px-6 md:px-8"
        >
          <DecryptingTypewriter
            ref={decryptSkillsRef}
            text="//:Skills"
            perChar={0.1}
            scramblePhase={0.6}
            className="tracking-[0.3em] sm:tracking-[0.35em] md:tracking-widest text-2xl sm:text-3xl md:text-4xl w-full text-center md:text-left md:pl-10"
          />
          <div className="flex flex-col md:flex-row w-full gap-5 md:justify-end">
            <div className="hidden md:block md:w-1/2" />

            <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-center md:justify-start w-full md:w-auto">
              {[
                "c-logo-icon-28389.png",
                "TypeScript.png",
                "JavaScript.png",
                "React.png",
                "Next.js.png",
                "Node.js.png",
                "Express.png",
                "Tailwind CSS.png",
                "PostgresSQL.png",
                "icons8-prisma-orm-144.png",
                "MongoDB.png",
                "GitHub.png",
                "Docker.png",
                "Socket.io.png",
              ].map((img, i) => (
                <SkillsCard key={i} className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px] p-4 sm:p-5 md:p-6 cursor-target">
                  <Image width={80} height={80} src={`/${img}`} alt={img} className="w-full h-full object-contain" />
                </SkillsCard>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Section - Responsive */}
        <div
          id="projects"
          ref={projectsSectionRef}
          className="px-4 sm:px-6 md:px-8 lg:px-10 w-screen min-h-screen py-12 sm:py-16 md:py-0 md:h-screen flex flex-col justify-center gap-6 sm:gap-8 md:gap-10 perspective-[1000px]"
        >
          <DecryptingTypewriter
            ref={decryptProjectsRef}
            text="//:Projects"
            perChar={0.1}
            scramblePhase={0.6}
            className="w-full tracking-[0.3em] sm:tracking-[0.35em] md:tracking-widest text-2xl sm:text-3xl md:text-4xl text-center md:text-right md:pr-10 lg:pr-20"
          />
          <div className="flex flex-wrap gap-6 sm:gap-8 md:gap-10 justify-center md:justify-start">
            {/* CollabBoard Project */}
            <SplitGlassCard className="project-card w-full sm:w-[280px] md:w-[300px] h-auto sm:h-[400px] md:h-[420px]">
              <div className="flex h-full flex-col gap-2 sm:gap-1">
                <div>
                  <Image width={600} height={500} src="/collabBoardImg.png" alt="" className="h-[100px] sm:h-[120px] md:h-[130px] w-full object-cover top-2" />
                </div>
                <div className="flex-1 flex flex-col gap-1 sm:gap-1">
                  <h3 className="text-base sm:text-lg font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.35em]">
                    collabBoard
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/70">
                    A real-time collaborative whiteboard enabling multiple users to draw, brainstorm, and interact together seamlessly with room-based access and admin controls.
                  </p>
                </div>
                <div className="flex flex-row justify-between text-xs sm:text-sm">
                  <Link
                    href="https://github.com/Anusha-pannati/collabBoard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row cursor-target"
                  >
                    [
                    <span className="inline-flex items-center gap-1">
                      <Github size={12} className="sm:w-[14px] sm:h-[14px] md:w-[15px] md:h-[15px]" />
                      <span>Github</span>
                    </span>
                    ]
                  </Link>
                  <Link
                    href="https://www.youtube.com/watch?v=55Sw6Q6JXko"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row cursor-target"
                  >
                    [
                    <span className="inline-flex items-center gap-1">
                      <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px] md:w-[15px] md:h-[15px]" />
                      <span>Demo</span>
                    </span>
                    ]
                  </Link>
                </div>
              </div>
            </SplitGlassCard>

            {/* Wrytr Project */}
            <SplitGlassCard className="project-card w-full sm:w-[280px] md:w-[300px] h-auto sm:h-[400px] md:h-[420px]">
              <div className="flex h-full flex-col gap-2 sm:gap-1">
                <div>
                  <Image width={600} height={500} src="/wrytrImg.png" alt="" className="h-[100px] sm:h-[120px] md:h-[130px] w-full object-cover top-2" />
                </div>
                <div className="flex-1 flex flex-col gap-1 sm:gap-1">
                  <h3 className="text-base sm:text-lg font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.35em]">
                    Wrytr
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/70">
                    A modern blogging platform that lets you write and publish posts manually or generate high-quality, engaging content instantly with built-in AI assistance.
                  </p>
                </div>
                <div className="flex flex-row justify-between text-xs sm:text-sm">
                  <Link
                    href="https://github.com/Anusha-pannati/WryTr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row cursor-target"
                  >
                    [
                    <span className="inline-flex items-center gap-1">
                      <Github size={12} className="sm:w-[14px] sm:h-[14px] md:w-[15px] md:h-[15px]" />
                      <span>Github</span>
                    </span>
                    ]
                  </Link>
                  <Link
                    href="https://wry-tr.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row cursor-target"
                  >
                    [
                    <span className="inline-flex items-center gap-1">
                      <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px] md:w-[15px] md:h-[15px]" />
                      <span>Demo</span>
                    </span>
                    ]
                  </Link>
                </div>
              </div>
            </SplitGlassCard>

            {/* Sensai Project */}
            <SplitGlassCard className="project-card w-full sm:w-[280px] md:w-[300px] h-auto sm:h-[400px] md:h-[420px]">
              <div className="flex flex-col gap-2 sm:gap-1 h-full">
                <div>
                  <Image width={600} height={500} src="/sensaiImg.png" alt="" className="h-[100px] sm:h-[120px] md:h-[130px] w-full object-cover top-2" />
                </div>
                <div className="flex-1 flex flex-col gap-1 sm:gap-1">
                  <h3 className="text-base sm:text-lg font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.35em]">
                    Sensai
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/70">
                    An AI-powered career companion that helps you navigate your professional journey with personalized career guidance, smart interview preparation, real-time industry insights, and AI-assisted resume creation
                  </p>
                </div>
                <div className="flex flex-row justify-between text-xs sm:text-sm">
                  <Link
                    href="https://github.com/Anusha-pannati/Sensai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row cursor-target"
                  >
                    [
                    <span className="inline-flex items-center gap-1">
                      <Github size={12} className="sm:w-[14px] sm:h-[14px] md:w-[15px] md:h-[15px]" />
                      <span>Github</span>
                    </span>
                    ]
                  </Link>
                </div>
              </div>
            </SplitGlassCard>
          </div>
        </div>

        {/* Contact Section */}
        <div ref={contactSectionRef} className="min-h-screen flex flex-col">
          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 md:gap-16">
              {/* Left - QR */}
              <a 
                href="mailto:ammupannati@gmail.com" 
                className="relative flex-shrink-0 cursor-target w-full max-w-sm lg:max-w-md xl:max-w-md"
              >
                <div className="absolute -top-2 left-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-t-2 border-l-2 border-white"></div>
                <div className="absolute -top-2 right-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-t-2 border-r-2 border-white"></div>
                <div className="absolute -bottom-2 left-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-b-2 border-l-2 border-white"></div>
                <div className="absolute -bottom-2 right-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-b-2 border-r-2 border-white"></div>
                          
                <div 
                  className="relative px-8 sm:px-12 md:px-16 py-8 sm:py-10 md:py-12"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15), 0 4px 30px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="text-white text-[0.65rem] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] mb-6 sm:mb-8 text-center font-light">
                    DIGITAL CARD
                  </div>
                
                  <div className="w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px] aspect-square mx-auto rounded-full flex items-center justify-center mb-6 sm:mb-8">
                    <div className="w-[180px] sm:w-[200px] md:w-[220px] h-[180px] sm:h-[200px] md:h-[220px] relative">
                      <Image width={250} height={250} src="/Email QR Code.png" alt="" className="select-none w-full h-full object-contain" />
                    </div>
                  </div>
                
                  <div className="text-white text-[0.65rem] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-center font-light">
                    SCAN OR CLICK
                  </div>
                </div>
              </a>
                
              {/* Right - Text and Socials */}
              <div className="text-white space-y-4 sm:space-y-6 max-w-xl w-full text-center lg:text-left flex-1">
                <div className="space-y-1">
                  <p className="text-sm sm:text-base md:text-lg">
                    Looking for someone who could help you?{" "}
                    <a href="#" className="underline hover:text-gray-300 transition cursor-target">
                      Hire me!
                    </a>
                  </p>
                  <p className="text-sm sm:text-base md:text-lg">Need some suggestions?</p>
                  <p className="text-sm sm:text-base md:text-lg">Feel free to reach out through e-mails or slide in to my DMs ;</p>
                </div>
                
                <div className="flex gap-4 sm:gap-5 pt-2 justify-center lg:justify-start">
                  <a
                    href="https://www.linkedin.com/in/anusha-pannati/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-target cursor-none"
                  >
                    <Linkedin size={18} className="sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px]" fill="currentColor" />
                  </a>
                  <a
                    href="mailto:ammupannati@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-target cursor-none"
                  >
                    <Mail size={18} className="sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px]" />
                  </a>
                  <a
                    href="https://x.com/n0xha_04"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-target cursor-none"
                  >
                    <Image width={22} height={22} src="/twitter.png" alt="" className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px] select-none" />
                  </a>
                  <a
                    href="https://github.com/Anusha-pannati"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-target cursor-none"
                  >
                    <Github size={18} className="sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px]" fill="currentColor" />
                  </a>
                </div>
              </div>
            </div>
          </div>
                
          {/* Footer */}
          <div className="w-full py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-white text-[0.65rem] sm:text-xs tracking-wide sm:tracking-wider">
              <div 
                onClick={() => scrollToEl(heroSectionRef.current)} 
                className="flex items-center gap-2 cursor-target"
              >
                <span><ChevronUp size={14} className="sm:w-4 sm:h-4" /></span>
                <span className="hidden sm:inline">SCROLL TO TOP AND LIVE AGAIN</span>
                <span className="sm:hidden">BACK TO TOP</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                <span className="hidden sm:inline">DESIGNED AND DEVELOPED WITH</span>
                <span className="sm:hidden">MADE WITH</span>
                <Heart size={14} className="sm:w-4 sm:h-4" fill="#ffffff" />
                <span>ANUSHA PANNATI</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Overlay - Responsive */}
      <div
        ref={containerRef}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-transparent transition-opacity duration-700 ${
          overlayVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Neon Panels */}
        <div
          ref={slideTop}
          className="absolute inset-0 bg-[#c2fe49]"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 45%, 65% 45%, 55% 55.5%, 0% 55.5%)",
            zIndex: 2,
          }}
        />
        <div
          ref={slideBottom}
          className="absolute inset-0 bg-[#c2fe49]"
          style={{
            clipPath: "polygon(0% 54.5%, 55% 54.5%, 65% 44.5%, 100% 44.5%, 100% 100%, 0% 100%)",
            zIndex: 1,
          }}
        />

        {/* Decrypting Text + Progress - Responsive */}
        <div className="absolute inset-0 flex flex-col sm:flex-row justify-between items-center text-black z-10 px-6 sm:px-12 md:px-20 font-terminal gap-4 sm:gap-0">
          <DecryptingTypewriter
            ref={decryptScanRef}
            text="SCANNING"
            perChar={0.1}
            scramblePhase={0.6}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight"
          />
          <div ref={loadingRef} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-[0.3em] sm:tracking-widest">
            {progress}%
          </div>
        </div>

        {/* Click to Explore - Responsive */}
        {showExplore && (
          <div
            ref={exploreRef}
            className="absolute bottom-6 sm:bottom-8 md:bottom-10 right-6 sm:right-8 md:right-10 text-black text-[0.65rem] sm:text-xs tracking-wide sm:tracking-wider animate-pulse z-10"
          >
            CLICK TO EXPLORE
          </div>
        )}
      </div>
    </div>
  );
}
