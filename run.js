const Tail = require('./index.js');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function (ws) {
    const tail = new Tail(process.argv[2]);
    tail.watch(ws);
});

