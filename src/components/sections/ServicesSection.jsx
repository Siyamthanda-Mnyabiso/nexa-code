import { useState } from "react";
import Container from "../layout/Container";

const services = [
    {
        title: "Web Design",
        process: [
            "Understand brand & goals",
            "Create wireframes & structure",
            "Design high-fidelity UI",
            "Prototype experience",
            "Prepare for development"
        ]
    },
    {
        title: "Web Development",
        process: [
            "Technical planning",
            "Frontend architecture setup",
            "Component development",
            "API integration",
            "Deployment"
        ]
    },
    {
        title: "UI/UX Systems",
        process: [
            "User research",
            "UX mapping",
            "Design system creation",
            "Reusable components",
            "Scalable UI rules"
        ]
    },
    {
        title: "Brand Strategy",
        process: [
            "Market research",
            "Brand positioning",
            "Visual identity direction",
            "Messaging system",
            "Brand rollout strategy"
        ]
    },
    {
        title: "Landing Pages",
        process: [
            "Conversion strategy",
            "Layout planning",
            "Copy alignment",
            "UI design",
            "Optimization"
        ]
    },
    {
        title: "MVP Development",
        process: [
            "Idea breakdown",
            "Feature prioritization",
            "Rapid prototyping",
            "Core build",
            "Fast launch"
        ]
    },
];

export default function ServicesSection() {
    const [active, setActive] = useState(null);

    const toggleService = (index) => {
        setActive(active === index ? null : index);
    };

    return (
        <section
            id="services"
            className="py-20 md:py-32 border-t border-zinc-900"
        >
            <Container>

                {/* Header */}
                <div className="max-w-3xl mb-12 md:mb-20">
                    <span className="text-lime-400 uppercase tracking-[0.2em] text-xs md:text-sm">
                        Services
                    </span>

                    <h2 className="text-3xl md:text-5xl font-bold mt-4 md:mt-6">
                        Design systems, not just websites.
                    </h2>
                </div>

                {/* LIST */}
                <div className="space-y-4">

                    {services.map((service, index) => {
                        const isOpen = active === index;

                        return (
                            <div
                                key={service.title}
                                className="border-b border-zinc-900"
                            >

                                {/* Header Row */}
                                <button
                                    onClick={() => toggleService(index)}
                                    className="w-full flex justify-between items-center py-6 md:py-8 text-left"
                                >
                                    <div className="flex gap-4 md:gap-6 items-center">
                                        <span className="text-zinc-500 text-xs md:text-sm">
                                            0{index + 1}
                                        </span>

                                        <h3 className="text-lg md:text-2xl text-zinc-300">
                                            {service.title}
                                        </h3>
                                    </div>

                                    <span
                                        className={`text-xl transition-transform duration-300 ${
                                            isOpen ? "rotate-90 text-lime-400" : ""
                                        }`}
                                    >
                                        →
                                    </span>
                                </button>

                                {/* DROPDOWN */}
                                {isOpen && (
                                    <div className="pb-6 md:pb-8 pl-6 md:pl-10 space-y-4">
                                        {service.process.map((step, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <span className="text-lime-400 text-xs md:text-sm">
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>

                                                <p className="text-zinc-400 text-sm md:text-base">
                                                    {step}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        );
                    })}

                </div>

            </Container>
        </section>
    );
}