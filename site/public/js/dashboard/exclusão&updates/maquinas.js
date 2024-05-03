function obterMaquinasDoBanco() {
    return fetch("/maquinas/obterMaquinasDoBanco")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao obter maquinas do banco de dados");
            }
            return response.json();
        })
        .catch(error => {
            console.error("Erro ao obter maquinas:", error);
        })
}

function criarElementosDasMaquinas(maquinas) {
    const machineList = document.getElementById("machineList");


    maquinas.forEach(maquina => {
        let statusClass = "";
        switch (maquina.statusPC) {
            case "ativado":
                statusClass = "status-active";
                break;
            case "desativado":
                statusClass = "status-inactive";
                break;
            case "manutenção":
                statusClass = "status-maintenance";
                break;
            default:
                statusClass = "";
        }

        const novaLiMaquina = document.createElement("li");

        novaLiMaquina.innerHTML = `
            <i class="bx bx-desktop"></i> 
            <span class="machine-name">${maquina.nome}</span> - <span class="machine-ip">${maquina.localizacao}</span> - <span class="${statusClass}">${maquina.statusPC}</span>
        `;

        novaLiMaquina.addEventListener("click", () => {
            modalDetalhes.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Detalhes da Máquina</h2>
                <div class="machine-info">
                    <p><strong>Sistema Operacional:</strong> <span>${maquina.nomeSO} ${maquina.versaoSO}.</span></p>
                    <p><strong>Arquitetura do Sistema Operacional:</strong> <span>${maquina.arquiteturaSO}.</span></p>
                    <p><strong>Nome da Máquina:</strong> <span>${maquina.nome}.</span></p>
                    <p><strong>Localização da Máquina:</strong> <span>${maquina.localizacao}.</span></p>
                    <p><strong>Status da Máquina:</strong> <span>${maquina.statusPC}.</span></p>
                </div>
        </div>
            `;

            document.querySelectorAll('.modal .close').forEach(function(closeBtn) {
                closeBtn.addEventListener('click', function() {
                    var modal = this.closest('.modal');
                    modal.style.display = "none";
                    modal.querySelector('.modal-content').innerHTML = '';
                });
            });

            modalDetalhes.style.display = "block";
        });
        machineList.appendChild(novaLiMaquina);
    })
}

document.addEventListener("DOMContentLoaded", () => {
    obterMaquinasDoBanco()
        .then(maquinas => {
            criarElementosDasMaquinas(maquinas);
        })
})