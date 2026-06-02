import Container from "../layout/Container";

export default function CTASection() {
    return (
        <section className="py-40 relative overflow-hidden">

            <div className="absolute inset-0 bg-lime-400/10 blur-[200px]" />

            <Container>

                <div className="text-center max-w-4xl mx-auto">

          <span className="text-lime-400 uppercase tracking-[0.2em] text-sm">
            Start a Project
          </span>

                    <h2 className="text-6xl lg:text-8xl font-bold mt-8 leading-none">
                        Ready to build something remarkable?
                    </h2>

                    <p className="text-zinc-400 text-lg mt-8 max-w-2xl mx-auto">
                        Let's transform your idea into a high-performing
                        digital experience designed for growth.
                    </p>

                    <button className="mt-12 px-8 py-4 rounded-full bg-lime-400 text-black font-semibold hover:scale-105 transition">
                        Start Your Project
                    </button>

                </div>

            </Container>
        </section>
    );
}