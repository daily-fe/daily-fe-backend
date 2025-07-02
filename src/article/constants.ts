export const CATEGORIES = ['Deep Dive', 'Trends', 'Interview', 'Review', 'Others'] as const;

export type Category = (typeof CATEGORIES)[number];
