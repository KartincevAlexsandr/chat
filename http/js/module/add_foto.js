import { ws, loginNickName } from './connect.js';


export default function () {
    let saveButton = document.getElementById('btn_load');
    let cancelButton = document.getElementById('btn_cancel');

    var dropZone = document.getElementById('dropZone');
    var fileReader = new FileReader();

    dropZone.ondragover = function () {
        dropZone.classList.add('hover');
        return false;
    };

    dropZone.ondragleave = function () {
        dropZone.classList.remove('hover');
        return false;
    };


    dropZone.ondrop = function (event) {
        event.preventDefault();
        dropZone.classList.remove('hover');
        var [file] = event.dataTransfer.files;

        if (file.size > 300 * 1024) {
            alert('Файл слишком большой!');
        }
        else {
            fileReader.readAsDataURL(file);
        }

    };

    dropZone.ondrop = function (event) {
        event.preventDefault();
        dropZone.classList.remove('hover');
        let [file] = event.dataTransfer.files;

        if (file.size > 512 * 1024) {
            alert('Файл слишком большой!');
        }
        else {
            fileReader.readAsDataURL(file);
        }

    };


    fileReader.addEventListener('load', () => {
        let imageInBase64 = fileReader.result;
        console.log('file :', imageInBase64);
        dropZone.style.backgroundImage = `url(${imageInBase64})`;
        saveButton.addEventListener('click', () => {
            document.getElementById('userInfo_photo').src = imageInBase64;
            document.getElementById('image').style.display = 'none';
            dropZone.style.backgroundImage = `url()`;
            let elements = document.querySelectorAll('.login_my');
            for (var i = 0; i < elements.length; i++) {
                elements[i].src = imageInBase64;
            }
            ws.send(JSON.stringify({ type: 'new image', data: { login: loginNickName, img: imageInBase64 } }));
            return imageInBase64;
        })
    })
    cancelButton.addEventListener('click', () => {
        document.getElementById('image').style.display = 'none';
        dropZone.style.backgroundImage = `url()`;
    });

}; 
