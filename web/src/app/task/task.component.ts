import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms'
import { ToDoList } from '../shared/todolist.model';
import { TodoListService } from '../shared/todolist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  taskForm: FormGroup

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private toDoListService: TodoListService) { }

  ngOnInit(): void {
    this.taskForm = new FormGroup({
      title: new FormControl('', { validators: [Validators.required, Validators.minLength(5)] }),
      name: new FormControl('', { validators: [Validators.required, Validators.minLength(2)] }),
      email: new FormControl('', { validators: [Validators.required, TaskComponent.emailValidation] }),
    })
  }

  static emailValidation(group: AbstractControl): { [key: string]: boolean } {
    const email = group.get('email')
    return undefined
  }

  save(task: ToDoList) {
    task.status = 0;
    task.changescount = 0;
    this.toDoListService.createTask(task)
      .subscribe((taskId: String) => {
        this.router.navigate(['/'])
      })
  }
}
