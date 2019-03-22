const WebSocket = require('ws');
const uuidv1 = require('uuid/v1');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync("./db/chat.json");
const db = lowdb(adapter);
const dbInit = require('./db');
const nosql = new dbInit(db);



const wss = new WebSocket.Server({ port: 5501 });
var clientsOnly = {};
var clients = {};
var messageId = 0;




wss.on('connection', function (ws) {
    console.log('connect sever');

    const id = uuidv1();
    var userLogin;

    ws.on('message', function (data) {
        const message = JSON.parse(data);

        switch (message.type) {
            case 'new User':
                userLogin = message.data.login;
                user = nosql.getUser(userLogin, message.data.FIO);
                ws.send(JSON.stringify({ type: 'avatar', data: user.img }));
                ws.send(JSON.stringify({ type: 'all message', data: nosql.getMassage() }));
                ws.send(JSON.stringify({ type: 'all Users', data: { clientsOnly } }));

                clientsOnly[userLogin] = user;

                clients[id] = ws;

                for (const key in clients) {
                    if (clients.hasOwnProperty(key)) {

                        if (key !== id) {
                            clients[key].send(JSON.stringify({ type: 'new User', data: clientsOnly[userLogin] }));
                        }
                    }
                }
                break;
            case 'new Message':
                let newMassage = { user: userLogin, date: message.data.time, text: message.data.message };
                nosql.setMassage(newMassage);
                newMassage.img = nosql.getAvatar(userLogin).img;
                for (const key in clients) {
                    if (clients.hasOwnProperty(key)) {

                        if (key !== id) {
                            clients[key].send(JSON.stringify({ type: 'new Massage', data: newMassage }));
                        }
                    }
                }

                break;


            case 'new image':
                let image = message.data;
                let login = message.data.login;
                let img = message.data.img;
                nosql.setAvatar(image);
                for (const key in clients) {
                    if (clients.hasOwnProperty(key)) {

                        if (key !== id) {
                            clients[key].send(JSON.stringify({ type: 'new avatar', data: image }));
                        }
                    }
                }

                break;
        }
    });

    ws.on('close', function () {
        for (const key in clients) {
            if (clients.hasOwnProperty(key)) {

                if (key !== id) {
                    clients[key].send(JSON.stringify({ type: 'exit User', data: clientsOnly[userLogin] }));
                }
            }
        }
        delete clientsOnly[userLogin];
        delete clients[id];
    })
});


