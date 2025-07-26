import { IsIn, IsOptional } from 'class-validator';
import { CursorPaginationRequestDto } from '../../utils/cursor-pagination.dto';

export class GetAllFeedsCursorInputDto extends CursorPaginationRequestDto {
	@IsOptional()
	@IsIn(['ASC', 'DESC'])
	order?: 'ASC' | 'DESC' = 'DESC'; // 최신순, 오래된순
}
