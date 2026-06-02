import { motion } from "framer-motion";

export default function HeroLeft() {
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
                <button className="bg-lime-400 text-black px-6 py-3">
                    Start Project
                </button>
                <button className="border border-zinc-700 px-6 py-3">
                    View Work
                </button>
            </div>
        </div>
    );
}