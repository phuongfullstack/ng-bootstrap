import { BootstrapVariant } from '@shared/types/bootstrap-variant.types';

export type CoreProgressVariant = BootstrapVariant;

/**
 * Progress bar item for multi-progress or stacked progress
 */
export interface CoreProgressItem {
  value: number;
  variant?: CoreProgressVariant;
  label?: string;
  striped?: boolean;
  animated?: boolean;
}

