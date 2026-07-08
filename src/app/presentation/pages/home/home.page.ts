import { NgTemplateOutlet } from '@angular/common';
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
  IonButtons,
  IonButton,
  Platform,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, cloud, cloudOffline } from 'ionicons/icons';

import { CategoryId } from '../../../domain/models/category.model';
import { Task } from '../../../domain/models/task.model';
import { TaskListFilter } from '../../../domain/usecases/filter-tasks.usecase';
import { AddTaskModalComponent } from '../../components/add-task-modal/add-task-modal.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { ToastService } from '../../components/toast/toast.service';
import { TaskStore } from '../../state/task.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    NgTemplateOutlet,
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
    IonButtons,
    IonButton,
    FilterBarComponent,
    TaskItemComponent,
    AddTaskModalComponent,
  ],
})
export class HomePage implements OnInit {
  readonly store = inject(TaskStore);
  private readonly platform = inject(Platform);
  private readonly toast = inject(ToastService);

  readonly isIos = this.platform.is('ios');

  showModal = false;

  constructor() {
    addIcons({ add, cloud, cloudOffline });
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
    await this.toast.show('Tarea creada');
  }

  async onTaskToggled(task: Task) {
    await this.store.toggleTask(task);
    await this.toast.show(
      task.completed ? 'Tarea marcada como pendiente' : 'Tarea marcada como completada',
    );
  }

  async onTaskDeleted(id: string) {
    const task = this.store.tasks().find((t) => t.id === id);
    await this.store.removeTask(id);
    await this.toast.show(task ? `"${task.title}" eliminada` : 'Tarea eliminada');
  }

  async onCategoryChanged(task: Task, categoryId: CategoryId) {
    await this.store.updateCategory(task, categoryId);
    const category = this.store.categories().find((c) => c.id === categoryId);
    await this.toast.show(
      category ? `Categoría cambiada a ${category.name}` : 'Categoría actualizada',
    );
  }

  async toggleCloudSync() {
    const syncFailed = await this.store.toggleCloudSync();
    const enabled = this.store.cloudSyncEnabled();

    await this.toast.show(
      syncFailed
        ? 'No se pudo sincronizar con la nube. Revisa la consola del navegador.'
        : enabled
          ? 'Sincronización en la nube activada'
          : 'Sincronización en la nube desactivada',
      { duration: syncFailed ? 3500 : 2000, variant: syncFailed ? 'error' : 'success' },
    );
  }
}
