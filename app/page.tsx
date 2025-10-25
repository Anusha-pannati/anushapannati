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
import { Linkedin, Mail, Twitter, Instagram, Github, Heart } from 'lucide-react';

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
  const decryptCollabBoardDescRef = useRef<DecryptHandle>(null);
  const decryptWrytrDescRef = useRef<DecryptHandle>(null);
  const decryptSensaiDescRef = useRef<DecryptHandle>(null);

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
      anchors: true, // let Lenis handle anchors
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
    if (!el || !lenis) return;
    // ensure Lenis is running; if not, force the scroll
    const options = { offset: -80, duration: 1.2, force: true as const };
    lenis.scrollTo(el, options);
  }; // [web:5]

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
        z: 100,
        rotationY: -90,
        transformPerspective: 800,
        transformOrigin: "left center",
      });

      const tl = gsap.timeline({ paused: true });

      tl.call(() => decryptProjectsRef.current?.play());

      tl.fromTo(
        cards,
        { opacity: 0, z: 100, rotationY: -90 },
        {
          opacity: 1,
          z: 0,
          rotationY: 0,
          ease: "power2.out",
          stagger: 0.25,
          duration: 1.2,
        },
        "+=1"
      );

      tl.call(() => {
        decryptCollabBoardDescRef.current?.play();
      }, undefined, "+=0.2");
      tl.call(() => {
        decryptWrytrDescRef.current?.play();
      }, undefined, "+=0.2");
      tl.call(() => {
        decryptSensaiDescRef.current?.play();
      }, undefined, "+=0.2");

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => tl.play(0),
        onEnterBack: () => tl.play(0),
        onLeaveBack: () => {
          tl.pause(0);
          gsap.set(cards, { opacity: 0, z: 100, rotationY: -90 });
          decryptProjectsRef.current?.reverse?.();
        },
      });

      return () => {
        tl.kill();
        st.kill();
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
        <div className="w-full flex justify-end px-8 py-4 top-0 z-50 ">
          <div className="inline-flex gap-6 px-6 py-3 backdrop-blur-md bg-white/5 border border-white/10 top-0 -skew-x-12">
            <button
              onClick={() => scrollToEl(heroSectionRef.current)}
              className="text-white hover:text-white/70 transition-colors tracking-widest skew-x-12"
            >
              [About]
            </button>
            <button
              onClick={() => scrollToEl(skillsSectionRef.current)}
              className="text-white hover:text-white/70 transition-colors tracking-widest skew-x-12"
            >
              [Skills]
            </button>
            <button
              onClick={() => scrollToEl(projectsSectionRef.current)}
              className="text-white hover:text-white/70 transition-colors tracking-widest skew-x-12"
            >
              [Projects]
            </button>
            <button
              onClick={() => scrollToEl(contactSectionRef.current)}
              className="text-white hover:text-white/70 transition-colors tracking-widest skew-x-12"
            >
              [Contact]
            </button>
            <button className="text-white hover:text-white/70 transition-colors tracking-widest skew-x-12">
              [Resume]
            </button>
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
                      text="Hi, I am retgeyhet"
                      perChar={0.1}
                      scramblePhase={0.6}
                      className="text-4xl md:text-5xl lg:text-7xl text-white font-light leading-tight"
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
          className="px-10 w-screen h-screen flex flex-col justify-center gap-10 perspective-[1000px]"
        >
          <DecryptingTypewriter
            ref={decryptProjectsRef}
            text="//:Projects"
            perChar={0.1}
            scramblePhase={0.6}
            className="w-screen tracking-widest text-2xl flex justify-end pr-50 "
          />
          <div className="flex flex-wrap gap-10 justify-start mt-30">
            <SplitGlassCard className=" project-card w-[300px] h-[400px]">
              <img src="/collabBoardImg.png" alt="" className="h-[130px] top-2" />
              <DecryptingTypewriter
                ref={decryptCollabBoardDescRef}
                text="//:Projects"
                perChar={0.1}
                scramblePhase={0.6}
                className="w-screen tracking-widest text-2xl flex justify-end pr-50 "
              />
            </SplitGlassCard>

            <SplitGlassCard className=" project-card w-[300px] h-[400px]">
              <img src="/wrytrImg.png" alt="" />
              <DecryptingTypewriter
                ref={decryptWrytrDescRef}
                text="//:Projects"
                perChar={0.1}
                scramblePhase={0.6}
                className="w-screen tracking-widest text-2xl flex justify-end pr-50 "
              />
            </SplitGlassCard>

            <SplitGlassCard className=" project-card w-[300px] h-[400px]">
              <img src="/sensaiImg.png" alt="" />
              <DecryptingTypewriter
                ref={decryptSensaiDescRef}
                text="//:Projects"
                perChar={0.1}
                scramblePhase={0.6}
                className="w-screen tracking-widest text-2xl flex justify-end pr-50 "
              />
            </SplitGlassCard>
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
              <div className="flex items-center gap-2">
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
