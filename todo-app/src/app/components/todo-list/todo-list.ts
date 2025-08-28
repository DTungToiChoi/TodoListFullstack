import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, TodoService } from '../../services/todo-service';
import { finalize } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css']
})
export class TodoList implements OnInit {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  editingId: number | null = null;
  editingTitle: string = '';

  constructor(
    private todoService: TodoService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.ngZone.run(() => {
          this.todos = todos; // đã unwrap từ service
          this.isLoading = false;
          this.cd.detectChanges();
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          console.error('Error loading todos:', error);
          this.errorMessage = error.message || 'Không thể tải danh sách công việc. Vui lòng thử lại.';
          this.isLoading = false;
          this.cd.detectChanges();
        });
      }
    });
  }

  addTodo(): void {
    if (!this.newTodoTitle.trim()) return;

    this.isLoading = true;
    const newTodo: Todo = { id: 0, title: this.newTodoTitle.trim(), isDone: false };

    this.todoService.addTodo(newTodo).pipe(
      finalize(() => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.cd.detectChanges();
        });
      })
    ).subscribe({
      next: (todo) => {
        this.ngZone.run(() => {
          this.todos.unshift(todo);
          this.newTodoTitle = '';
          this.cd.detectChanges();
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          console.error('Error adding todo:', error);
          this.errorMessage = error.message || 'Không thể thêm công việc. Vui lòng thử lại.';
          this.cd.detectChanges();
        });
      }
    });
  }

  toggleTodo(todo: Todo): void {
    const updatedTodo: Todo = { ...todo, isDone: !todo.isDone };

    this.todoService.updateTodo(updatedTodo).subscribe({
      next: () => {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) this.todos[index] = updatedTodo;
        this.cd.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Không thể cập nhật công việc. Vui lòng thử lại.';
      }
    });
  }

  startEdit(todo: Todo): void {
    this.editingId = todo.id;
    this.editingTitle = todo.title;
  }

  saveEdit(): void {
    if (!this.editingTitle.trim() || this.editingId === null) return;

    const todoToUpdate = this.todos.find(t => t.id === this.editingId);
    if (!todoToUpdate) return;

    const updatedTodo: Todo = { ...todoToUpdate, title: this.editingTitle.trim() };

    this.todoService.updateTodo(updatedTodo).subscribe({
      next: () => {
        const index = this.todos.findIndex(t => t.id === this.editingId);
        if (index !== -1) this.todos[index] = updatedTodo;
        this.cancelEdit();
        this.cd.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Không thể cập nhật công việc. Vui lòng thử lại.';
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingTitle = '';
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.cd.detectChanges();
        console.log(`Todo ${id} deleted successfully`);
      },
      error: (err) => {
        console.error("Error deleting todo:", err);
      }
    });
  }

  trackByFn(index: number, todo: Todo): number {
    return index;
  }

  get completedCount(): number {
    return this.todos.filter(todo => todo.isDone).length;
  }

  get pendingCount(): number {
    return this.todos.filter(todo => !todo.isDone).length;
  }
}
