export type UserPasswordRecoveryInputModel = {
  userId: number;
  recoveryCode: string | null;
  codeExpirationDate: string | null;
};
