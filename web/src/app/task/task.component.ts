import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, ValidationErrors } from '@angular/forms'
import { ToDoList, MailResponse } from '../shared/todolist.model';
import { TodoListService } from '../shared/todolist.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, debounceTime, debounce, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
      title: new FormControl('', [Validators.required, Validators.minLength(5)]),
      name: new FormControl('', [Validators.minLength(2)]),
      email: new FormControl('', [Validators.required], this.emailValidation.bind(this)),
    }, { updateOn: 'blur' })
  }

  emailValidation(email: AbstractControl): Observable<ValidationErrors | null> {
    return this.toDoListService.verifyEmail(String(email.value))
      .pipe(map((response: MailResponse) => {
        console.log(response)
        if (!response.format_valid || !response.mx_found) {
          let errorMessage = "E-mail Inválido"
          if (response.did_you_mean?.length > 0) {
            errorMessage = `Você quis Dizer ${response.did_you_mean}`
          }
          return { invalidEmail: errorMessage }
        }
        return null
      }))
  }  

  save(task: ToDoList) {
    task.status = 0;
    task.changescount = 0;
    this.toDoListService.createTask(task)
      .subscribe((taskId: String) => {
        this.router.navigate(['/'])
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
