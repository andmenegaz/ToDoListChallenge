import { Component, OnInit } from '@angular/core';
import { TodoListService } from '../shared/todolist.service'
import { ToDoList } from '../shared/todolist.model';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  status: number = 0
  toDoList: ToDoList[]

  constructor(private TodoListService: TodoListService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loadTasks()
  }

  loadTasks(): void {
    this.TodoListService.todolist(this.status)
      .subscribe(toDoList => this.toDoList = toDoList)
  }

  changeStatus(status: number) {
    this.status = status
    this.loadTasks()
  }

  delete(taskId: number) {
    this.TodoListService.deleteTask(taskId)
      .subscribe(() => this.loadTasks())
  }

  checkStatus(task: ToDoList) {
    console.log(task)
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
        else{
          alert('Invalid Password');
        }
      }
    }
  }

  updateStatus(task: ToDoList) {
    this.TodoListService.updateTask(task)
      .subscribe(() => this.loadTasks())
  }

  static checkPassword(group: AbstractControl): { [key: string]: boolean } {
    let password = group.get('password');
    if (password.value !== "TrabalheNaSaipos") {
      return { passwordInvalid: true }
    }
    return undefined;
  }
}
