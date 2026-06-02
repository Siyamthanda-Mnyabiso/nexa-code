export default function Button({
                                   children,
                                   variant = "primary",
                                   className = "",
                               }) {
    const base =
        "px-6 py-3 text-sm font-medium transition rounded-md";

    const variants = {
        primary: "bg-lime-400 text-black hover:scale-[1.02]",
        secondary: "border border-zinc-700 hover:border-lime-400",
        ghost: "text-zinc-400 hover:text-white",
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
}