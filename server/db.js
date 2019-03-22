
module.exports = class dbInit {
    constructor(db) {
        this.db = db;
    }

    getUser(login = 'all', FIO = '') {
        if (login === 'all') {
            return this.db.get('users');
        }
        else {
            let users = this.db.get('users').find({ login: login }).value();
            if (users !== undefined) {
                users = JSON.parse(JSON.stringify(users));
                let img = this.db.get('userImg').find({ login: login }).value();
                users.img = img.img;
                return users;
            }
            else {
                this.db.get('users')
                    .push({ login: login, FIO: FIO })
                    .write()

                this.db.get('userImg')
                    .push({ login: login, img: './img/no-photo.png' })
                    .write();

                return { login: login, FIO: FIO, img: './img/no-photo.png' }

            }

        }

    }
    getMassage() {
        let message = this.db.get('posts').value();
        let sa = message.map((ms1) => {
            let ms = JSON.parse(JSON.stringify(ms1));
            let imgs = this.db.get('userImg').find({ login: ms.user }).value();
            ms.img = imgs.img;
            return ms;
        });
        return sa;

    }

    setMassage(message) {
        let id = this.db.get('count') + 1;
        this.db.get('posts')
            .push({ id: id, user: message.user, date: message.date, text: message.text })
            .write()
        this.db.update('count', n => n + 1)
            .write()

    }

    setAvatar(obj) {
        this.db.get('userImg').find({ login: obj.login }).assign({ img: obj.img }).write();
    }

    getAvatar(login) {
        let img = this.db.get('userImg').find({ login: login }).value();
        return img;
    }
}