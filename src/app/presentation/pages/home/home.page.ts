import { Component, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonSpinner,
  IonText,
  IonModal,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

import { CategoryId } from '../../../domain/models/category.model';
import { TaskListFilter } from '../../../domain/usecases/filter-tasks.usecase';
import { AddTaskModalComponent } from '../../components/add-task-modal/add-task-modal.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { TaskStore } from '../../state/task.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonList,
    IonSpinner,
    IonText,
    IonModal,
    FilterBarComponent,
    TaskItemComponent,
    AddTaskModalComponent,
  ],
})
export class HomePage implements OnInit {
  readonly store = inject(TaskStore);

  showModal = false;

  constructor() {
    addIcons({ add });
  }

  ngOnInit() {
    void this.store.init();
  }

  onFilterChange(filter: TaskListFilter) {
    this.store.setFilter(filter);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async onTaskSaved(data: { title: string; categoryId: CategoryId }) {
    await this.store.addTask(data.title, data.categoryId);
    this.closeModal();
  }
}
