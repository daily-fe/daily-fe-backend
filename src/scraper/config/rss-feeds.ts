import { SiteEnum } from 'src/feed/enums/site.enum';

// TODO: DB로 이동 필요
export const RSS_FEEDS = [
	{
		site: SiteEnum.LINE_ENGINEERING,
		url: 'https://techblog.lycorp.co.jp/ko/feed/index.xml',
	},
	{
		site: SiteEnum.MUSINSA_TECH,
		url: 'https://medium.com/feed/musinsa-tech',
	},
	{
		site: SiteEnum.DAANGN,
		url: 'https://medium.com/feed/daangn',
	},
	{
		site: SiteEnum.BANKSALAD,
		url: 'https://blog.banksalad.com/rss.xml',
	},
	{
		site: SiteEnum.GITHUB,
		url: 'https://github.blog/news-insights/research/feed/',
	},
	{
		site: SiteEnum.SPOTIFY,
		url: 'https://engineering.atspotify.com/feed',
	},
];
