import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailDomainValidator = (
  allowedDomains: string[],
  errorKey = 'emailDomain'
): ValidatorFn => {
  const normalizedDomains = allowedDomains.map((d) => d.toLowerCase().trim());

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const email = String(value).trim();
    if (!EMAIL_REGEX.test(email)) {
      return {
        [errorKey]: {
          allowedDomains,
          message: 'Định dạng email không hợp lệ.'
        }
      };
    }

    const domain = email.split('@')[1]?.toLowerCase() ?? '';
    if (normalizedDomains.includes(domain)) {
      return null;
    }

    return {
      [errorKey]: {
        allowedDomains,
        actualDomain: domain,
        message: `Email phải thuộc miền: ${allowedDomains.join(', ')}.`
      }
    };
  };
};

