import Container from "../layout/Container";
import { motion } from "framer-motion";

const stats = [
    { value: "Design + Dev", label: "End-to-end digital builds" },
    { value: "Conversion Focused", label: "Every project is built to perform" },
    { value: "Design Systems", label: "Reusable, scalable, and built for growth" },
];

export default function AboutSection() {
    return (
        <section
            id="about"
            className="py-32 border-t border-zinc-900"
        >
            <Container>
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    <div>
            <span className="text-lime-400 text-sm uppercase tracking-[0.2em]">
              About Nexa Code
            </span>

                        <h2 className="text-5xl lg:text-6xl font-bold mt-6 leading-tight">
                            We create digital products that help ambitious brands grow.
                        </h2>

                        <p className="mt-8 text-zinc-400 max-w-xl text-lg">
                            Nexa Code combines strategy, design, and development
                            to build digital experiences that don't just look
                            good—they perform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {stats.map((stat) => (
                            <motion.div
                                whileHover={{ x: 10 }}
                                key={stat.label}
                                className="border-b border-zinc-800 pb-6"
                            >
                                <div className="text-5xl font-bold text-lime-400">
                                    {stat.value}
                                </div>

                                <div className="text-zinc-500 mt-2">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </Container>
        </section>
    );
}