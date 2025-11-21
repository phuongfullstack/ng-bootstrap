import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export const textLengthValidator = (
  min: number,
  errorKey = 'textLength'
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined) {
      return {
        [errorKey]: {
          min,
          actualLength: 0,
          message: `Tối thiểu ${min} ký tự.`
        }
      };
    }

    const stringValue = String(value).trim();
    const length = stringValue.length;

    if (length >= min) {
      return null;
    }

    return {
      [errorKey]: {
        min,
        actualLength: length,
        message: `Tối thiểu ${min} ký tự (hiện tại ${length}).`
      }
    };
  };
};

