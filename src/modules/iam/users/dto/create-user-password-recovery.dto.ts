export type CreateUserPasswordRecoveryDto = {
  userId: number;
  recoveryCode: string | null;
  codeExpirationDate: string | null;
};
