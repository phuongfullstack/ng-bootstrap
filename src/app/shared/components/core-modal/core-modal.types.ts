import { Type } from '@angular/core';
import { BootstrapVariant } from '@shared/types/bootstrap-variant.types';

export interface ModalButton {
  label: string;
  style?: BootstrapVariant;
  icon?: string;
  disabled?: boolean;

  // Handler can return:
  // - void/undefined: close modal if closeOnClick !== false
  // - boolean: false prevents closing, true allows closing
  // - Promise<boolean>: async handler, resolves to boolean to control closing
  handler?: (modal?: any, dynamicInstance?: any) => void | boolean | Promise<boolean>;
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
  content?: Type<any>;
  contentProps?: Record<string, any>;
}
