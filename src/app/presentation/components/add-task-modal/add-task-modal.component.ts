import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, addOutline } from 'ionicons/icons';

import { Category, CategoryId, isCategoryId } from '../../../domain/models/category.model';
import { CATEGORY_SELECT_OPTIONS } from '../../constants/category-select.constants';
@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonIcon,
  ],
})
export class AddTaskModalComponent {
  readonly categorySelectOptions = CATEGORY_SELECT_OPTIONS;

  categories = input<Category[]>([]);

  dismissed = output<void>();
  saved = output<{ title: string; categoryId: CategoryId }>();

  title = signal('');
  categoryId = signal<CategoryId | null>(null);

  constructor() {
    addIcons({ closeOutline, addOutline });
  }

  onDismiss() {
    this.dismissed.emit();
  }

  onTitleChange(event: CustomEvent) {
    this.title.set((event.detail.value as string) ?? '');
  }

  onCategoryChange(event: CustomEvent) {
    const value = event.detail.value as string;
    this.categoryId.set(isCategoryId(value) ? value : null);
  }

  onSave() {
    const title = this.title().trim();
    const categoryId = this.categoryId();

    if (!title || categoryId === null) {
      return;
    }

    this.saved.emit({ title, categoryId });
    this.title.set('');
    this.categoryId.set(null);
  }
}
