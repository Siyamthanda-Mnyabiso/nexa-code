import { useState } from "react";
import Container from "../components/layout/Container";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const mailtoLink = `mailto:YOUR_EMAIL@gmail.com?subject=New Project Request from ${form.name}&body=Name: ${form.name}%0AEmail: ${form.email}%0A%0A${form.message}`;

        window.location.href = mailtoLink;
    };

    return (
        <section className="py-32">
            <Container>

                <div className="max-w-2xl mx-auto">

                    <h1 className="text-5xl font-bold mb-10">
                        Start Your Project
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <input
                            name="name"
                            placeholder="Your Name"
                            onChange={handleChange}
                            className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl"
                            required
                        />

                        <input
                            name="email"
                            placeholder="Your Email"
                            onChange={handleChange}
                            className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl"
                            required
                        />

                        <textarea
                            name="message"
                            placeholder="Tell us about your project..."
                            onChange={handleChange}
                            className="w-full p-4 h-40 bg-zinc-950 border border-zinc-800 rounded-xl"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full py-4 bg-lime-400 text-black rounded-xl font-semibold hover:scale-[1.02] transition"
                        >
                            Send Message
                        </button>

                    </form>

                </div>

            </Container>
        </section>
    );
}