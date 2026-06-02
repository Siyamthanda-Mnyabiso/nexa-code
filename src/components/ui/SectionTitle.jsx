export default function SectionTitle({ title, subtitle }) {
    return (
        <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold">{title}</h2>
            {subtitle && (
                <p className="text-zinc-500 mt-2 text-sm">{subtitle}</p>
            )}
        </div>
    );
}