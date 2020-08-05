import * as WebSocket from 'ws';
import * as http from 'http';

export default class WsServer {
    static webSocketServer: WebSocket.Server

    static initializeWS(server: http.Server){
        this.webSocketServer = new WebSocket.Server({ server })
    
        this.webSocketServer.on('connection', (ws: WebSocket) => {
    
            //Essa conexão não recebe msgs, só envia
            // //connection is up, let's add a simple simple event
            // ws.on('message', (message: string) => {
    
            //     //log the received message and send it back to the client
            //     console.log('received: %s', message);
    
            //     ws.send(JSON.stringify(`Hello, you sent -> ${message}`));
            // });

            ws.send(JSON.stringify(`connected`));
        });
    }

    static sendBroadCast(message: String) {
        this.webSocketServer.clients.forEach(client => {
            client.send(JSON.stringify(message))
        })
    }    
}