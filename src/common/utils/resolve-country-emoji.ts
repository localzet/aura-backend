import countryCodeEmoji from 'country-code-emoji';

export function resolveCountryEmoji(countryCode: string): string {
    if (countryCode === 'XX') {
        return '🏴‍☠️';
    }

    try {
        return countryCodeEmoji(countryCode);
    } catch {
        return '🏴‍☠️';
    }
}
