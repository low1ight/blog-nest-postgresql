import { validateSync, ValidationError } from 'class-validator';

export class ConfigValidationUtility {
  static validate(config: object) {
    const errors = validateSync(config);
    if (errors.length > 0) {
      const sortedMessages = errors.map((e: ValidationError) => {
        const currentValue: any = e.value || '';
        const constraint = Object.values(e.constraints || {}).join(', ');
        return `${constraint} (currentValue: ${currentValue})`;
      });

      throw new Error(sortedMessages.join('; \n'));
    }
  }
}
