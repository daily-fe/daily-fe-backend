import { Category, Series } from '../constants';

export class ArticleCreateInput {
	url: string;
	title: string;
	summary: string;
	tags: string[];
	author: string | null;
	series: Series;
	category: Category;
}
