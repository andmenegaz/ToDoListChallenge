import { environment } from "../environments/environment";

const APP_API = environment.api

const MAIL_API = `http://apilayer.net/api/check?access_key=${environment.mail_key}`

const CAT_API = 'https://cat-fact.herokuapp.com/facts/random?animal_type=dog&amount=3'

export { APP_API, MAIL_API, CAT_API }
