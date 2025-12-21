import { UserDocumentModel } from '../../infrastructure/query/models/get-users-document-model';

export class UserViewModel {
  id: number;
  login: string;
  email: string;
  createdAt: string;

  constructor({ id, email, login, createdAt }: UserDocumentModel) {
    this.id = id;
    this.login = login;
    this.email = email;
    this.createdAt = createdAt;
  }
}
