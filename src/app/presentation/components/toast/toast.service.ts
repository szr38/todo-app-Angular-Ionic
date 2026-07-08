import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';

export type ToastVariant = 'success' | 'error';

export interface ToastOptions {
  duration?: number;
  variant?: ToastVariant;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastController = inject(ToastController);
  private iconsRegistered = false;

  async show(message: string, options: ToastOptions = {}): Promise<void> {
    this.registerIcons();

    const isError = options.variant === 'error';

    const toast = await this.toastController.create({
      header: isError ? 'Error' : 'Exitoso',
      message,
      icon: isError ? 'close-circle' : 'checkmark-circle',
      color: isError ? 'danger' : 'success',
      duration: options.duration ?? 2000,
      position: 'middle',
    });

    await toast.present();
  }

  private registerIcons(): void {
    if (this.iconsRegistered) {
      return;
    }

    addIcons({ checkmarkCircle, closeCircle });
    this.iconsRegistered = true;
  }
}
