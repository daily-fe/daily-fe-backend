export enum RSS_FEED_SITE {
	LINE_ENGINEERING = 'LINE Engineering',
	MUSINSA_TECH = 'MUSINSA Tech',
	DAANGN = 'Daangn',
	BANKSALAD = 'Banksalad',
}

// TODO: DB로 이동 필요
export const RSS_FEEDS = [
	{
		site: RSS_FEED_SITE.LINE_ENGINEERING,
		url: 'https://techblog.lycorp.co.jp/ko/feed/index.xml',
	},
	{
		site: RSS_FEED_SITE.MUSINSA_TECH,
		url: 'https://medium.com/feed/musinsa-tech',
	},
	{
		site: RSS_FEED_SITE.DAANGN,
		url: 'https://medium.com/feed/daangn',
	},
	{
		site: RSS_FEED_SITE.BANKSALAD,
		url: 'https://blog.banksalad.com/rss.xml',
	},
];
