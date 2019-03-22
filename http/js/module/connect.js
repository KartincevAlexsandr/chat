const ws = new WebSocket('ws://localhost:5501');
let loginLogin = document.getElementById('login');
let loginFIO = document.getElementById('FIO');
let loginNickName;
ws.onopen = () => {

    loginLogin.addEventListener('click', () => {
        loginNickName = document.getElementById('nickName').value;
        document.getElementById('Name').innerText = loginFIO.value;
        document.getElementById("form_login").style.display = 'none';
        console.log('client connect');
        let data = { type: 'new User', data: { login: loginNickName, FIO: loginFIO.value } }
        ws.send(JSON.stringify(data));
        const li = document.createElement('li');
        li.textContent = loginFIO.value;
        document.getElementById('list').appendChild(li);


    })
};
export { ws, loginNickName };
