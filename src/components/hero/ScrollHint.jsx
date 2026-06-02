import { motion } from "framer-motion";

export default function ScrollHint() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-zinc-500"
        >
            <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                ↓ Scroll to explore
            </motion.div>
        </motion.div>
    );
}