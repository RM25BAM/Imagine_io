import React, { useState, useEffect } from "react";
import "./MarqueeModern.css";

const MarqueeModern = () => {
    const [arrowDirection, setArrowDirection] = useState("right");

    useEffect(() => {
        const interval = setInterval(() => {
            setArrowDirection((prevDirection) =>
                prevDirection === "right" ? "left" : "right"
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="marquee-modern-container">
            <div className={`marquee-modern ${arrowDirection}`}>
                <span className="marquee-item">MODERN CREATIVE STUDIO</span>
                <ArrowIcon direction={arrowDirection} />
                <span className="marquee-item">IMAGINE.IO</span>
                <ArrowIcon direction={arrowDirection} />
                <span className="marquee-item">MODERN CREATIVE STUDIO</span>
                <ArrowIcon direction={arrowDirection} />
                <span className="marquee-item">IMAGINE.IO</span>
                <ArrowIcon direction={arrowDirection} />
                <span className="marquee-item">MODERN CREATIVE STUDIO</span>
                <ArrowIcon direction={arrowDirection} />
                <span className="marquee-item">IMAGINE.IO</span>
                <ArrowIcon direction={arrowDirection} />
                <span className="marquee-item">MODERN CREATIVE STUDIO</span>
                <ArrowIcon direction={arrowDirection} />
                <span className="marquee-item">IMAGINE.IO</span>
            </div>
        </div>
    );
};


const ArrowIcon = ({ direction }) => {
    return (
        <svg
            className={`arrow-icon ${direction}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {direction === "right" ? (
                <>
                    <path d="M12 19l7-7-7-7" />
                    <path d="M5 12h14" />
                </>
            ) : (
                <>
                    <path d="M12 19l-7-7 7-7" />
                    <path d="M19 12H5" />
                </>
            )}
        </svg>
    );
};

export default MarqueeModern;
