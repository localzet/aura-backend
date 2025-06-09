import ms from 'enhanced-ms';

export function formatExecutionTime(startTime: number): string {
    return ms(Date.now() - startTime, 'short') || '0ms';
}

export function getTime(): number {
    return Date.now();
}
