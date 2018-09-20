let performance;
if (!global) {
    performance = window.performance;
}

export function getPerfNow(): number {
    if (!performance) {
        return Date.now();
    }
    return performance.now();
}
