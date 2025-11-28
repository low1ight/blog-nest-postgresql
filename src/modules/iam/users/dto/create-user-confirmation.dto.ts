export type CreateUserConfirmationDto = {
  userId: number;
  isConfirmed: boolean;
  confirmationCode: string | null;
  codeExpirationDate: string | null;
};
