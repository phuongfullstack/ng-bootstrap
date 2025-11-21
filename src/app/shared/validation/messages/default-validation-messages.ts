import { ValidationErrors } from '@angular/forms';
import {
  ValidationMessageMap,
  ValidationMessageResolver
} from '../types';

const extractLength = (
  error: ValidationErrors['minlength'] | ValidationErrors['maxlength']
): number | undefined => error?.requiredLength;

const defaultResolver =
  (message: string): ValidationMessageResolver =>
    () =>
      message;

export const defaultValidationMessages: ValidationMessageMap = {
  required: defaultResolver('Trường này là bắt buộc.'),
  requiredTrue: defaultResolver('Bạn cần chấp nhận trước khi tiếp tục.'),
  email: defaultResolver('Vui lòng nhập địa chỉ email hợp lệ.'),
  minlength: (error) =>
    `Độ dài tối thiểu là ${extractLength(error as ValidationErrors['minlength'])
    } ký tự.`,
  maxlength: (error) =>
    `Độ dài tối đa là ${extractLength(error as ValidationErrors['maxlength'])
    } ký tự.`,
  min: (error) =>
    `Giá trị phải lớn hơn hoặc bằng ${(error as ValidationErrors['min'])?.min}.`,
  max: (error) =>
    `Giá trị phải nhỏ hơn hoặc bằng ${(error as ValidationErrors['max'])?.max}.`,
  pattern: defaultResolver('Giá trị không khớp với mẫu yêu cầu.'),
  ageRange: (error) =>
    (error as { message?: string })?.message ??
    'Giá trị nằm ngoài khoảng cho phép.',
  textLength: (error) =>
    (error as { message?: string })?.message ??
    `Chuỗi hiện tại ngắn hơn độ dài yêu cầu.`,
  emailDomain: (error) =>
    (error as { message?: string })?.message ??
    'Miền email không được phép.',
  requiredIf: (error) =>
    (error as { message?: string })?.message ??
    'Trường này bắt buộc trong ngữ cảnh hiện tại.',
  fieldsMismatch: (error) =>
    (error as { message?: string })?.message ??
    'Giá trị không trùng khớp.'
};

