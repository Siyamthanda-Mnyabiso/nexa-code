export default function BackgroundGrid() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* subtle grid background */}
            <div className="absolute inset-0 opacity-[0.05]
        bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]
        bg-[size:60px_60px]" />
        </div>
    );
}