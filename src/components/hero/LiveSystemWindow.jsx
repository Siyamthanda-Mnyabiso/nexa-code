import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const states = [
    "Initializing Nexa System...",
    "Compiling UI components...",
    "Deploying experience...",
    "npm run build → success"
];

export default function LiveSystemWindow() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % states.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl font-mono text-sm">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                >
                    {states[index]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}