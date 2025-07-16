export const SERIES = ['Deep Dive', 'Trends', 'Interview', 'Review', 'Others'] as const;

export type Series = (typeof SERIES)[number];

export const CATEGORY = ['Frontend', 'Backend', 'AI', 'Mobile', 'DevOps', 'Others'] as const;
export type Category = (typeof CATEGORY)[number];
