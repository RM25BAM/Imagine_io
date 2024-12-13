import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "../../client/src/components/Hero.jsx";
import MarqueeModern from "./components/MarqueeModern.jsx";
import DragDrop from "./components/DragDrop.jsx";
import Preloader from "./Preloader.jsx";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderFinish = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(
        ".app-content",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".Hero h1",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".Hero",
            start: "top center",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      gsap.fromTo(
        ".MarqueeModern",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".MarqueeModern",
            start: "top 80%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      gsap.fromTo(
        ".DragDrop",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".DragDrop",
            start: "top 80%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <Preloader onFinish={handlePreloaderFinish} />}
      {!isLoading && (
        <div className="app-content">
          <section className="Hero">
            <Hero />
            <MarqueeModern />
          </section>
          <section className="MarqueeModern">
            <MarqueeModern />
          </section>
          <section className="DragDrop">
            <DragDrop />
          </section>
        </div>
      )}
    </>
  );
};

export default App;


/* import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "../../client/src/components/Hero.jsx";
import MarqueeModern from "./components/MarqueeModern.jsx";
import DragDrop from "./components/DragDrop.jsx";
import Preloader from "./Preloader.jsx";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderFinish = () => {
    setIsLoading(false); // Hide preloader after animation completes
  };

  useEffect(() => {
    if (!isLoading) {
      // Initialize ScrollTrigger animations after preloader finishes
      gsap.fromTo(
        ".Hero h1",
        { opacity: 0, y: 50 }, // Initial state
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".Hero",
            start: "top center",
            end: "bottom top",
            toggleActions: "play reverse play reverse", // Reverts on scroll back
          },
        }
      );

      gsap.fromTo(
        ".MarqueeModern",
        { opacity: 0, x: -50 }, // Initial state
        {
          opacity: 1,
          x: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".MarqueeModern",
            start: "top 80%",
            end: "bottom top",
            toggleActions: "play reverse play reverse", // Reverts on scroll back
          },
        }
      );

      gsap.fromTo(
        ".DragDrop",
        { opacity: 0, y: 50 }, // Initial state
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".DragDrop",
            start: "top 80%",
            end: "bottom top",
            toggleActions: "play reverse play reverse", // Reverts on scroll back
          },
        }
      );
    }
  }, [isLoading]); // Only run animations after preloader finishes

  return (
    <>
      {isLoading && <Preloader onFinish={handlePreloaderFinish} />}
      {!isLoading && (
        <div>
          <section className="Hero">
            <Hero />
          </section>
          <section className="MarqueeModern">
            <MarqueeModern />
          </section>
          <section className="DragDrop">
            <DragDrop />
          </section>
        </div>
      )}
    </>
  );
};

export default App;
 */