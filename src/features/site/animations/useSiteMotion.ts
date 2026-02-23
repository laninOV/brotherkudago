"use client";

import { useEffect } from "react";
import { motionConfig } from "./motion-config";

type GsapModule = typeof import("gsap");
type ScrollTriggerModule = typeof import("gsap/ScrollTrigger");

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function useSiteMotion() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    (async () => {
      const [{ gsap }, ScrollTrigger] = await Promise.all([
        import("gsap") as Promise<GsapModule>,
        import("gsap/ScrollTrigger") as Promise<ScrollTriggerModule>,
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger.ScrollTrigger);

      const heroPanel = document.querySelector<HTMLElement>(".bk-hero__panel");
      const heroMedia = document.querySelector<HTMLElement>(".bk-hero__media");
      const heroTicker = document.querySelector<HTMLElement>(".bk-hero__ticker");

      const introTl = gsap.timeline({ defaults: { ease: "power2.out" } });
      introTl
        .fromTo(heroPanel, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0)
        .fromTo(heroMedia, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.08)
        .fromTo(heroTicker, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.3);

      const cardTweens: Array<gsap.core.Tween> = [];
      const list = document.getElementById("bk-list");
      const setupCards = () => {
        const cards = Array.from(document.querySelectorAll<HTMLElement>(".bk-card"));
        for (const card of cards) {
          if (card.dataset.gsapReveal === "1") continue;
          card.dataset.gsapReveal = "1";

          gsap.set(card, { y: 14, opacity: 0 });
          const tween = gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: motionConfig.reveal.duration,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          });
          cardTweens.push(tween);
        }
      };

      setupCards();

      let cardsScheduled = false;
      const observer =
        list &&
        new MutationObserver(() => {
          if (cardsScheduled) return;
          cardsScheduled = true;
          window.requestAnimationFrame(() => {
            cardsScheduled = false;
            setupCards();
            ScrollTrigger.ScrollTrigger.refresh();
          });
        });

      if (observer && list) {
        observer.observe(list, { childList: true, subtree: true });
      }

      cleanup = () => {
        observer?.disconnect();
        introTl.kill();
        for (const tween of cardTweens) {
          tween.scrollTrigger?.kill();
          tween.kill();
        }
        ScrollTrigger.ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
}
