import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CursorPaginationResponseDto<T> {
	data: T[];
	nextCursor?: string;

	constructor(data: T[], nextCursor?: string) {
		this.data = data;
		this.nextCursor = nextCursor;
	}
}

export class CursorPaginationRequestDto {
	@IsString()
	@IsOptional()
	cursor?: string;

	@IsInt()
	@IsOptional()
	@Type(() => Number)
	limit: number = 10;
}
