import knex from '../database/connection'
import { Request, Response } from 'express'

class ToDoList {
    constructor(
        public id: number,
        public title: string,
        public name: string,
        public email: string,
        public status: number,
        public changescount: number
    ) { }
}

class MailResponse {
    constructor(
        public email: string,
        public did_you_mean: string,
        public format_valid: boolean,
        public mx_found: boolean
    ){}
}

export default class ToDoListController {
    async show(request: Request, response: Response) {
        const { id } = request.params

        const todolist: ToDoList = await knex('todolist').where('id', id).first()

        if (!todolist) {
            return response.status(400).json({ message: "Item Not Found" })
        }
        else {
            return response.json(todolist)
        }

    }

    async index(request: Request, response: Response) {
        const { status } = request.query

        const todolist: ToDoList[] = await knex('todolist')
            .where('status', String(status))
            .select('*')

        return response.json(todolist)
    }

    async create(request: Request, response: Response) {
        const {
            title,
            name,
            email,
            status
        } = request.body

        let listItem = {
            title,
            name,
            email,
            status,
            changescount: 0,
        }

        await knex('todolist').insert(listItem)
            .then(resp => {
                return response.json(resp);
            }).catch(error => {
                return response.json(error);
            })
    }
    async update(request: Request, response: Response) {
        const {
            id,
            title,
            name,
            email,
            status
        } = request.body

        const task: ToDoList = await knex('todolist').where('id', id).first()

        if (!task) {
            return response.status(400).json({ message: "Item Not Found" })
        }
        else {
            if (task.status == 1 && status == 0) {
                task.changescount += 1;
            }

            let taskUpdate = {
                title,
                name,
                email,
                status,
                changescount: task.changescount
            }

            await knex('todolist').update(taskUpdate)
                .where('id', id)
                .then(resp => {
                    return response.json(resp);
                }).catch(error => {
                    return response.json(error);
                })
        }
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        await knex('todolist').where('id', id).delete()
            .then(resp => {
                return response.json(resp);
            }).catch(error => {
                return response.json(error);
            })
    }

     async teste(request: Request, response: Response) {
        //
     }
}