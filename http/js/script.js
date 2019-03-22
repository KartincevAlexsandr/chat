let buttonSend = document.getElementById('button-send');
let newMassage = document.getElementById('input-add-comment');
let countUser = document.getElementById('countUser');
import add_foto from './module/add_foto.js';
import add_message from './module/chatAdd.js';
import { ws, loginNickName } from './module/connect.js';
let addPhoto = document.getElementById('userInfo_photo');
var myAvatar;






addPhoto.addEventListener('click', () => {
    document.getElementById('image').style.display = 'block';
    add_foto();
});
ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const list = document.getElementById('list');
    let name,
        li;
    switch (data.type) {
        case 'avatar':
            myAvatar = data.data;
            document.getElementById('userInfo_photo').src = myAvatar;
            break;

        case 'all Users':
            const users = data.data.clientsOnly;
            console.log(users);
            countUser.innerText = `Участники(${users.length + 1})`
            for (const user in users) {
                if (users.hasOwnProperty(user)) {
                    const name = users[user].login;
                    const li = document.createElement('li');

                    li.textContent = name;
                    list.appendChild(li);
                }
            }
            break;

        case 'all message':
            const message = data.data;
            console.log('all message');
            for (var ms = 0; ms <= message.length; ms++) {
                add_message(loginNickName, message[ms]);

            }
            break;
        case 'new User':
            name = data.data.login;
            li = document.createElement('li');

            li.textContent = name;
            list.appendChild(li);
            break;

        case 'new avatar':
            let obj = data.data;
            let elements = document.querySelectorAll(`.login_${obj.login}`);
            for (var i = 0; i < elements.length; i++) {
                elements[i].src = obj.img;
            }
            break;

        case 'new Massage':
            console.log('new Massage', data.data);

            add_message(loginNickName, data.data);


            break;
        case 'exit User':
            name = data.data.login;
            li = document.querySelectorAll('li');
            for (let i = 0; i < li.length; i++) {
                if (li[i].textContent === name) {
                    list.removeChild(li[i]);
                }
            }

            break;
    }
}

buttonSend.addEventListener('click', () => {
    let nowTime = new Date();
    let time = `${nowTime.getFullYear()}.${nowTime.getMonth()}.${nowTime.getDay()} ${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()}`;
    let myMessage = { user: loginNickName, date: time, text: newMassage.value, img: myAvatar };
    add_message(loginNickName, myMessage);
    ws.send(JSON.stringify({ type: 'new Message', data: { message: newMassage.value, time: time } }));
    newMassage.value = '';
});

ws.onclose = function (event) {
    console.log('close');
}

ws.onerror = function (err) {
    console.log('err')
}










