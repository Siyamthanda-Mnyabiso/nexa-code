export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}