import { Category } from '../constants';

export interface ArticleCreateInput {
	url: string;
	title: string;
	summary: string;
	tags: string[];
	author: string | null;
	category: Category;
}
