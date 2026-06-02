import Container from "../layout/Container";

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

                <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950">

                    {/* Website Preview */}
                    <div className="h-[600px] overflow-hidden border-b border-zinc-800">
                        <iframe
                            src="https://top-deck.vercel.app/"
                            title="TopDeck Website"
                            className="w-full h-full"
                        />
                    </div>

                    {/* Project Info */}
                    <div className="p-10">
                        <h3 className="text-3xl font-bold">
                            TopDeck
                        </h3>

                        <p className="text-zinc-400 mt-4 max-w-2xl">
                            A beauty service booking platform designed to help clients discover, book, and manage appointments with ease.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <span className="text-lime-400">
                                UI/UX
                            </span>

                            <span className="text-lime-400">
                                Development
                            </span>

                            <span className="text-lime-400">
                                Strategy
                            </span>
                        </div>

                        <a
                            href="https://top-deck.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-lime-400 text-black font-medium hover:scale-105 transition"
                        >
                            Visit Website →
                        </a>
                    </div>
                </div>

            </Container>
        </section>
    );
}