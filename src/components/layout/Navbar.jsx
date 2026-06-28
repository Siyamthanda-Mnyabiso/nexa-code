import { useState } from "react";
import { motion } from "framer-motion";
import Container from "./Container";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    // NEW: smooth scroll to contact section
    const scrollToContact = () => {
        document.getElementById("contact")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // NEW: scroll to top (logo)
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed top-6 left-0 w-full z-50 px-4"
        >
            <Container>

                <nav className="relative flex items-center justify-between h-16 px-6 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl">

                    {/* Logo (UNCHANGED UI + scroll top) */}
                    <div
                        onClick={scrollToTop}
                        className="flex items-center gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-lime-400" />
                        <span className="font-semibold tracking-wide">
                            NEXA CODE
                        </span>
                    </div>

                    {/* Desktop Nav (UNCHANGED UI) */}
                    <ul className="hidden lg:flex items-center gap-8 text-sm text-zinc-400">
                        <li><a href="#work">Work</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>

                    {/* CTA Desktop (CHANGED ONLY FUNCTION) */}
                    <button
                        onClick={scrollToContact}
                        className="px-5 py-2 rounded-full bg-lime-400 text-black font-medium hover:scale-105 transition-transform"
                    >
                        Let's Talk
                    </button>

                    {/* Mobile Toggle (UNCHANGED) */}
                    <button
                        className="lg:hidden text-white text-xl"
                        onClick={() => setOpen(!open)}
                    >
                        ☰
                    </button>

                    {/* Mobile Menu */}
                    {open && (
                        <div className="absolute top-20 left-0 w-full rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-6 flex flex-col gap-4 lg:hidden">

                            <a href="#work">Work</a>
                            <a href="#services">Services</a>
                            <a href="#about">About</a>

                            {/* ONLY FUNCTION CHANGE */}
                            <button
                                onClick={scrollToContact}
                                className="mt-4 px-5 py-2 rounded-full bg-lime-400 text-black font-medium"
                            >
                                Let's Talk
                            </button>

                        </div>
                    )}

                </nav>

            </Container>
        </motion.header>
    );
}