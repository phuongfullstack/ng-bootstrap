import { AbstractControl } from '@angular/forms';

export type ValidationMessageResolver =
  | string
  | ((errorValue: unknown, control: AbstractControl) => string);

export type ValidationMessageMap = Record<
  string,
  ValidationMessageResolver
>;

