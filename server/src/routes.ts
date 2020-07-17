import express from 'express'

import ToDoListController from './controllers/ToDoListController';

const routes = express.Router();

const toDoListController = new ToDoListController;

routes.get('/todolist', toDoListController.index)

routes.post('/todolist', toDoListController.create)

routes.put('/todolist', toDoListController.update)

routes.delete('/todolist/:id', toDoListController.delete)


export default routes
