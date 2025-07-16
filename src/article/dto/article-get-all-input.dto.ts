import { CursorPaginationRequestDto } from '../../utils/cursor-pagination.dto';
import { Category } from '../constants';

export class ArticleGetAllInputDto extends CursorPaginationRequestDto {
	category?: Category;
	keyword?: string;
}
