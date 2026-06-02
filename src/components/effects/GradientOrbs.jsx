export default function GradientOrbs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[400px] h-[400px] bg-lime-400/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
            <div className="absolute w-[300px] h-[300px] bg-purple-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />
        </div>
    );
}