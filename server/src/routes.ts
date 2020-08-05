import express from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import ToDoListController from './controllers/ToDoListController'
import MailBoxController from './controllers/MailBoxController'

const routes = express.Router();

const toDoListController = new ToDoListController;
const mailBoxController = new MailBoxController;

routes.get('/todolist', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        status: Joi.number()
    })
}), toDoListController.index)

routes.post('/todolist', celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required().min(5),
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        status: Joi.number(),
        changescount: Joi.number()
    })
}), mailBoxController.verifyEmail, toDoListController.create)

routes.put('/todolist', toDoListController.update)

routes.delete('/todolist/:id', toDoListController.delete)

routes.post('/getfacts', toDoListController.getFacts)

export default routes
