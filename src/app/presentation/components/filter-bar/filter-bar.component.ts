import { Component, input, output } from '@angular/core';
import { IonSegment, IonSegmentButton, IonLabel, IonBadge } from '@ionic/angular/standalone';

import { Category } from '../../../domain/models/category.model';
import {
  TaskFilter,
  TaskListFilter,
  isTaskListFilter,
} from '../../../domain/usecases/filter-tasks.usecase';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  imports: [IonSegment, IonSegmentButton, IonLabel, IonBadge],
})
export class FilterBarComponent {
  readonly TaskFilter = TaskFilter;

  categories = input<Category[]>([]);
  activeFilter = input<TaskListFilter>(TaskFilter.All);
  pendingCount = input(0);

  filterChange = output<TaskListFilter>();

  onFilterChange(event: CustomEvent) {
    const value = event.detail.value as string;

    if (isTaskListFilter(value)) {
      this.filterChange.emit(value);
    }
  }
}
