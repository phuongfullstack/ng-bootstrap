import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

type PredicateFn = (parent: AbstractControl | null) => boolean;

export const requiredIfValidator = (
  predicate: PredicateFn,
  errorKey = 'requiredIf'
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const shouldRequire = predicate(control.parent);

    if (!shouldRequire) {
      return null;
    }

    const value = control.value;
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '');

    if (isEmpty) {
      return {
        [errorKey]: {
          message: 'Trường này bắt buộc trong ngữ cảnh hiện tại.'
        }
      };
    }

    return null;
  };
};

