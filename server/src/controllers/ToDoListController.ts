import axios, { AxiosResponse } from 'axios'
import knex from '../database/connection'
import { Request, Response } from 'express'
import WsServer from '../websocket'

const CAT_API = 'https://cat-fact.herokuapp.com/facts/random?animal_type=dog&amount=3'

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

class CatFacts {
    constructor(
        public text: string
    ) { }
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
                WsServer.sendBroadCast("todolist")

                return response.json(resp);
            }).catch(error => {
                return response.json(error);
            })
    }

    async update(request: Request, response: Response) {
        const password = request.headers?.authorization

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
                if (task.changescount >= 2){
                    return response.status(400).json("Changes limit exceeded");
                }
                else if (password !== "TrabalheNaSaipos") {
                    return response.status(403).json("Wrong Password");
                }
                else{
                    task.changescount += 1;
                }
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
                    WsServer.sendBroadCast("todolist")

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
                WsServer.sendBroadCast("todolist")

                return response.json(resp);
            }).catch(error => {
                return response.json(error);
            })
    }

    async getFacts(request: Request, response: Response) {
        await axios.get<CatFacts[]>(`${CAT_API}`)
            .then((facts: AxiosResponse<CatFacts[]>) => {
                let tastkTmp = {
                    title: "",
                    name: "Eu",
                    email: "eu@me.com",
                    status: 0,
                    changescount: 0,
                }

                let taskList = facts.data.map((fact: CatFacts) => {
                    return {
                        ...tastkTmp,
                        title: fact.text
                    }
                })

                knex('todolist').insert(taskList)
                    .then(resp => {
                        WsServer.sendBroadCast("todolist")
                        return response.json("Ok")
                    })
                    .catch((error) => {
                        return response.status(400).json(error);
                    })
            })
    }
}