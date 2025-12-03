export type CoreToastVariant = 'default' | 'success' | 'info' | 'warning' | 'error';
export type CoreToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

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

