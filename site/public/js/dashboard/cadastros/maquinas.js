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