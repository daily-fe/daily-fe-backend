import { CursorPaginationRequestDto } from '../../utils/cursor-pagination.dto';
import { Series } from '../constants';

export class ArticleGetAllInputDto extends CursorPaginationRequestDto {
	series?: Series;
	keyword?: string;
}
