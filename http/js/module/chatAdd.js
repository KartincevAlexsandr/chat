let allMassage = document.getElementById('chat');

export default function (login, message) {
    let divChat = document.createElement('div');
    let messagebox = document.createElement('div');
    messagebox.classList.add('messagebox');
    if (message.user === login) {
        divChat.classList.add('myMessage');
        divChat.innerHTML = `<div class="chat-message-img"><span>${message.user} ${message.date} </span>
        <span> ${message.text}</span></div><div class="chat-message-img"><img class="message-img login_my" src="${message.img}"></img></div>`;

    }
    else {
        divChat.classList.add('message');
        divChat.innerHTML = `<div class="chat-message-img"><img class="message-img login_${message.user}" src="${message.img}"></img></div>
        <div class="chat-message-img"><span>${message.user} ${message.date} </span><span> ${message.text}</span></div>`;
    }
    messagebox.appendChild(divChat);
    allMassage.appendChild(messagebox);
    allMassage.scrollTop = allMassage.scrollHeight;

};