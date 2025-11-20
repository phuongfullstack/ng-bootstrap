import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export const ageRangeValidator = (
  min: number,
  max: number
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numericValue = typeof value === 'number' ? value : Number(value);

    if (Number.isNaN(numericValue)) {
      return {
        ageRange: {
          min,
          max,
          actual: value,
          message: 'Giá trị tuổi phải là số hợp lệ.'
        }
      };
    }

    if (numericValue < min) {
      return {
        ageRange: {
          min,
          max,
          actual: numericValue,
          message: `Tuổi tối thiểu là ${min}.`
        }
      };
    }

    if (numericValue > max) {
      return {
        ageRange: {
          min,
          max,
          actual: numericValue,
          message: `Tuổi tối đa là ${max}.`
        }
      };
    }

    return null;
  };
};

