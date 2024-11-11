import { Type } from "@angular/core";

export interface UiAlert {
  message: string;
  type: 'primary' | 'success' | 'warning' | 'danger';
  icon: 'pi pi-check' | 'pi pi-exclamation-triangle' | 'pi pi-info-circle' | 'pi pi-ban';
  position: 'top-end' | 'top-center';
}
export interface UiToast {
  message: string;
  title?: string;
  type?: 'success' | 'info' | 'warn' | 'error';
  placement?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  showHeader?: boolean;
  icon?: 'pi pi-check' | 'pi pi-exclamation-triangle' | 'pi pi-info-circle' | 'pi pi-ban';
  delay?: number;
  autoHide?: boolean;
  closable?: boolean;
}
export interface UiModal {
  title?: string;
  bodyComponent?: Type<any>;
  bodyData?: any; // Dữ liệu truyền vào component
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showFooter?: boolean;
  size?: '30vw' | '40vw' | '50vw' | '50vw' | '70vw' | '90vw'; // Thêm thuộc tính size
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

export interface UiConfirm {
  title?: string;
  message?: string;
  icon?: 'pi pi-check' | 'pi pi-exclamation-triangle' | 'pi pi-info-circle' | 'pi pi-ban' | 'pi pi-question-circle';
  iconColor?: 'red' | 'green' | 'yellow' | 'primary';
  type?: 'success' | 'info' | 'warning' | 'error';
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonIcon?: 'pi pi-check' | 'pi pi-save';
  cancelButtonIcon?: 'pi pi-times';
  onConfirmAction?: () => void;
  onCancelAction?: () => void;

}
