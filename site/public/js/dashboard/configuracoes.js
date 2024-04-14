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

//ass: m