/**
 * Common constants used across the application
 */

// Modal constants
export const MODAL_DEFAULTS = {
  SIZE: 'lg' as const,
  CLOSABLE: true,
  BACKDROP: true as const,
  SHOW_CLOSE_BUTTON: true
} as const;

export const MODAL_SIZES = ['sm', 'md', 'lg', 'xl', 'fullscreen'] as const;
export type ModalSize = typeof MODAL_SIZES[number];

// Button constants
export const BUTTON_DEFAULTS = {
  TYPE: 'button' as const,
  VARIANT: 'primary' as const,
  SIZE: 'md' as const,
  DISABLED: false,
  LOADING: false,
  BLOCK: false,
  OUTLINE: false,
  ROUNDED: false,
  ROUNDED_CIRCLE: false,
  ICON_POSITION: 'left' as const,
  DRAGGABLE: false
} as const;

export const BUTTON_VARIANTS = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
  'link'
] as const;

export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;

// Form control constants
export const FORM_CONTROL_SIZES = ['sm', 'md', 'lg'] as const;

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: 'Minimum length is',
  MAX_LENGTH: 'Maximum length is',
  PATTERN: 'Invalid format',
  MIN: 'Value must be at least',
  MAX: 'Value must not exceed'
} as const;

// Accessibility labels
export const A11Y_LABELS = {
  CLOSE: 'Close',
  CLOSE_MODAL: 'Close modal',
  CLOSE_NOTIFICATION: 'Close notification',
  LOADING: 'Loading',
  REQUIRED_FIELD: 'Required field',
  SEARCH: 'Search',
  CLEAR: 'Clear',
  SELECT: 'Select',
  SELECTED: 'Selected',
  NOTIFICATIONS: 'Notifications',
  SORT_ASCENDING: 'Sort ascending',
  SORT_DESCENDING: 'Sort descending'
} as const;

// Table constants
export const TABLE_DEFAULTS = {
  PAGE_SIZE: 10,
  CURRENT_PAGE: 1,
  SORTABLE: true,
  SELECTABLE: false
} as const;

// Autocomplete constants
export const AUTOCOMPLETE_DEFAULTS = {
  DEBOUNCE_TIME: 300,
  MIN_SEARCH_LENGTH: 1,
  MAX_RESULTS: 10
} as const;

// Progress constants
export const PROGRESS_DEFAULTS = {
  MIN_VALUE: 0,
  MAX_VALUE: 100,
  VARIANT: 'primary' as const
} as const;

// Common text
export const COMMON_TEXT = {
  CANCEL: 'Cancel',
  CONFIRM: 'Confirm',
  SAVE: 'Save',
  DELETE: 'Delete',
  EDIT: 'Edit',
  CREATE: 'Create',
  UPDATE: 'Update',
  OK: 'OK',
  YES: 'Yes',
  NO: 'No',
  LOADING: 'Loading...',
  NO_DATA: 'No data available',
  NO_RESULTS: 'No results found',
  SEARCH_PLACEHOLDER: 'Search...'
} as const;
