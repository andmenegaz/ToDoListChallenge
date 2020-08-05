import { Component, OnInit } from '@angular/core';
import { TodoListService } from '../shared/todolist.service'
import { ToDoList } from '../shared/todolist.model';
import { FormBuilder } from '@angular/forms'
import { Observable, Subject, EMPTY, timer, of } from 'rxjs';
import { catchError, tap, switchAll, retryWhen, delayWhen, distinct } from 'rxjs/operators';
import { NotificationService } from '../shared/notification.service';
import { ModalService } from '../modal/modal.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private socket$: WebSocketSubject<any>
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));

  taskTmp: ToDoList;
  lastCount: number = 0;

  status: number = 0
  toDoList$: Observable<ToDoList[]>

  password: string;

  constructor(private toDoListService: TodoListService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.connect({ reconnect: true })

    this.loadTasks()
  }

  private getNewWebSocket() {
    return webSocket({
      url: 'ws://localhost:3333',
      closeObserver: {
        next: () => {
          console.log('[DataService]: connection closed');
          this.socket$ = undefined;
          this.connect({ reconnect: true });
        }
      },
    });
  }

  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log('[Data Service] Try to reconnect', val)),
      delayWhen(_ => timer(500)))));
  }

  public connect(cfg: { reconnect: boolean } = { reconnect: false }): void {



    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : o => o,
        tap({
          error: error => console.log(error),
        }), catchError(_ => EMPTY))
        .subscribe((message: any) => {
          if (message == "todolist") {
            this.loadTasks()
          }
        });
      this.messagesSubject$.next(messages);
    }
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
      .subscribe(() => { })
  }

  checkStatus(task: ToDoList) {
    if (task.status == 0) {
      task.status = 1
      this.updateStatus(task);
    }
    else if (task.changescount >= 2) {
      this.notificationService.notify("Changes limit exceeded")
    }
    else {
      this.taskTmp = task;
      this.openModal('modal')
    }
  }

  checkPassword() {
    if (this.password !== null) {

      if (this.password == "TrabalheNaSaipos") {
        this.taskTmp.status = 0
        this.updateStatus(this.taskTmp);
      }
      else {
        this.notificationService.notify(`Password Inválido`)
      }
    }
    this.password = ""
    this.closeModal('modal')
  }

  updateStatus(task: ToDoList) {
    this.toDoListService.updateTask(task)
      .subscribe(() => { })
  }

  getFacts() {
    this.toDoListService.getFacts()
      .subscribe((response: String) => { })
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
