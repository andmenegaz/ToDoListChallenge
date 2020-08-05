import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, ValidationErrors } from '@angular/forms'
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
      title: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    })
  }

  save(task: ToDoList) {
    task.status = 0;
    task.changescount = 0;
    this.toDoListService.createTask(task)
      .subscribe((taskId: String) => {
        this.router.navigate(['/'])
      }, (response: any) => {
        if (response.error?.validation != null)
        {
           let field = response.error?.validation.keys[0]
           this.taskForm.get(field).setErrors({ invalidEmail: response.error.message })
        }
      })
  }

  emailErrormessage() : String {
    if (this.taskForm.get('email').hasError('invalidEmail')) {
      return this.taskForm.get('email').getError('invalidEmail')
    }
    else {
      return "Campo Obrigatório"
    }
  }
}
