import Container from "../layout/Container";

export default function ContactSection() {
    return (
        <section
            id="contact"
            className="py-32 border-t border-zinc-900"
        >
            <Container>

                <div className="max-w-3xl">
                    <span className="text-lime-400 uppercase tracking-[0.2em] text-sm">
                        Contact
                    </span>

                    <h2 className="text-5xl font-bold mt-6">
                        Let's build something remarkable.
                    </h2>

                    <p className="text-zinc-400 mt-6">
                        Tell us about your project and we'll get back to you.
                    </p>
                </div>

                <form
                    action="https://formsubmit.co/siyamthandamnyabiso7@gmail.com"
                    method="POST"
                    className="mt-16 max-w-3xl space-y-6"
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        required
                        className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        required
                        className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800"
                    />

                    <input
                        type="text"
                        name="business"
                        placeholder="Business / Brand"
                        className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800"
                    />

                    <textarea
                        name="message"
                        rows="6"
                        placeholder="Tell us about your project..."
                        required
                        className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800"
                    />

                    <button
                        type="submit"
                        className="px-8 py-4 rounded-full bg-lime-400 text-black font-semibold"
                    >
                        Send Message
                    </button>
                </form>

            </Container>
        </section>
    );
}