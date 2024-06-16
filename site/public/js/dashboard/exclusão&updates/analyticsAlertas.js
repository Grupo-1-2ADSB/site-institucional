function obterRegistrosDoBanco() {
    const fkUnidadeHospitalar = sessionStorage.HOSPITAL;
    return fetch(`/maquinas/obterRegistrosDoBanco/${fkUnidadeHospitalar}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao obter registros do banco de dados");
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Erro ao obter registros:", error);
        })
}

let alertasRegistrados = []; // Array para armazenar os alertas já registrados
function cadastrarAlertas(registros, alertas) {
    let promises = [];

    registros.forEach((registro) => {
        let nomeHardware = registro.nomeHardware;
        let valorHardware = registro.valorHardware;
        let valorAtual = registro.valor;
        const calculo = ((valorAtual / valorHardware) * 100).toFixed(1);

        let gravidade, descricao;

        if (calculo >= 80.0) {
            if (calculo >= 80.0 && calculo <= 90.0) {
                gravidade = "Alerta";
                descricao = `O componente ${nomeHardware} está acima de ${calculo}% do ideal para o uso.`;
            } else {
                gravidade = "Crítica";
                descricao = `O componente ${nomeHardware} está em estado crítico, acima de ${calculo}% do ideal para o uso.`;
            }

            // Verifica se já existe um alerta registrado para o mesmo componente e mesma descrição
            let alertaExistente = alertasRegistrados.find((alertaRegistrado) =>
                alertaRegistrado.fkComputador === registro.fkComputador &&
                alertaRegistrado.nomeHardware === registro.nomeHardware &&
                alertaRegistrado.descricao === descricao
            );

            if (!alertaExistente) {
                // Registra o novo alerta
                alertasRegistrados.push({
                    fkComputador: registro.fkComputador,
                    nomeHardware: registro.nomeHardware,
                    descricao: descricao
                });

                const dados = {
                    gravidadeServer: gravidade,
                    descricaoServer: descricao,
                    fkRegistroServer: registro.idRegistro
                };

                // Cria uma promessa para inserir o alerta
                let promise = fetch("/alertas/cadastrarAlertas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dados),
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erro ao inserir alerta");
                    } else {
                        console.log("Alerta Inserido");
                    }
                })
                .catch((error) => {
                    console.error("Erro ao inserir alerta:", error);
                });

                promises.push(promise);
            } else {
                console.log("Alerta já existente:", alertaExistente);
            }
        }
    });

    // Retorna a lista de promessas para que possam ser aguardadas externamente
    return Promise.all(promises);
}



function obterAlertasDoBanco() {
    const fkUnidadeHospitalar = sessionStorage.HOSPITAL;
    return fetch(`/alertas/obterAlertasDoBanco/${fkUnidadeHospitalar}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao obter alertas do banco de dados");
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Erro ao obter alertas:", error);
        });
}

function criarElementosDosAlertas(alertas) {
    const divMaquinasAlertas = document.getElementById('div_maquinas_alertas');
    const divMaquinasCriticas = document.getElementById('div_maquinas_criticas');

    divMaquinasAlertas.innerHTML = "";
    divMaquinasCriticas.innerHTML = "";

    if (alertas.length === 0) {
        divMaquinasAlertas.innerHTML = "<p style='color: var(--dark);'>Não há máquinas em estado de alerta.</p>";
        divMaquinasCriticas.innerHTML = "<p style='color: var(--dark); '>Não há máquinas em estado crítico.</p>";
        return;
    }


    let alertaAlertaPresente = false;
    let alertaCriticaPresente = false;

    alertas.forEach((alerta) => {
        console.log("ALertas" + alertas);
        let valorHardware = alerta.valor[1];
        let valorAtual = alerta.valor[0];
        const calculo = ((valorAtual / valorHardware) * 100).toFixed(1);

        const novaDivMaquinaAlerta = document.createElement("div");
        novaDivMaquinaAlerta.setAttribute("data-id", alerta.idComputador);

        novaDivMaquinaAlerta.classList.add('task-list');

        const novaDivMaquinaCritica = document.createElement("div");
        novaDivMaquinaCritica.setAttribute("data-id", alerta.idComputador);
        novaDivMaquinaCritica.classList.add('task-list');

        let componenteIcon = "";
        switch (alerta.nomeHardware) {
            case "Armazenamento":
                componenteIcon = "fa-solid fa-hard-drive";
                break;
            case "CPU":
                componenteIcon = "fa-solid fa-microchip";
                break;
            case "Memória RAM":
                componenteIcon = "fa-solid fa-memory";
                break;
            default:
                componenteIcon = "bx bx-desktop";
        }

        if (alerta.gravidade === "Alerta") {

            novaDivMaquinaAlerta.innerHTML = `
                <span>
                    <i class="${componenteIcon}"></i>
                    <p>${alerta.nomeHardware}</p>
                </span>
                <span>
                    <p class="nome-maquina">${alerta.nome}</p> 
                    <p class="registro-maquina-alerta">${calculo}%</p>
                </span>
            `;
            divMaquinasAlertas.appendChild(novaDivMaquinaAlerta);
            alertaAlertaPresente = true;
            novaDivMaquinaAlerta.addEventListener('click', () => {
                const idComputador = novaDivMaquinaAlerta.getAttribute('data-id');
                irParaDash(idComputador);
            });
        } else if (alerta.gravidade === "Crítica") {
            novaDivMaquinaCritica.innerHTML = `
                <span>
                    <i class="${componenteIcon}"></i>
                    <p>${alerta.nomeHardware}</p>
                </span>
                <span>
                    <p class="nome-maquina">${alerta.nome}</p> 
                    <p class="registro-maquina-critico blinking-text">${calculo}%</p>
                </span>
            `;
            divMaquinasCriticas.appendChild(novaDivMaquinaCritica);
            alertaCriticaPresente = true;
            novaDivMaquinaCritica.addEventListener('click', () => {
                const idComputador = novaDivMaquinaCritica.getAttribute('data-id');
                irParaDash(idComputador);
            });
        }


    });

    if (!alertaAlertaPresente) {
        divMaquinasAlertas.innerHTML = "<p style='color: var(--dark);'>Não há alertas do tipo alerta.</p>";
    }

    if (!alertaCriticaPresente) {
        divMaquinasCriticas.innerHTML = "<p style='color: var(--dark);'>Não há alertas do tipo crítico.</p>";
    }
}

function irParaDash(idComputador) {
    window.location.href = `dashboard.html?id=${idComputador}`;
}
function atualizarRegistrosEAlertas() {
    obterRegistrosDoBanco()
        .then((registros) => {
            return obterAlertasDoBanco().then((alertas) => {
                return { registros, alertas };
            });
        })
        .then(({ registros, alertas }) => {
            cadastrarAlertas(registros, alertas);
            criarElementosDosAlertas(alertas);
        })
        .catch((error) => {
            console.error("Erro ao atualizar registros e alertas:", error);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    const elementosPiscantes = document.querySelectorAll('.registro-maquina-critico');
    setInterval(function () {
        elementosPiscantes.forEach(elemento => {
            elemento.classList.toggle('blinking-text');
        });
    }, 500);

    setInterval(atualizarRegistrosEAlertas, 5000); // Atualiza a cada 5 segundos
});