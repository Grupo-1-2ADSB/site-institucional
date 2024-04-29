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


// Função para cadastrar máquina
function registerMachine() {
    var form = document.getElementById('machineForm');
    var hostname = form.hostname.value;
    var ip = form.ip.value;
    var os = form.os.value;

    // Exibindo os dados no console para fins de teste e enviando para
    console.log("Hostname:", hostname);
    console.log("IP:", ip);
    console.log("Sistema Operacional:", os);

    fetch('/maquinas/registerMachine', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            hostnameServer: hostname,
            ipServer: ip,
            osServer: os
        })
    }).then(function (resposta){
        console.log("resposta: ", resposta);
        if(resposta.ok){
            mensagensErro[4].textContent = "Cadastro realizado com sucesso!✅";
            mensagensErro[4].style.color = "green";
        }
    })



    // Fechar o modal de cadastro após o envio do formulário
    var modal = document.getElementById('modalCadastro');
    modal.style.display = "none";
    form.reset(); // Limpar os campos do formulário
}

// Obtém o modal de detalhes da máquina
var modalDetalhes = document.getElementById("modalDetalhes");

// Obtém os elementos de fechar o modal
var closeBtn = document.getElementsByClassName("close")[0];

// Adiciona um evento de clique a cada item da lista de máquinas
var machineItems = document.querySelectorAll(".registered-machines ul li");
machineItems.forEach(function(item) {
    item.addEventListener("click", function() {
        // Exibe o modal de detalhes da máquina ao clicar em um item da lista
        modalDetalhes.style.display = "block";

        // Simula dados da máquina (substitua pelos dados reais da sua aplicação)
        var machineData = {
            os: "Linux",
            disk: "50%",
            network: "25%",
            ram: "4GB"
        };

        // Atualiza o conteúdo do modal com os dados da máquina clicada
        document.getElementById("os").innerText = machineData.os;
        document.getElementById("disk").innerText = machineData.disk;
        document.getElementById("network").innerText = machineData.network;
        document.getElementById("ram").innerText = machineData.ram;
    });
});

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
const inputVersaoSO = document.getElementById('input_versaoSO');
const inputArquitetura = document.getElementById('input_arquitetura');
const inputNome = document.getElementById('input_nome');
const inputLocalizacao = document.getElementById('input_localizacao');
const statusMaquina = document.getElementById('status_maquina').options;
const mensagensErro = document.getElementsByClassName('msg-erro');

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
    } else if (inputArquitetura.value.length < 2 || inputArquitetura.value === ""){
        mensagensErro[2].textContent = "*Preencha o campo com 2 caracteres, no mínimo.";
        return false;
    } else if(inputNome.value.length < 4 || inputNome.value === ""){
        mensagensErro[3].textContent = "*Preencha o campo com 4 caracteres, no mínimo.";
        return false;
    } else if (inputLocalizacao.value.length < 3 || inputLocalizacao.value === ""){
        mensagensErro[4].textContent = "*Preencha o campo com 4 caracteres, no mínimo.";
        return false;
    } else if (statusMaquina.selectedIndex === 0){
        mensagensErro[5].textContent = "*Selecione uma opção válida.";
        return false;
    }
    return true;
}

function cadastrarMaquina() {
    if (validarForms()) {
        const dados = {
            soServer: sos_maquina.selectedIndex,
            versaoSOServer: inputVersaoSO.value,
            arquiteturaSOServer: inputArquitetura.value,
            nomeMaquinaServer: inputNome.value,
            localizacaoServer: inputLocalizacao.value,
            statusMaquinaServer: status_maquina.value,
            fkUnidadeHospitalarServer: sessionStorage.HOSPITAL
        };

        fetch("/maquinas/cadastrarMaquinas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        })
        .then(function (resposta) {
            if (resposta.ok) {
                mensagensErro[5].textContent = "Cadastro realizado com sucesso!✅";
                mensagensErro[5].style.color = "green";
            
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

document.getElementById('btn_cadastrar_maq').addEventListener('click', () => {
    cadastrarMaquina();
})