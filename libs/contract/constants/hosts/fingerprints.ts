export const FINGERPRINTS = {
    CHROME: 'chrome',
    FIREFOX: 'firefox',
    SAFARI: 'safari',
    IOS: 'ios',
    ANDROID: 'android',
    EDGE: 'edge',
    QQ: 'qq',
    RANDOM: 'random',
    RANDOMIZED: 'randomized',
} as const;

export type TFingerprints = [keyof typeof FINGERPRINTS][number];
export const FINGERPRINTS_VALUES = Object.values(FINGERPRINTS);
