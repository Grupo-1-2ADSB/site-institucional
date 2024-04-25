const btn = document.getElementById("btn_modal");
const modal = document.getElementById("div_dialog");
const buttonClose = document.getElementById("btn-fechar");
const buttonConfirm = document.getElementById("btn-confirmar");

btn.onclick = function () {
    modal.style.display = 'block';
}

buttonClose.onclick = function () {
    modal.style.display = 'none';
}

buttonConfirm.onclick = function () {
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
const buttonConfirm2 = document.getElementById("btn-confirmar2")

btn2.onclick = function () {
    modal2.style.display = 'block';
}

buttonClose2.onclick = function () {
    modal2.style.display = 'none';
}

buttonConfirm2.onclick = function () {
    modal2.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal2) {
        modal2.style.display = 'none';
    }
}

function logout() {
    sessionStorage.clear();

    setTimeout(function() {
        window.location.href = "../../index.html";
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("config_esquerda").innerHTML = `
    <div class="info-esquerda">
    <div class="infor">
        <h3>Nome atual:</h3>
        <span>${sessionStorage.NAME_USER}</span>
    </div>

    <div class="info">
        <h3>Email atual:</h3>
        <span>${sessionStorage.EMAIL}</span>
    </div>

    <div class="info">
        <h3>usuário atual:</h3>
        <span>${sessionStorage.NOME_COMPLETO}</span>
    </div>
</div>
    `;
});