import { z } from 'zod'

export class SchemaValidationErrorBag {
  private zodError: z.ZodError
  private message: string
  constructor(message: string, zodError: z.ZodError) {
    this.message = message
    this.zodError = zodError
  }

  public getMessage(): string {
    return this.message
  }

  public getError(key: string): string | undefined {
    return this.zodError.errors.find((error) => error.path.join('.') === key)
      ?.message
  }
}
