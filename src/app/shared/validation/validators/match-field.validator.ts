import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export const matchFieldValidator = (
  targetControlName: string,
  errorKey = 'fieldsMismatch'
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }

    const targetControl = control.parent.get(targetControlName);
    if (!targetControl) {
      return null;
    }

    const value = control.value;
    const targetValue = targetControl.value;

    if (value === targetValue) {
      return null;
    }

    return {
      [errorKey]: {
        target: targetControlName,
        message: 'Giá trị không trùng khớp.'
      }
    };
  };
};

