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
import { Linkedin, Mail, Twitter, Github, Heart } from 'lucide-react';
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

type ProjectConfig = {
  id: string;
  title: string;
  image: string;
  tagline: string;
  description: string;
};

const PROJECTS: ProjectConfig[] = [
  {
    id: "collab-board",
    title: "CollabBoard",
    image: "/collabBoardImg.png",
    tagline: "Realtime whiteboard for remote sprints",
    description:
      "Collaborative canvas with synced cursors, sticky notes, and secure invite links so distributed teams can brainstorm together.",
  },
  {
    id: "wrytr",
    title: "Wrytr",
    image: "/wrytrImg.png",
    tagline: "AI-assisted editor for content teams",
    description:
      "An AI-first editor that generates outlines, tone suggestions, and CMS-ready exports to keep marketing teams shipping faster.",
  },
  {
    id: "sensai",
    title: "SensAI",
    image: "/sensaiImg.png",
    tagline: "Adaptive learning coach for makers",
    description:
      "A modular learning tracker that blends bite-sized lessons with actionable feedback to help creatives level up consistently.",
  },
];

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
  const projectDescriptionRefs = useRef<Array<DecryptHandle | null>>([]);

  projectDescriptionRefs.current.length = PROJECTS.length;

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const heroIntroTlRef = useRef<gsap.core.Timeline | null>(null);
  const playedRef = useRef(false);
  const progressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const contactSectionRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [showExplore, setShowExplore] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  // stable ticker callback reference for cleanup
  const tickerRef = useRef<((time: number) => void) | null>(null);

  

  // Manage body overflow for overlay
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

  // Lenis Smooth Scroll Setup with stable gsap.ticker
  useEffect(() => {
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: false,
});

    lenisRef.current = lenis;

    // sync ScrollTrigger on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // stable ticker reference to call lenis.raf
    tickerRef.current = (time: number) => {
      lenis.raf(time * 1000);
    };
    if (tickerRef.current) {
      gsap.ticker.add(tickerRef.current);
    }
    gsap.ticker.lagSmoothing(0);

    // keep it stopped while overlay shows
    if (overlayVisible) {
      lenis.stop();
    }

    return () => {
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
      lenis.destroy();
    };
  }, []); // mount once [web:5][web:22]

  // Enable/disable Lenis when overlay state changes
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (!overlayVisible) {
      lenis.start();
    } else {
      lenis.stop();
    }
  }, [overlayVisible]); // [web:5]

  

  // helper for nav scrolls
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

  // Build a selector if the element has an id (more reliable across frames)
  const target: string | HTMLElement = el.id ? `#${el.id}` : el;

  // Ensure Lenis is running
  lenis.start();

  // Small timeout to let Lenis start/raf run at least once
  setTimeout(() => {
    console.log("lenis.scrollTo ->", target);
    try {
      // lenis.scrollTo accepts selector, number or element
      lenis.scrollTo(target as string | HTMLElement, { offset: -10, duration: 1.2 });
    } catch (err) {
      console.error("lenis.scrollTo error:", err);
    }
  }, 50);
};

  // Hero intro timeline
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

  // Overlay slide animation
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
          // re-measure ScrollTrigger after layout changes
          ScrollTrigger.refresh();
        });

      tlRef.current = tl;
    },
    { scope: containerRef }
  ); // [web:22]

  // Skills scroll animation
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

  // Projects section animation
  useGSAP(
    () => {
      const section = projectsSectionRef.current;
      if (!section) return;

      const cards = gsap.utils.toArray<HTMLElement>(".project-card", section);

      gsap.set(cards, {
        opacity: 0,
        y: 64,
        scale: 0.92,
        willChange: "transform, opacity",
      });

      const tl = gsap.timeline({ paused: true });

      tl.call(() => {
        decryptProjectsRef.current?.play();
      });

      tl.to(
        cards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power3.out",
          duration: 0.9,
          stagger: 0.2,
        },
        0
      );

      tl.call(
        () => {
          projectDescriptionRefs.current.forEach((ref) => ref?.play());
        },
        undefined,
        "-=0.4"
      );

      tl.call(() => {
        cards.forEach((card) => card.style.removeProperty("will-change"));
      });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          tl.play(0);
        },
      });

      return () => {
        st.kill();
        tl.kill();
      };
    },
    { scope: projectsSectionRef }
  );


  // Loading progress
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
  }, []); // [web:22]

  // Start decrypt scan
  useEffect(() => {
    decryptScanRef.current?.play();
  }, []);

  // Overlay click to start
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
        {/* Inline nav using Lenis programmatic scroll */}
        <div className="w-full flex justify-end px-8 py-4 top-0 z-[100] ">
          <div className="inline-flex gap-6 px-6 py-3 backdrop-blur-md bg-white/5 border border-white/10 top-0 -skew-x-12 relative z-[100]">
            <button
              onClick={() => {
                console.log("About clicked");
                scrollToEl(heroSectionRef.current);
              }}
              className="text-white hover:text-white/70 transition-colors tracking-widest skew-x-12 cursor-pointer relative z-[100]"
            >
              [About]
            </button>
            <button
              onClick={() => {
                console.log("Skills clicked");
                scrollToEl(skillsSectionRef.current);
              }}
              className="text-white hover:text-white/70 transition-colors tracking-widest skew-x-12 cursor-pointer relative z-[100]"
            >
              [Skills]
            </button>
            <button
              onClick={() => {
                console.log("Projects clicked");
                scrollToEl(projectsSectionRef.current);
              }}
              className="text-white hover:text-white/70 transition-colors tracking-widest skew-x-12 cursor-pointer relative z-[100]"
            >
              [Projects]
            </button>
            <button
              onClick={() => {
                console.log("Contact clicked");
                scrollToEl(contactSectionRef.current);
              }}
              className="text-white hover:text-white/70 transition-colors tracking-widest skew-x-12 cursor-pointer relative z-[100]"
            >
              [Contact]
            </button>
            <Link
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"       
              className="text-white hover:text-white/70 transition-colors tracking-widest skew-x-12 cursor-pointer relative z-[100]"
            >
              [Resume]
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div
          id="about"
          ref={heroSectionRef}
          className="relative w-screen h-screen flex items-center justify-center overflow-hidden z-[5] -mt-16"
        >
          <div className="flex items-center justify-center w-full h-full">
            <div ref={heroGlassCardRef}>
              <HeroGlassCard
                className="flex flex-col md:flex-row items-center justify-center 
                         w-[80vw] 
                         h-[83vh] 
                         rounded-3xl overflow-hidden transition-all duration-500 top-2"
              >
                <div className="flex flex-col md:flex-row items-center justify-between w-full h-full px-8 md:px-12 lg:px-16">
                  <div className="flex flex-col items-start justify-center gap-4 text-left max-w-[500px] md:max-w-[600px]">
                    <DecryptingTypewriter
                      ref={introRef}
                      text="Hi, I’m Anusha — a coder who loves turning ideas into clean, functional code."
                      perChar={0.09}
                      scramblePhase={0.6}
                      className="text-2xl md:text-2xl lg:text-3xl text-white font-light leading-tight"
                    />
                  </div>

                  <img
                    ref={imageRef}
                    src="/ChatGPT Image Oct 7, 2025, 09_28_22 PM.png"
                    alt="profile"
                    className="w-[280px] md:w-[380px] lg:w-[450px] object-contain pointer-events-none"
                  />
                </div>
              </HeroGlassCard>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div
          id="skills"
          ref={skillsSectionRef}
          className="w-screen h-screen flex flex-col items-center justify-center text-center gap-5"
        >
          <DecryptingTypewriter
            ref={decryptSkillsRef}
            text="//:Skills"
            perChar={0.1}
            scramblePhase={0.6}
            className="tracking-widest text-2xl pl-10 w-screen flex justify-items-start"
          />
          <div className="flex flex-row w-full gap-5 justify-end">
            <div className="w-1/2" />

            <div className="flex flex-wrap gap-10 justify-start">
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
                <SkillsCard key={i} className="w-[150px] h-[150px] p-6 cursor-target">
                  <img src={`/${img}`} alt={img} />
                </SkillsCard>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div
          id="projects"
          ref={projectsSectionRef}
          className="px-10 w-screen min-h-screen flex flex-col justify-center gap-16"
        >
          <DecryptingTypewriter
            ref={decryptProjectsRef}
            text="//:Projects"
            perChar={0.1}
            scramblePhase={0.6}
            className="w-full tracking-widest text-2xl flex justify-end"
          />
          <div className="mx-auto grid w-full max-w-6xl gap-10 justify-items-center md:grid-cols-2 xl:grid-cols-3">
            {PROJECTS.map((project, index) => (
              <SplitGlassCard
                key={project.id}
                className="project-card w-full max-w-[320px] min-h-[420px]"
              >
                <div className="flex h-full flex-col gap-6">
                  <div className="aspect-video overflow-hidden rounded-2xl bg-white/10">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase tracking-[0.35em]">
                    {project.title}
                  </h3>
                  <DecryptingTypewriter
                    ref={(handle) => {
                      projectDescriptionRefs.current[index] = handle;
                    }}
                    text={project.tagline}
                    perChar={0.08}
                    scramblePhase={0.5}
                    className="text-xs uppercase tracking-[0.45em] text-white/70"
                  />
                  <p className="text-sm leading-relaxed text-white/70">
                    {project.description}
                  </p>
                </div>
              </SplitGlassCard>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div ref={contactSectionRef} className="min-h-screen flex flex-col">
          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-16">
              {/* Left - QR */}
              <a href="mailto:ammupannati@gmail.com" className="relative flex-shrink-0 cursor-target">
                <div className="absolute -top-2 left-0 w-12 h-12 border-t-2 border-l-2 border-white"></div>
                <div className="absolute -top-2 right-0 w-12 h-12 border-t-2 border-r-2 border-white"></div>
                <div className="absolute -bottom-2 left-0 w-12 h-12 border-b-2 border-l-2 border-white"></div>
                <div className="absolute -bottom-2 right-0 w-12 h-12 border-b-2 border-r-2 border-white"></div>

                <div className="relative bg-black px-16 py-12">
                  <div className="text-white text-xs tracking-[0.3em] mb-8 text-center font-light">
                    DIGITAL CARD
                  </div>

                  <div className="w-72 h-72 rounded-full flex items-center justify-center mb-8">
                    <div className="w-56 h-56 relative">
                      <img src="/Email QR Code.png" alt="" />
                    </div>
                  </div>

                  <div className="text-white text-xs tracking-[0.3em] text-center font-light">
                    SCAN OR CLICK
                  </div>
                </div>
              </a>

              {/* Right - Text and Socials */}
              <div className="text-white space-y-6 max-w-xl">
                <div className="space-y-1">
                  <p className="text-lg">
                    Looking for someone who could help you?{" "}
                    <a href="#" className="underline hover:text-gray-300 transition">
                      Hire me!
                    </a>
                  </p>
                  <p className="text-lg">Need some suggestions?</p>
                  <p className="text-lg">Feel free to reach out through e-mails or slide in to my DMs ; </p>
                </div>

                <div className="flex gap-5 pt-2">
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-target cursor-none"
                  >
                    <Linkedin size={22} fill="currentColor" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-target cursor-none"
                  >
                    <Mail size={22} />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-target cursor-none"
                  >
                    <Twitter size={22} fill="currentColor" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-target cursor-none"
                  >
                    <Github size={22} fill="currentColor" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full  py-6 px-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-white text-xs tracking-wider">
              <div               onClick={() => {
                console.log("Contact clicked");
                scrollToEl(heroSectionRef.current);
              }}  className="flex items-center gap-2">
                <span>^</span>
                <span>SCROLL TO TOP AND LIVE AGAIN</span>
              </div>
              <div className="flex items-center gap-2">
                <span>DESIGNED AND DEVELOPED WITH</span>
                <Heart size={16} fill="#ef4444" className="text-red-500" />
                <span>ANUSHA PANNATI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
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

        {/* Decrypting Text + Progress */}
        <div className="absolute inset-0 flex justify-between items-center text-black z-10 px-20">
          <DecryptingTypewriter
            ref={decryptScanRef}
            text="SCANNING"
            perChar={0.1}
            scramblePhase={0.6}
            className="text-9xl font-extralight"
          />
          <div ref={loadingRef} className="text-9xl tracking-widest">
            {progress}%
          </div>
        </div>

        {/* Click to Explore */}
        {showExplore && (
          <div
            ref={exploreRef}
            className="absolute bottom-10 right-10 text-black text-xs tracking-wider animate-pulse z-10"
          >
            CLICK TO EXPLORE
          </div>
        )}
      </div>
    </div>
  );
}