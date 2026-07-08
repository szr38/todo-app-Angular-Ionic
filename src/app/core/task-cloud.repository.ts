import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';

import { Task } from '../domain/models/task.model';
import { getFirebaseFirestore } from './firebase/firebase-app';

@Injectable({ providedIn: 'root' })
export class TaskCloudRepository {
  private readonly col = 'tasks';

  async getTasks(): Promise<Task[]> {
    const snap = await getDocs(collection(getFirebaseFirestore(), this.col));
    return snap.docs.map((doc) => doc.data() as Task);
  }

  async saveTask(task: Task): Promise<void> {
    await setDoc(doc(getFirebaseFirestore(), this.col, task.id), task);
  }

  async deleteTask(id: string): Promise<void> {
    await deleteDoc(doc(getFirebaseFirestore(), this.col, id));
  }
}
