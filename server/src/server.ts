import express from 'express'
import routes from './routes'
import cors from 'cors'
import ws from 'express-ws'

const app = express()

var expressWs = ws(app);

app.use(express.json())

app.use(cors())

app.use(routes)

app.listen(3333)


