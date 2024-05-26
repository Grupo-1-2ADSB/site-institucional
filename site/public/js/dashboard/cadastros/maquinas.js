// Modal Cadastro
document.querySelector('.new-machine').addEventListener('click', function() {
    var modal = document.getElementById('modalCadastro');
    modal.style.display = "block";
});

// Fechar modais
document.querySelectorAll('.modal .close').forEach(function(closeBtn) {
    closeBtn.addEventListener('click', function() {
        var modal = this.closest('.modal');
        modal.style.display = "none";
        modal.querySelector('.modal-content').innerHTML = ''; // Limpa o conteúdo ao fechar o modal
    });
});

// Obtém o modal de detalhes da máquina
var modalDetalhes = document.getElementById("modalDetalhes");

// Obtém os elementos de fechar o modal
var closeBtn = document.getElementsByClassName("close")[0];

// Adiciona um evento de clique a cada item da lista de máquinas
var machineItems = document.querySelectorAll(".registered-machines ul li");

// Fecha o modal ao clicar no botão de fechar
closeBtn.onclick = function() {
    modalDetalhes.style.display = "none";
};

// Fecha o modal ao clicar fora da área do modal
window.onclick = function(event) {
    if (event.target == modalDetalhes) {
        modalDetalhes.style.display = "none";
    }
};

// Função para o usuário sair da sessão e apagar as informações do session.Storage

function logout() {
    sessionStorage.clear();

    setTimeout(function() {
        window.location.href = "../../index.html";
    }, 1000);
}

// Funções para cadastro de máquinas
const SOs = document.getElementById('sos_maquina').options;
const arquiteturasSO = document.getElementById('arquiteturas_so').options;
const inputVersaoSO = document.getElementById('input_versaoSO');
const inputNome = document.getElementById('input_nome');
const inputCodigoSerial = document.getElementById('input_codigo_serial');
const inputLocalizacao = document.getElementById('input_localizacao');
const statusMaquina = document.getElementById('status_maquina').options;
const mensagensErro = document.getElementsByClassName('msg-erro');

const serialCode = /^[A-Z0-9]{7,22}$/;

function limparMensagensErro() {
    for (let i = 0; i < mensagensErro.length; i++) {
        mensagensErro[i].textContent = "";
    }
}

function validarForms() {
    limparMensagensErro();

    if (SOs.selectedIndex === 0) {
        mensagensErro[0].textContent = "*Selecione uma opção válida.";
        return false;
    } else if (inputVersaoSO.value.length < 2 || inputVersaoSO.value === "") {
        mensagensErro[1].textContent = "*Preencha o campo com 2 caracteres, no mínimo.";
        return false;
    } else if (arquiteturasSO.selectedIndex === 0){
        mensagensErro[2].textContent = "*Selecione uma opção válida.";
        return false;
    } else if(inputNome.value.length < 4 || inputNome.value === ""){
        mensagensErro[3].textContent = "*Preencha o campo com 4 caracteres, no mínimo.";
        return false;
    } else if(!serialCode.test(inputCodigoSerial.value)){
        mensagensErro[4].textContent = "*Código serial inválido. Deve conter entre 7 e 22 caracteres (letras maiúsculas e números).";
        return false;
    } else if (inputLocalizacao.value.length < 3 || inputLocalizacao.value === ""){
        mensagensErro[5].textContent = "*Preencha o campo com 4 caracteres, no mínimo.";
        return false;
    } else if (statusMaquina.selectedIndex === 0){
        mensagensErro[6].textContent = "*Selecione uma opção válida.";
        return false;
    }
    return true;
}

function cadastrarMaquina() {
    if (validarForms()) {
        const dados = {
            soServer: sos_maquina.value,
            versaoSOServer: inputVersaoSO.value,
            arquiteturaSOServer: arquiteturasSO[arquiteturasSO.selectedIndex].value,
            nomeMaquinaServer: inputNome.value,
            codigoSerialMaquinaServer: inputCodigoSerial.value,
            localizacaoServer: inputLocalizacao.value,
            statusMaquinaServer: status_maquina.value,
            fkUnidadeHospitalarServer: sessionStorage.HOSPITAL
        };

        console.log(dados);

        fetch("/maquinas/cadastrarMaquinas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        })
        .then(resposta => resposta.json().then(data => ({ status: resposta.status, body: data })))
        .then(function ({ status, body }) {
            if (status === 200) {
                mensagensErro[6].textContent = "Cadastro realizado com sucesso!✅";
                mensagensErro[6].style.color = "green";
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else if (status === 400 && body.message.startsWith('Duplicate entry')) {
                mensagensErro[4].textContent = "*Código serial duplicado. Por favor, insira um código serial único.";
                mensagensErro[4].style.color = "red";
            } else {
                throw new Error(body.error || "Houve um erro ao tentar realizar o cadastro!");
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

document.getElementById('btn_cadastrar_maq').addEventListener('click', () => {
    cadastrarMaquina();
})