export default function Tag({ children }) {
    return (
        <span className="text-xs px-3 py-1 border border-zinc-700 rounded-full text-zinc-400">
      {children}
    </span>
    );
}