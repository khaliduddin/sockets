import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('new_visitor', user=>{
        console.log('new visitor connected', user);
        socket.user = user;
        emitVisitors();
    });
});

const getVisitors = () => {
    let clients = io.sockets.sockets; 
    // console.log('clients===', clients);
    let sockets = Object.values(clients);
    let users = sockets.map(s => {
        console.log("socket!!! ", s);
        return s.Socket.user;
    });

    for (let [key, value] of  clients.entries()) {
        console.log(key + " = " + value);        
        if (value.hasOwnProperty("user")) {
            console.log("user ", value.user);
        } else {
            console.log('not found');
        }
        for(let property in value) {
            // console.log("user property = " + property);
            console.log("user property = " + property + " | user property val = " + JSON.stringify(value[property]));
        }
        
    }
    console.log('users===', users);
    return users;
}

const emitVisitors = () => {
    io.emit('visitors', getVisitors);
}

server.listen(3000, () => {
  console.log(`server running at http://localhost:${port}`);
});