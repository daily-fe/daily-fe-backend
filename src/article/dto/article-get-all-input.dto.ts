import { CursorPaginationRequestDto } from '../../utils/cursor-pagination.dto';
import { Category, Series } from '../constants';

export class ArticleGetAllInputDto extends CursorPaginationRequestDto {
	series?: Series;
	category?: Category;
	keyword?: string;
}
