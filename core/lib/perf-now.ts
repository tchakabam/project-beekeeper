const performance = window.performance;

export function getPerfNow(): number {
    return performance.now();
}
