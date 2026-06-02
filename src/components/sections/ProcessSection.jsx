import Container from "../layout/Container";

const steps = [
    {
        number: "01",
        title: "Discover",
        desc: "Understanding your business, audience, and goals."
    },
    {
        number: "02",
        title: "Wireframe",
        desc: "Structuring the experience before visuals."
    },
    {
        number: "03",
        title: "Design",
        desc: "Creating a premium UI system."
    },
    {
        number: "04",
        title: "Develop",
        desc: "Building fast and scalable solutions."
    },
    {
        number: "05",
        title: "Launch",
        desc: "Deploying and optimizing performance."
    },
];

export default function ProcessSection() {
    return (
        <section id="process" className="py-32">
            <Container>

                <div className="max-w-3xl mb-20">
          <span className="text-lime-400 uppercase tracking-[0.2em] text-sm">
            Process
          </span>

                    <h2 className="text-5xl font-bold mt-6">
                        From idea to launch.
                    </h2>
                </div>

                <div className="space-y-12">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="grid md:grid-cols-3 gap-8 border-b border-zinc-900 pb-10"
                        >
                            <div className="text-zinc-500 text-xl">
                                {step.number}
                            </div>

                            <h3 className="text-2xl font-semibold">
                                {step.title}
                            </h3>

                            <p className="text-zinc-400">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </Container>
        </section>
    );
}