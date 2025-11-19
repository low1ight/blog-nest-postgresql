export function configValidationMessage(
  envName: string,
  correctValueExample: string,
) {
  return `'Set Env variable ${envName}, example: ${correctValueExample}`;
}

export const configValidationCorrectValueExample = {
  boolean: 'true, false, 0, 1, enabled, disabled',
};
