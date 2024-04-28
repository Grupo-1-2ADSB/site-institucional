const btn2 = document.getElementById("botao_confirmar");
const buttonConfirm2 = document.getElementById("btn-confirmar2");

// Funções para fazer update das informações do usuário

const novoUsername = document.getElementById("novo_username");
const novoEmail = document.getElementById("novo_email");
const novaSenha = document.getElementById("nova_senha");
const repetirNovaSenha = document.getElementById("repetir_nova_senha");
const mensagensErro = document.getElementsByClassName('msg-erro');
const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
const regexSenha = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\d\w\W]{8,}$/;

const senhaNotificacao = document.getElementById('notificacao_senha');


function limparMensagensErro() {
    for (let i = 0; i < mensagensErro.length; i++) {
        mensagensErro[i].textContent = "";
    }
}

function validarFormsTrocaInfo() {
    limparMensagensErro();

    if (novoUsername.value === "" || novoUsername.value.length < 5) {
        mensagensErro[0].textContent = "*Preencha o campo com 5 caracteres, no mínimo.";
        return false;
    } else if (!regexEmail.test(novoEmail.value)) {
        mensagensErro[1].   textContent = "*Preencha o campo com um email válido.";
        return false;
    } else if (!regexSenha.test(novaSenha.value) || novaSenha.value === sessionStorage.SENHA) {
        mensagensErro[2].textContent = "*A nova senha não deve ser a mesma que a anterior e seguir os requisitos.";
        return false;
    } else if (repetirNovaSenha.value != novaSenha.value) {
        mensagensErro[3].textContent = "*Preencha o campo com a mesma senha anterior.";
        return false;
    } 

    info_direita.style.display = "flex";
}

// Chamada para aparecer a notificação com os requisitos de senha
novaSenha.addEventListener('focus', () => {
    senhaNotificacao.classList.add('mostrar');
})

novaSenha.addEventListener('blur', () => {
    senhaNotificacao.classList.remove('mostrar');
})

btn2.addEventListener("click", () => {
    validarFormsTrocaInfo();
});

// Funções para confirmar a senha atual no modal e fazer o fetch

const divDeletar = document.getElementById("div_deletar");
const divPaiSenha = document.getElementById("div_pai_senha");
const divPaiConta = document.getElementById("div_pai_conta");
const confirmarSenhaAtual = document.getElementById("confirmar_senha_atual");
const msgErroConfirmarSenhaAtual = document.getElementById("msg-erro-confirmar-senha-atual");

function validarConfirmarSenhaAtual() {
    if (confirmarSenhaAtual.value != sessionStorage.SENHA) {
        msgErroConfirmarSenhaAtual.textContent = "Digite a senha correta.";
    } else if (confirmarSenhaAtual.value === sessionStorage.SENHA) {
        trocarInformacoesUser();

        setTimeout(() => {
            divDeletar.style.display = 'none';  
            divPaiSenha.style.display = 'none';
            info_direita.style.backgroundColor = 'transparent';
        }, 4000);
    }

}

function trocarInformacoesUser() {
    const dados = {
        novoUsernameServer: novoUsername.value,
        novoEmailServer: novoEmail.value,
        novaSenhaServer: novaSenha.value
    };

    fetch(`/usuarios/trocarInformacoesUser/${sessionStorage.ID_USUARIO}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
    })
    .then(function (resposta) {
        if (resposta.ok) {
            msgErroConfirmarSenhaAtual.textContent = "Alterações realizadas com sucesso!✅";
            msgErroConfirmarSenhaAtual.style.color = "green";

            if (sessionStorage.CARGO === 1) {
                setTimeout(() => {
                    window.location = "../../dashboard/engenheiroInfra/configuracoes.html";
                }, 2000);
            } else if (sessionStorage.CARGO === 2) {
                setTimeout(() => {
                    window.location = "../../dashboard/gerenteInfra/configuracoes.html";
                }, 2000);
            } else if (sessionStorage.CARGO === 3) {
                setTimeout(() => {
                    window.location = "../../dashboard/tecnicoInfra/configuracoes.html";
                }, 2000);
            }            
        } else {
            throw new Error("Houve um erro ao tentar realizar o cadastro!");
        }
    })
    .catch (function (erro) {
        msgErroConfirmarSenhaAtual.textContent = "Houve um erro ao tentar realizar as alterações!";
        msgErroConfirmarSenhaAtual.style.color = "red";
        console.error("Erro ao tentar realizar as alterações:", erro);
    });
    return false;
}

buttonConfirm2.addEventListener("click", () => {
    validarConfirmarSenhaAtual();
});
    
// Exibir as informações do usuário da sessionStorage

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("config_esquerda").innerHTML = `
    <h1>Informações do usuário</h1>    
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
        <h3>Nome de Usuário atual:</h3>
        <span>${sessionStorage.NOME_COMPLETO}</span>
    </div>
</div>
    `;
});