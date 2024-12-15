import React from "react";
import "./leftover.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">

                <div className="footer-icons">
                    <a
                        href="https://facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                            alt="Facebook"
                            className="footer-icon"
                        />
                    </a>
                    <a
                        href="https://www.instagram.com/codeconmate/"
                        target="codeconmate"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/733/733558.png"
                            alt="Instagram"
                            className="footer-icon"
                        />
                    </a>
                    <a
                        href="https://discord.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://img.icons8.com/fluency/48/discord-logo.png"
                            alt="Discord"
                            className="footer-icon"
                        />
                    </a>
                </div>

                <div className="footer-links">
                    <a href="">Work</a>
                    <a href="">Story</a>
                    <a href="">Services</a>
                    <a href="">Careers</a>
                    <a href="">Contact Us</a>
                </div>


                <div className="footer-brand">
                    @IMAGINE.IO
                </div>
            </div>
        </footer>
    );
};

export default Footer;
