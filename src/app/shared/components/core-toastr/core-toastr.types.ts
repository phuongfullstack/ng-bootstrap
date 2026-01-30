export type CoreToastVariant = 'default' | 'success' | 'info' | 'warning' | 'error' | 'danger';
export type CoreToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// Constants for toast configuration
export const TOAST_DEFAULTS = {
  VARIANT: 'default' as CoreToastVariant,
  AUTO_CLOSE: true,
  DURATION: 4000,  // 4 seconds - keep original value for backward compatibility
  DISMISSIBLE: true,
  POSITION: 'top-right' as CoreToastPosition,
  MAX_VISIBLE: 3,
  STACK_GAP: 16,
  MAX_QUEUE: 6  // Keep original value for backward compatibility
} as const;

// Variants that require assertive announcement for screen readers
export const TOAST_ASSERTIVE_VARIANTS: CoreToastVariant[] = ['error', 'danger'];
export const TOAST_POLITE_VARIANTS: CoreToastVariant[] = ['default', 'success', 'info', 'warning'];

export interface CoreToastAction {
  id: string;
  label: string;
  variant?: 'primary' | 'link' | 'ghost';
  dismissOnClick?: boolean;
  handler?: () => void;
}

export interface CoreToastCreate {
  id?: string;
  title?: string;
  message: string;
  variant?: CoreToastVariant;
  autoClose?: boolean;
  duration?: number;
  dismissible?: boolean;
  actions?: CoreToastAction[];
  data?: Record<string, unknown>;
}

export interface CoreToastInstance extends CoreToastCreate {
  id: string;
  title?: string;
  variant: CoreToastVariant;
  autoClose: boolean;
  duration: number;
  dismissible: boolean;
  actions: CoreToastAction[];
  data?: Record<string, unknown>;
  createdAt: number;
}

export type CoreToastRemovalReason = 'manual' | 'timeout' | 'action';

