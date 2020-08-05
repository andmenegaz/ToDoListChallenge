import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TodoListService } from './shared/todolist.service';
import { TaskComponent } from './task/task.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from './shared/input/input.component';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { NotificationService } from './shared/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal/modal.service';
import {ApplicationErrorHandler} from './app.error-handler'


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TaskComponent,
    InputComponent,
    SnackbarComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [TodoListService, NotificationService, ModalService,
    { provide: ErrorHandler, useClass: ApplicationErrorHandler}],
  bootstrap: [AppComponent]
})
export class AppModule { }
