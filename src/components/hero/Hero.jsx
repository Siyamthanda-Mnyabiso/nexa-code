import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import BackgroundGrid from "../effects/BackgroundGrid";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-between px-10">
            <BackgroundGrid />

            <HeroLeft />
            <HeroRight />
        </section>
    );
}