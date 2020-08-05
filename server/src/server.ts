import express from 'express'
import cors from 'cors'
import * as http from 'http'
import routes from './routes'
import WsServer from './websocket'
import { errors } from 'celebrate' //make celebrate return 400 instead 500


const app = express()

const server = http.createServer(app)

WsServer.initializeWS(server);

app.use(express.json())
app.use(cors())
app.use(routes)
app.use(errors())

server.listen(3333, () => {
    console.log(`Server started on port 3333`)
})
