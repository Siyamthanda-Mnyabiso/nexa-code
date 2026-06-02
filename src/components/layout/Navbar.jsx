import { useState } from "react";
import { motion } from "framer-motion";
import Container from "./Container";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed top-6 left-0 w-full z-50 px-4"
        >
            <Container>

                <nav className="relative flex items-center justify-between h-16 px-6 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-lime-400" />
                        <span className="font-semibold tracking-wide">
                            NEXA CODE
                        </span>
                    </div>

                    {/* Navigation (Desktop) */}
                    <ul className="hidden lg:flex items-center gap-8 text-sm text-zinc-400">
                        <li>
                            <a href="#work" className="hover:text-white transition-colors">
                                Work
                            </a>
                        </li>

                        <li>
                            <a href="#services" className="hover:text-white transition-colors">
                                Services
                            </a>
                        </li>

                        <li>
                            <a href="#process" className="hover:text-white transition-colors">
                                Process
                            </a>
                        </li>

                        <li>
                            <a href="#about" className="hover:text-white transition-colors">
                                About
                            </a>
                        </li>
                    </ul>

                    {/* CTA (Desktop) */}
                    <button className="hidden lg:block px-5 py-2 rounded-full bg-lime-400 text-black font-medium hover:scale-105 transition-transform">
                        Let's Talk
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-white text-xl"
                        onClick={() => setOpen(!open)}
                    >
                        ☰
                    </button>

                    {/* Mobile Dropdown */}
                    {open && (
                        <div className="absolute top-20 left-0 w-full rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-6 flex flex-col gap-4 lg:hidden">

                            <a href="#work" className="text-zinc-300">Work</a>
                            <a href="#services" className="text-zinc-300">Services</a>
                            <a href="#process" className="text-zinc-300">Process</a>
                            <a href="#about" className="text-zinc-300">About</a>

                            <button className="mt-4 px-5 py-2 rounded-full bg-lime-400 text-black font-medium">
                                Let's Talk
                            </button>

                        </div>
                    )}

                </nav>

            </Container>
        </motion.header>
    );
}