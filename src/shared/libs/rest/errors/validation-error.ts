export type ValidationErrorField = {
  property: string;
  value: string;
  messages: string[];
};

export class ValidationError extends Error {
  public details: ValidationErrorField[] = [];

  constructor(message: string, errors: ValidationErrorField[]) {
    super(message);

    this.details = errors;
  }
}
