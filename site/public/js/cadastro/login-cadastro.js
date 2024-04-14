const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const sign_in_btn2 = document.querySelector("#sign-in-btn2");
const sign_up_btn2 = document.querySelector("#sign-up-btn2");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
})

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
})

sign_up_btn2.addEventListener("click", () => {
    container.classList.add("sign-up-mode2");
})

sign_in_btn2.addEventListener("click", () => {
    container.classList.remove("sign-up-mode2");
})

const btnForms = document.getElementById('btn_forms');
const nomeCompleto = document.getElementById('nome_completo');
const username = document.getElementById('username');
const email = document.getElementById('email');
const senha = document.getElementById('senha');
const confirmarSenha = document.getElementById('confirmar_senha');
const mensagensErro = document.getElementsByClassName('msg-erro');
const senhaNotificacao = document.getElementById('notificacao_senha');

const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
const regexSenha = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\d\w\W]{8,}$/;

function limparMensagensErro() {
    for (let i = 0; i < mensagensErro.length; i++) {
        mensagensErro[i].textContent = "";
    }
}

function validarFormsCadastro() {
    limparMensagensErro();

    if (nomeCompleto.value === "" || nomeCompleto.value.length < 5) {
        mensagensErro[0].textContent = "*Preencha o campo com 5 caracteres, no mínimo.";
        return false;
    } else if (username.value === "" || username.value.length < 5){
        mensagensErro[1].textContent = "*Preencha o campo com 5 caracteres, no mínimo.";
        return false;
    } else if (!regexEmail.test(email.value)) {
        mensagensErro[2].textContent = "*Preencha o campo com um email válido.";
        return false;
    } else if (!regexSenha.test(senha.value)) {
        mensagensErro[3].textContent = "*Preencha o campo com todos os requisitos.";
        return false;
    } else if (confirmarSenha.value != senha.value) {
        mensagensErro[4].textContent = "*Preencha o campo com a mesma senha anterior.";
        return false;
    }
    
    return true;
}

async function cadastrarUsuario() {

    if (validarFormsCadastro()) {
        const dados = {
            nomeServer: nomeCompleto.value,
            usernameServer: username.value,
            emailServer: email.value,
            senhaServer: senha.value,
            cargoServer: "Gerente"
        }

        try {
            const resposta = await fetch("/usuarios/cadastrarUsuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            if (resposta.ok) {
                mensagensErro[4].textContent = "Cadastro realizado com sucesso!✅";
                mensagensErro[4].style.color = "green";
                setTimeout(() => {
                    window.location.href = 'cadastroR.html';
                }, 4000);
            } else {
                throw new Error("Houve um erro ao tentar realizar o cadastro!");
            }
        } catch (erro) {
            // mensagemErro[4].innerHTML = "Houve um erro ao tentar realizar o cadastro!";
            // mensagemErro[4].style.color = "red";
            console.log(erro  + 'erro catach');
        }

        return false;
    }

}



btnForms.addEventListener("click", () => {
    cadastrarUsuario();
})

senha.addEventListener('focus', () => {
    senhaNotificacao.classList.add('mostrar');
    console.log("Focus na inpit")
})

senha.addEventListener('blur', () => {
    senhaNotificacao.classList.remove('mostrar');
    console.log("Blur")
})