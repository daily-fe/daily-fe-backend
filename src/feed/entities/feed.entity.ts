import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['publishedAt', 'id'])
export class Feed {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	url: string;

	@Column()
	title: string;

	@Column({ type: 'timestamp', nullable: true })
	publishedAt: Date | null;

	@Column()
	site?: string;

	constructor(url: string, title: string, publishedAt: Date | null, site?: string) {
		this.url = url;
		this.title = title;
		this.publishedAt = publishedAt;
		this.site = site;
	}

	static create(url: string, title: string, publishedAt: Date, site?: string): Feed {
		let date: Date | null = new Date(publishedAt);
		if (Number.isNaN(date.getTime())) {
			date = null;
		}
		return new Feed(url, title, date, site);
	}
}
