import { MeUserDocumentType } from '../../infrastructure/query/models/get.me-user.document.type';

export class UserMeViewModel {
  id: number;
  login: string;
  email: string;

  constructor({ id, email, login }: MeUserDocumentType) {
    this.id = id;
    this.login = login;
    this.email = email;
  }
}
