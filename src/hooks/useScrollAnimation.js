import { useEffect } from "react";
import { useAnimation } from "framer-motion";

export default function useScrollAnimation() {
    const controls = useAnimation();

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 100) {
                controls.start({ opacity: 1, y: 0 });
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [controls]);

    return controls;
}