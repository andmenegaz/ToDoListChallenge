import { Component, OnInit } from '@angular/core';
import { TodoListService } from '../shared/todolist.service'
import { ToDoList, CatFacts } from '../shared/todolist.model';
import { FormBuilder, AbstractControl } from '@angular/forms'
import { BehaviorSubject, timer, Observable, concat } from 'rxjs';
import { switchMap, concatMap } from 'rxjs/operators';
import { map } from 'rxjs-compat/operator/map';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lastCount: number = 0;
  
  status: number = 0
  toDoList$: Observable<ToDoList[]>

  constructor(private toDoListService: TodoListService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const count$ = this.toDoListService.getPollingCount()

    timer(0, 3000)
        .pipe(concatMap(() => count$))
        .subscribe((count:number) => {
          if (count !== this.lastCount){
            this.lastCount = count;
            this.loadTasks()
          }
        })

    this.loadTasks();
  }

  loadTasks(): void {
    this.toDoList$ = this.toDoListService.todolist(this.status)
  }

  changeStatus(status: number) {
    this.status = status
    this.loadTasks()
  }

  delete(taskId: number) {
    this.toDoListService.deleteTask(taskId)
      .subscribe(() => this.loadTasks())
  }

  checkStatus(task: ToDoList) {
    if (task.status == 0) {
      task.status = 1
      this.updateStatus(task);
    }
    else if (task.changescount >= 2) {
      alert("Changes limit exceeded")
    }
    else {
      let password = prompt("Enter Password : ", "Supervisor's Password");
      if (password !== null) {

        if (password == "TrabalheNaSaipos") {
          task.status = 0
          this.updateStatus(task);
        }
        else {
          alert('Invalid Password');
        }
      }
    }
  }

  updateStatus(task: ToDoList) {
    this.toDoListService.updateTask(task)
      .subscribe(() => this.loadTasks())
  }

  static checkPassword(group: AbstractControl): { [key: string]: boolean } {
    let password = group.get('password');
    if (password.value !== "TrabalheNaSaipos") {
      return { passwordInvalid: true }
    }
    return undefined;
  }

  getFacts() {
    let taskTemp: ToDoList = {
      id: 0,
      title: "",
      name: "Eu",
      email: "eu@me.com",
      status: 0,
      changescount: 0
    }

    this.toDoListService.getFacts()
      .subscribe((response: CatFacts[]) => {
        response.map(fact => {
          taskTemp.title = fact.text

          this.toDoListService.createTask(taskTemp)
            .subscribe((taskId: String) => {})
        })
        this.loadTasks();
      })
  }
}
