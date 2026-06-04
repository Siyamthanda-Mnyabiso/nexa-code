import Container from "../layout/Container";

const projects = [
    {
        title: "TopDeck",
        description:
            "A beauty service booking platform designed to help clients discover, book, and manage appointments with ease.",
        url: "https://top-deck.vercel.app/",
        tags: ["UI/UX", "Development", "Strategy"],
    },
    {
        title: "GSeason",
        description:
            "A full-stack web application focused on performance, usability, and a seamless customer experience.",
        url: "https://gseason-fullstack.vercel.app/",
        tags: ["Full Stack", "UI/UX", "Development"],
    },
    {
        title: "Rivo",
        description:
            "A modern full-stack platform designed with scalability, clean architecture, and intuitive user flows.",
        url: "https://rivo-full-stack.vercel.app/",
        tags: ["Full Stack", "Web Design", "Development"],
    },
    {
        title: "Continental Takeaways",
        description:
            "A food ordering experience built to help customers browse menus and place orders effortlessly.",
        url: "https://continental-takeaways.vercel.app/",
        tags: ["Restaurant", "Development", "UI/UX"],
    },
    {
        title: "Izzy Burger",
        description:
            "A restaurant website crafted to showcase products, drive engagement, and increase customer conversions.",
        url: "https://izzy-burger.vercel.app/",
        tags: ["Restaurant", "Web Design", "Development"],
    },
];

export default function WorkSection() {
    return (
        <section id="work" className="py-32">
            <Container>

                <div className="mb-20">
                    <span className="text-lime-400 uppercase tracking-[0.2em] text-sm">
                        Selected Work
                    </span>

                    <h2 className="text-5xl font-bold mt-6">
                        Digital experiences that deliver results.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">

                    {projects.map((project) => (
                        <div
                            key={project.title}
                            className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950"
                        >
                            {/* Website Preview */}
                            <div className="h-[350px] md:h-[500px] overflow-hidden border-b border-zinc-800">
                                <iframe
                                    src={project.url}
                                    title={project.title}
                                    className="w-full h-full"
                                />
                            </div>

                            {/* Project Info */}
                            <div className="p-8">
                                <h3 className="text-3xl font-bold">
                                    {project.title}
                                </h3>

                                <p className="text-zinc-400 mt-4">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-4 mt-8">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-lime-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-lime-400 text-black font-medium hover:scale-105 transition"
                                >
                                    Visit Website →
                                </a>
                            </div>
                        </div>
                    ))}

                </div>

            </Container>
        </section>
    );
}