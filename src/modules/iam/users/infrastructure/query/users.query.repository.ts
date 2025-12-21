import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserMeViewModel } from '../../api/view-dto/user-me.view.model';
import { UserViewModel } from '../../api/view-dto/user.view.model';
import { UsersQueryParams } from '../../api/input-dto/get-users-query.dto';
import { MeUserDocumentType } from './models/get.me-user.document.type';
import { UserDocumentModel } from './models/get-users-document-model';

@Injectable()
export class UsersQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getUsers(query: UsersQueryParams): Promise<UserViewModel[]> {
    const searchByLogin = query.searchLoginTerm
      ? `%${query.searchLoginTerm}%`
      : '%';
    const searchByEmail = query.searchEmailTerm
      ? `%${query.searchEmailTerm}%`
      : '%';

    const users: UserDocumentModel[] = await this.dataSource.query(
      `
    SELECT "id","login","email","createdAt" 
    FROM users
    WHERE "email" ILIKE $2 AND "login" ILIKE $3
    ORDER BY "${query.sortBy}" ${query.getSortDirection()} 
    LIMIT $1
    OFFSET ${query.getSkip()}
    
    
                     
    `,
      [query.pageSize, searchByEmail, searchByLogin],
    );
    return users.map((user) => new UserViewModel(user));
  }

  async getUserMe(userId: number) {
    const result: MeUserDocumentType[] = await this.dataSource.query(
      `
    SELECT "id", "login", "email" 
    FROM public.users 
    WHERE id = $1
    `,
      [userId],
    );

    return result[0] && new UserMeViewModel(result[0]);
  }

  async getUserById(userId: number) {
    const result: UserDocumentModel[] = await this.dataSource.query(
      `
    SELECT "id", "login", "email","createdAt"
    FROM public.users 
    WHERE id = $1
    `,
      [userId],
    );

    return result[0] && new UserViewModel(result[0]);
  }
}
