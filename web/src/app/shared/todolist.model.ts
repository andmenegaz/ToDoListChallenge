class ToDoList {
    constructor(
        public id: number,
        public title: string,
        public name: string,
        public email: string,
        public status: number,
        public changescount: number
    ){}
}

class MailResponse {
    constructor(
        public email: string,
        public did_you_mean: string,
        public format_valid: boolean,
        public mx_found: boolean
    ){}
}

class CatFacts {
    constructor(
        public text: string
    ){}
}

export { ToDoList, MailResponse, CatFacts }
