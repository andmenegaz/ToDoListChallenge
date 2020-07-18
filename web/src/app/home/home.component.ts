import { Component, OnInit } from '@angular/core';
import { TodoListService } from '../shared/todolist.service'
import { ToDoList, CatFacts } from '../shared/todolist.model';
import { FormBuilder, AbstractControl } from '@angular/forms'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  status: number = 0
  toDoList: ToDoList[]

  constructor(private toDoListService: TodoListService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loadTasks()
  }

  loadTasks(): void {
    this.toDoListService.todolist(this.status)
      .subscribe(toDoList => this.toDoList = toDoList)
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
