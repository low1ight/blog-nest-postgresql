import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { UsersSortBy } from './users.sort-by';

export class UsersQueryParams extends BaseQueryParams {
  sortBy: string = UsersSortBy.CreatedAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
}
