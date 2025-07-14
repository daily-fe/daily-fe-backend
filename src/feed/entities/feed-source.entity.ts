import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FeedSource {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	site: string;

	@Column({ unique: true })
	url: string;

	@Column({ default: true })
	isActive: boolean;
}
