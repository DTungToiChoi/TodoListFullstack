import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  isDone: boolean;
}

export interface ApiRespone<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:5001/api/Todo';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<ApiRespone<Todo[]>>(this.apiUrl).pipe(
      map(resp => {
        if (!resp.success) throw new Error(resp.error || 'Lỗi khi lấy danh sách todos');
        return resp.data;
      })
    );
  }

  getTodo(id: number): Observable<Todo> {
    return this.http.get<ApiRespone<Todo>>(`${this.apiUrl}/${id}`).pipe(
      map(resp => {
        if (!resp.success) throw new Error(resp.error || 'Lỗi khi lấy todo');
        return resp.data;
      })
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<ApiRespone<Todo>>(this.apiUrl, todo).pipe(
      map(resp => {
        if (!resp.success) throw new Error(resp.error || 'Lỗi khi thêm todo');
        return resp.data;
      })
    );
  }

  updateTodo(todo: Todo): Observable<void> {
    return this.http.put<ApiRespone<null>>(`${this.apiUrl}/${todo.id}`, todo).pipe(
      map(resp => {
        if (!resp.success) throw new Error(resp.error || 'Lỗi khi cập nhật todo');
      })
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<ApiRespone<null>>(`${this.apiUrl}/${id}`).pipe(
      map(resp => {
        if (!resp.success) throw new Error(resp.error || 'Lỗi khi xóa todo');
      })
    );
  }
}
