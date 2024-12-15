import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "../../client/src/components/Hero.jsx";
import MarqueeModern from "./components/MarqueeModern.jsx";
import DragDrop from "./components/DragDrop.jsx";
import Preloader from "./Preloader.jsx";
import Footer from "./components/footer.jsx";
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
          <footer className="footer">
            <Footer />
          </footer>
        </div>
      )}
    </>
  );
};

export default App;

