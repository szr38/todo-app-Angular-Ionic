import { Component, computed, input, output } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

import { Category, CategoryId, isCategoryId } from '../../../domain/models/category.model';
import { CATEGORY_SELECT_OPTIONS } from '../../constants/category-select.constants';
import { Task } from '../../../domain/models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonCheckbox,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
  ],
})
export class TaskItemComponent {
  readonly categorySelectOptions = CATEGORY_SELECT_OPTIONS;

  task = input.required<Task>();
  categories = input<Category[]>([]);

  category = computed(() =>
    this.categories().find((c) => c.id === this.task().categoryId),
  );

  categoryBackground = computed(() => {
    const color = this.category()?.color;
    return color ? `${color}22` : undefined;
  });

  categoryColor = computed(() => this.category()?.color);

  toggled = output<Task>();
  deleted = output<string>();
  categoryChanged = output<{ task: Task; categoryId: CategoryId }>();

  constructor() {
    addIcons({ trashOutline });
  }

  onToggle() {
    this.toggled.emit(this.task());
  }

  onDelete() {
    this.deleted.emit(this.task().id);
  }

  onCategoryChange(event: CustomEvent) {
    const value = event.detail.value as string;
    if (isCategoryId(value) && value !== this.task().categoryId) {
      this.categoryChanged.emit({ task: this.task(), categoryId: value });
    }
  }
}
