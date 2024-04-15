const btn = document.getElementById("btn_modal");
const modal = document.getElementById("div_dialog");
const buttonClose = document.getElementById("btn-fechar")

btn.onclick = function () {
    modal.style.display = 'block';
}

buttonClose.onclick = function () {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

const btn2 = document.getElementById("botao-confirmar");
const modal2 = document.getElementById("info_direita");
const buttonClose2 = document.getElementById("btn-fechar2")

btn2.onclick = function () {
    modal2.style.display = 'block';
}

buttonClose2.onclick = function () {
    modal2.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal2) {
        modal2.style.display = 'none';
    }
}