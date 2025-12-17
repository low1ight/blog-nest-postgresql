import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserDocumentModel } from '../dto/user-document.model';
import { UserMeViewModel } from '../api/view-dto/user-me.view.model';

@Injectable()
export class UsersQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getUserMe(userId: number) {
    const result: UserDocumentModel[] = await this.dataSource.query(
      `
    SELECT "id", "login", "email" 
    FROM public.users 
    WHERE id = $1
    `,
      [userId],
    );

    return result[0] && new UserMeViewModel(result[0]);
  }
}
