import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from '@angular/common/http'
import { APP_API } from "../app.api"
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import { Observable } from "rxjs"
import { ToDoList } from './todolist.model'

@Injectable()
export class TodoListService {

  constructor(private http: HttpClient) { }

  todolist(status: number): Observable<ToDoList[]> {
    let params: HttpParams = new HttpParams().set('status', String(status))
    return this.http.get<ToDoList[]>(`${APP_API}/todolist`, { params: params })
  }

  createTask(task: ToDoList): Observable<String> {
    return this.http.post<String>(`${APP_API}/todolist`, task)
  }

  deleteTask(taskId: number): Observable<String> {
    return this.http.delete<String>(`${APP_API}/todolist/${taskId}`)
  }

  updateTask(task: ToDoList): Observable<String> {
    return this.http.put<String>(`${APP_API}/todolist`, task)
  }
}