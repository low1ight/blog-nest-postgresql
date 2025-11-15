import { validateSync, ValidationError } from 'class-validator';

export class ConfigValidationUtility {
  static validate(config: object) {
    const errors = validateSync(config);
    if (errors.length > 0) {
      const sortedMessages = errors.map((e: ValidationError) => {
        console.log(e);
        const currentValue = (e.value || '') as string;
        const constraint = Object.values(e.constraints || {}).join(', ');
        return `${constraint} (currentValue: ${currentValue})`;
      });

      throw new Error(sortedMessages.join('; \n'));
    }
  }

  static convertToBoolean(value: string | undefined) {
    if (!value) return null;
    const trimmedValue = value.trim();
    const trueValues = ['true', '1', 'enabled'];
    const falseValues = ['false', '0', 'disabled'];

    if (trueValues.includes(trimmedValue)) return true;
    if (falseValues.includes(trimmedValue)) return false;
    return value;
  }
}
