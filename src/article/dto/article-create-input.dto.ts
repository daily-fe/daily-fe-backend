import { Category } from '../constants';

export class ArticleCreateInput {
	url: string;
	title: string;
	summary: string;
	tags: string[];
	author: string | null;
	category: Category;
}
