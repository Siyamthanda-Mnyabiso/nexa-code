import { useEffect } from "react";

export default function useInterval(callback, delay) {
    useEffect(() => {
        const id = setInterval(callback, delay);
        return () => clearInterval(id);
    }, [callback, delay]);
}