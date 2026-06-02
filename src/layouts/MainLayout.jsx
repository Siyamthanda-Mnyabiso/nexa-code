import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CursorGlow from "../components/effects/CursorGlow";

export default function MainLayout({ children }) {
    return (
        <div className="bg-black text-white min-h-screen overflow-x-hidden">
            <CursorGlow />
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}