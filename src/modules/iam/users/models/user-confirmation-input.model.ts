export type UserConfirmationInputModel = {
  userId: number;
  isConfirmed: boolean;
  confirmationCode: string | null;
  codeExpirationDate: string | null;
};
