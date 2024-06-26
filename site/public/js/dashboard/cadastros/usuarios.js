// Função para mudar cor da option quando for selecionada no select
const corSelecionada = "var(--primary)";
const selectCargo = document.getElementById("select_cargo");

selectCargo.addEventListener("change", function() {
    this.style.color = corSelecionada;
});

// Função para exibir options de Cargos

function obterCargos() {
    return fetch(`/usuarios/exibirCargos`)
        .then(function (resposta) {
            if(!resposta.ok) {
                throw new Error("Erro ao obter cargo do banco de dados");
            }
            return resposta.json();
        })
        .catch(function (erro) {
            console.log(erro);
        });
}

function criarOptionsDosCargos(cargos) {
    for (let i = 0; i < cargos.length; i++){
        let cargo = cargos[i].nome;

        const novaOpt = document.createElement("option");
        
        novaOpt.innerHTML = `
        <option value="${cargo}">${cargo}</option>
        `;

        selectCargo.appendChild(novaOpt);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    obterCargos()
        .then(cargos => {
            criarOptionsDosCargos(cargos);
        })
})

// // Função para trocar o tipo dos inputs de senha e mudar o icon do olho
function trocarIconOlho(input, span) {
    if (input.type === "password") {
        input.type = "text";
        span.classList.remove("input-senha-olho-aberto");
        span.classList.add("input-senha-olho-fechado");
        
    } else if (input.type === "text") {
        input.type = "password";
        span.classList.remove("input-senha-olho-fechado");
        span.classList.add("input-senha-olho-aberto");
    }
}

// Chamadas da função

const inputSenha = document.getElementById("input_senha");
const spanSenha = document.getElementById("span_senha");

spanSenha.addEventListener("click", function() {
    trocarIconOlho(inputSenha, spanSenha);
});

const inputRepetirSenha = document.getElementById("input_repetir_senha");
const spanRepetirSenha = document.getElementById("span_repetir_senha");

spanRepetirSenha.addEventListener("click", function() {
    trocarIconOlho(inputRepetirSenha, spanRepetirSenha);
});

// Dados para o cadastro de usuário

const btnForms = document.getElementById('btn_forms');
const nomeCompleto = document.getElementById('nome_completo');
const username = document.getElementById('username');
const email = document.getElementById('email');
const cargos = document.getElementById('select_cargo').options;
const senha = document.getElementById('input_senha');
const confirmarSenha = document.getElementById('input_repetir_senha');
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

    if (nomeCompleto.value === "" || nomeCompleto.value.length < 8) {
        mensagensErro[0].textContent = "*Preencha o campo com 8 caracteres, no mínimo.";
        return false;
    }else if (username.value === "" || username.value.length < 5){
        mensagensErro[1].textContent = "*Preencha o campo com 5 caracteres, no mínimo.";
        return false;
    } else if (!regexEmail.test(email.value)) {
        mensagensErro[2].textContent = "*Preencha o campo com um email válido.";
        return false;
    } else if (cargos.selectedIndex === 0) {
        mensagensErro[3].textContent = "*Selecione uma opção válida.";
        return false;
    } else if  (!regexSenha.test(senha.value)) {
        mensagensErro[4].textContent = "*Preencha o campo com todos os requisitos.";
        return false;
    } else if (confirmarSenha.value != senha.value) {
        mensagensErro[5].textContent = "*Preencha o campo com a mesma senha anterior.";
        return false;
    }
    return true;
}

function cadastrarUsuario() {
    if (validarFormsCadastro()) {
        const dados = {
            nomeServer: nomeCompleto.value,
            nomeUserServer: username.value,
            emailServer: email.value,
            senhaServer: senha.value,
            fkUnidadeHospitalarServer: sessionStorage.HOSPITAL,
            fkCargoServer: cargos.selectedIndex,
        };

        fetch("/usuarios/cadastrarUsuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        })
        .then(function (resposta) {
            if (resposta.ok) {
                mensagensErro[4].textContent = "Cadastro realizado com sucesso!✅";
                mensagensErro[4].style.color = "green";
            
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                throw new Error("Houve um erro ao tentar realizar o cadastro!");
            }
        })
        .catch (function (erro){
            mensagensErro[5].innerHTML = "Houve um erro ao tentar realizar o cadastro!";
            mensagensErro[5].style.color = "red";
            console.error("Erro ao tentar realizar o cadastro:", erro);
        }); 
    return false;
    }
}

// Chamada para cadastrar o usuário
btnForms.addEventListener("click", () => {
    cadastrarUsuario();
})

// Chamada para aparecer a notificação com os requisitos de senha
senha.addEventListener('focus', () => {
    senhaNotificacao.classList.add('mostrar');
})

senha.addEventListener('blur', () => {
    senhaNotificacao.classList.remove('mostrar');
})

// Função para o usuário sair da sessão e apagar as informações do session.Storage
function logout() {
    sessionStorage.clear();

    setTimeout(function() {
        window.location.href = "../../index.html";
    }, 1000);
}

