let isSafari11_0 = false;
let hasRun = false;

export function detectSafari11_0() {
    if (!hasRun) {
        const userAgent: string = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
        const isSafari = userAgent.indexOf('Safari') != -1 && userAgent.indexOf('Chrome') == -1;
        if (isSafari) {
            const match = userAgent.match(/version\/(\d+(\.\d+)?)/i);
            const version = (match && match.length > 1 && match[1]) || '';
            if (version === '11.0') {
                isSafari11_0 = true;
            }
        }
    }
    return isSafari11_0;
}
