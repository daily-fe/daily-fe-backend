import { Category } from '../constants';

export class ArticleGetAllInputDto {
	category?: Category;
	keyword?: string;
}
