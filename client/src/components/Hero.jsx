import React from "react";
import Spline from "@splinetool/react-spline";
import "../App.css";

const Hero = () => {
    return (
        <div className="Hero">
            <h1>IMAGINE.IO</h1>
            <Spline className="Hero-spline" scene="https://prod.spline.design/5w2oQr1Ug3kOa-io/scene.splinecode" />
        </div>
    );
};

export default Hero;