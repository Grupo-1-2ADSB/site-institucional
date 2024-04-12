const inputSenha = document.querySelector('.olho1');
const inputRepetirSenha = document.querySelector('.olho2');
const forms_btn = document.querySelector('.teste');


function exibirSenha(input) {
    input.type = (input.type === "password") ? "text" : "password";
}
