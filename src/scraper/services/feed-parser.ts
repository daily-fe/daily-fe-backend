import { XMLParser } from 'fast-xml-parser';
import { ArticleSummary } from '../interfaces/web-content-scraper.interface';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

export function parseFeed(xml: string): ArticleSummary[] {
	const json = parser.parse(xml);

	if (json.rss) {
		return parseRss(json.rss);
	} else if (json.feed) {
		return parseAtom(json.feed);
	}
	throw new Error('Unknown feed format');
}

function parseRss(rss: any): ArticleSummary[] {
	const channel = rss.channel;
	const items = channel.item;
	return (Array.isArray(items) ? items : [items]).map((item: any) => ({
		title: item.title,
		url: item.link,
		publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : undefined,
		site: channel.title,
		// TODO
		// description: item.description
	}));
}

function parseAtom(feed: any): ArticleSummary[] {
	const entries = feed.entry;
	return (Array.isArray(entries) ? entries : [entries]).map((entry: any) => {
		return {
			title: entry.title,
			url: getAtomEntryUrl(entry),
			publishedAt: entry.updated ? new Date(entry.updated).toISOString() : undefined,
			site: feed.title,
			// TODO
			// summary: entry.summary
		};
	});
}

/**
 * atom entry의 url을 리턴하는 함수
 * @param entry
 * @returns
 * @description
 * Atom의 <link>는 배열이거나 객체일 수 있음. rel="alternate" 우선 사용
 */
function getAtomEntryUrl(entry: any): string {
	if (Array.isArray(entry.link)) {
		const alt = entry.link.find((l: any) => l.rel === 'alternate');
		return alt ? alt.href : entry.link[0].href;
	} else if (entry.link?.href) {
		return entry.link.href;
	}
	return '';
}
