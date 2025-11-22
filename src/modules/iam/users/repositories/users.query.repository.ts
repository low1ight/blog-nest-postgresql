import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserDocumentModel } from '../models/user-document.model';
import { UserMeViewModel } from '../models/view/user-me.view.model';

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
