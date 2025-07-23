import xbytes from 'xbytes';

export function prettyBytesUtil(
    bytesInput: bigint | number | string | undefined,
    sticky = false,
    prefixIndex?: number,
    returnZero = false,
): string {
    if (!bytesInput) {
        return returnZero ? '0' : '0';
    }
    if (typeof bytesInput === 'string') {
        bytesInput = Number(bytesInput);
    } else if (typeof bytesInput === 'bigint') {
        bytesInput = Number(bytesInput);
    }

    const res = xbytes.parseBytes(bytesInput, { iec: true, sticky, prefixIndex });

    return String(res.size);
}
