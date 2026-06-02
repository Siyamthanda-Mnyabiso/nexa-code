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
    const [active, setActive] = useState(0);

    return (
        <section
            id="services"
            className="py-32 border-t border-zinc-900"
        >
            <Container>

                {/* Header */}
                <div className="max-w-3xl mb-20">
                    <span className="text-lime-400 uppercase tracking-[0.2em] text-sm">
                        Services
                    </span>

                    <h2 className="text-5xl font-bold mt-6">
                        Design systems, not just websites.
                    </h2>
                </div>

                {/* Layout */}
                <div className="grid lg:grid-cols-2 gap-16">

                    {/* LEFT SIDE — Services List */}
                    <div>
                        {services.map((service, index) => (
                            <button
                                key={service.title}
                                onClick={() => setActive(index)}
                                className={`w-full flex justify-between items-center border-b py-8 transition-all duration-300 group
                                    ${active === index
                                    ? "border-lime-400 text-lime-400"
                                    : "border-zinc-900 text-zinc-400 hover:text-white"
                                }`}
                            >
                                <div className="flex gap-6 items-center">
                                    <span className="text-zinc-500 text-sm">
                                        0{index + 1}
                                    </span>

                                    <h3 className="text-2xl">
                                        {service.title}
                                    </h3>
                                </div>

                                <span className="text-xl group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* RIGHT SIDE — Process Viewer */}
                    <div className="border border-zinc-900 rounded-2xl p-10 bg-zinc-950">

                        <div className="mb-8">
                            <span className="text-lime-400 text-sm uppercase tracking-[0.2em]">
                                Process
                            </span>

                            <h3 className="text-2xl font-semibold mt-4">
                                {services[active].title}
                            </h3>
                        </div>

                        <div className="space-y-6">
                            {services[active].process.map((step, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <span className="text-lime-400 text-sm">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                                    <p className="text-zinc-300">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>

            </Container>
        </section>
    );
}