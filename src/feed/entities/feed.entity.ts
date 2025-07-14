import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SiteEnum } from '../enums/site.enum';

@Entity()
export class Feed {
	@PrimaryColumn()
	url: string;

	@Column()
	title: string;

	@Column({ type: 'timestamp', nullable: true })
	publishedAt: Date | null;

	@Column({ type: 'enum', enum: SiteEnum })
	site: SiteEnum;

	constructor(url: string, title: string, publishedAt: Date | null, site: SiteEnum) {
		this.url = url;
		this.title = title;
		this.publishedAt = publishedAt;
		this.site = site;
	}

	static create(url: string, title: string, publishedAt: Date, site: SiteEnum): Feed {
		let date: Date | null = new Date(publishedAt);
		if (Number.isNaN(date.getTime())) {
			date = null;
		}
		return new Feed(url, title, date, site);
	}
}
