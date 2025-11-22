import { UserDocumentModel } from '../user-document.model';

export class UserMeViewModel {
  id: number;
  login: string;
  email: string;

  constructor({ id, email, login }: UserDocumentModel) {
    this.id = id;
    this.login = login;
    this.email = email;
  }
}
