import { ReactNode } from 'react';

export interface BetterSheetProps {
  /**
   * Controls whether the bottom sheet is visible
   */
  visible: boolean;

  /**
   * Callback fired when the sheet is closed/dismissed
   */
  onClose?: () => void;

  /**
   * Array of snap point heights as fractions of screen height (0-1)
   * Example: [0.25, 0.6, 0.9] for 25%, 60%, and 90% heights
   * @default [0.25, 0.6, 0.9]
   */
  snapPoints?: number[];

  /**
   * Index of the snap point to initially open to (0-based)
   * @default 1
   */
  initialSnapIndex?: number;

  /**
   * Opacity of the backdrop overlay (0-1)
   * @default 0.35
   */
  backdropOpacity?: number;

  /**
   * Whether tapping the backdrop should close the sheet
   * @default true
   */
  closeOnBackdropPress?: boolean;

  /**
   * Content to render inside the bottom sheet
   */
  children?: ReactNode;
}

/**
 * A highly customizable and performant React Native bottom sheet component
 * with snap points, smooth animations, and scroll coordination
 */
export function BetterSheet(props: BetterSheetProps): JSX.Element | null;
