export const parsePositiveInt = (value: unknown, fallback: number): number => {
    const n = typeof value === "string" ? parseInt(value, 10) : Number(value);
    if (!Number.isFinite(n) || n < 1) return fallback;
    return Math.floor(n);
};