import React, { useEffect } from 'react';
import gsap from 'gsap';
import './Preloader.css';

import image3 from './assets/img3.jpg';
import image2 from './assets/img2.jpg';

const Preloader = ({ onFinish }) => {
    const images = [image2, image3];

    useEffect(() => {
        const timeline = gsap.timeline();

        const slides = document.querySelectorAll('.carousel-slide');
        if (!slides.length) {
            console.error('No slides found. Ensure elements render correctly.');
            return;
        }

        // sliding and shaking
        images.forEach((_, index) => {
            const nextIndex = (index + 1) % images.length;

            timeline
                .to(slides[index], {
                    opacity: 0,
                    x: '-120%',
                    rotation: -10,
                    scale: 0.9,
                    duration: 0.5,
                    ease: 'power3.out',
                    onStart: () => {
                        // shake effect
                        gsap.to(slides[index], {
                            x: () => (Math.random() - 0.5) * 10,
                            y: () => (Math.random() - 0.5) * 10,
                            duration: 0.1,
                            repeat: 3,
                            yoyo: true,
                            ease: 'power3.inOut',
                        });
                    },
                })
                .to(
                    slides[nextIndex],
                    {
                        opacity: 1,
                        x: '0%',
                        rotation: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power3.inOut',
                    },
                    '-=0.4' // Overlap transitions
                )
                .fromTo(
                    slides[nextIndex],
                    { filter: 'grayscale(100%)' },
                    { filter: 'grayscale(0%)', duration: 0.3 },
                    '-=0.3'
                );
        });

        // Graffiti-style fade out
        const timeout = setTimeout(() => {
            gsap.to('.preloader', {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => {
                    if (onFinish) onFinish();
                },
            });
        }, images.length * 500 + 1000);

        return () => {
            clearTimeout(timeout);
            timeline.kill();
        };
    }, [onFinish]);

    return (
        <div className='preloader'>
            <div className='carousel'>
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`carousel-slide carousel-slide-${index}`}
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    ></div>
                ))}
            </div>
            <p className='carousel-text'> Creativity... </p>
        </div>
    );
};

export default Preloader;
