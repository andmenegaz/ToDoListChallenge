import axios, { AxiosResponse } from 'axios'
import { Request, Response } from 'express'

const MAIL_API = `http://apilayer.net/api/check?access_key=e5eb049408b4d6ca8f391828576ebacd`

class MailResponse {
    constructor(
        public email: string,
        public did_you_mean: string,
        public format_valid: boolean,
        public mx_found: boolean
    ) { }
}

export default class MailBoxController {

    async verifyEmail(request: Request, response: Response, next: any) {
        const { email } = request.body
        let teste = ''
        await axios.get<MailResponse>(`${MAIL_API}&email=${email}`)
            .then((mailResponse: AxiosResponse<MailResponse>) => {
                if (!mailResponse.data.format_valid || !mailResponse.data.mx_found) {
                    let errorMessage = "E-mail Inválido"
                    if (mailResponse.data.did_you_mean?.length > 0) {
                        errorMessage = `Você quis Dizer ${mailResponse.data.did_you_mean}`
                    }
                    teste = errorMessage;
                    return response.status(400).json({ message: errorMessage, validation: { keys: ["email"]} })
                } else {
                    return next();
                }
            })
    }
}
