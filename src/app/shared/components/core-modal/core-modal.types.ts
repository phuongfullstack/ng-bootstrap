import { Type } from '@angular/core';
import { BootstrapVariant } from '@shared/types/bootstrap-variant.types';

export interface ModalButton {
  label: string;
  style?: BootstrapVariant;
  icon?: string;
  disabled?: boolean;
  // Use `any` for the modal instance type to avoid circular runtime imports
  handler?: (modal?: any, dynamicInstance?: any) => void;
  closeOnClick?: boolean;
}

export interface ModalConfig {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  closable?: boolean;
  backdrop?: 'static' | true | false;
  showCloseButton?: boolean;
  buttons?: ModalButton[];
  customClass?: string;
  data?: any;
  // dynamic component to render in body
  content?: Type<any>;
  contentProps?: Record<string, any>;
}
