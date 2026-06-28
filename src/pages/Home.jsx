import Hero from "../components/hero/Hero";
import WorkSection from "../components/sections/WorkSection";
import ServicesSection from "../components/sections/ServicesSection";
import AboutSection from "../components/sections/AboutSection";
import CTASection from "../components/sections/CTASection";
import ContactSection from "../components/sections/ContactSection";

export default function Home() {
    return (
        <>
            <Hero />
            <WorkSection />
            <AboutSection />
            <ServicesSection />
            <CTASection />
            <ContactSection />
        </>
    );
}