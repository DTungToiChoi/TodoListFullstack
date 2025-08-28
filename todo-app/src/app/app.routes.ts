import { Routes } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
export const routes: Routes = [
  { path: 'todos', component: TodoList },
  { path: '', redirectTo: 'todos', pathMatch: 'full' }
];
