import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroLeft() {
    const navigate = useNavigate();

    return (
        <div className="z-10 max-w-xl">
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-zinc-400"
            >
                [ DIGITAL INNOVATION ]
            </motion.p>

            <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-6xl font-bold leading-none mt-4"
            >
                NEXA <span className="text-lime-400">CODE</span>
            </motion.h1>

            <p className="text-zinc-400 mt-6">
                We build conversion-focused digital systems that perform.
            </p>

            <div className="flex gap-4 mt-8">

                {/* CTA 1 */}
                <button
                    onClick={() => navigate("/contact")}
                    className="mt-10 px-8 py-4 bg-lime-400 text-black rounded-full"
                >
                    Start Your Project
                </button>

                {/* CTA 2 — FLOATING ANIMATED */}
                <motion.button
                    onClick={() => {
                        document.getElementById("work")?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }}
                    animate={{
                        x: [0, 20, -15, 10, 0],
                        y: [0, -15, 10, -20, 0],
                        rotate: [0, 2, -2, 1, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    whileHover={{
                        scale: 1.08,
                    }}
                    className="border border-zinc-700 px-6 py-3 rounded-full"
                >
                    View Work
                </motion.button>

            </div>
        </div>
    );
}