import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class BaseQueryParams {
  @Type(() => Number)
  @Min(1)
  pageNumber: number = 1;

  @Type(() => Number)
  @Min(1)
  pageSize: number = 10;

  sortDirection: SortDirection = SortDirection.Desc;

  getSortDirection() {
    return this.sortDirection.toUpperCase() === 'ASC'
      ? SortDirection.Asc
      : SortDirection.Desc;
  }

  getSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}
