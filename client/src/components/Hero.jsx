import React, { useEffect } from "react";
import { gsap } from "gsap";
import Spline from "@splinetool/react-spline";
import "../App.css";

const Hero = () => {
    useEffect(() => {
        gsap.to(".Hero h1", {
            scale: 1.2,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".Hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
                markers: false,
            }
        });


        gsap.to(".Hero-spline", {
            scale: 1.05,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".Hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
                markers: false,
            }
        });
    }, []);

    return (
        <div className="Hero">
            <h1>IMAGINE.IO</h1>
            <Spline className="Hero-spline" scene="https://prod.spline.design/5w2oQr1Ug3kOa-io/scene.splinecode" />
        </div>
    );
};

export default Hero;
