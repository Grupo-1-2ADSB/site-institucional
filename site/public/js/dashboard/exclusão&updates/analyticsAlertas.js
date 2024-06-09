function obterRegistrosDoBanco(){
    const fkUnidadeHospitalar = sessionStorage.HOSPITAL;
    return fetch(`/maquinas/obterRegistrosDoBanco/${fkUnidadeHospitalar}`)
      .then((response) => {
        if(!response.ok){
          throw new Error("Erro ao obter registros do banco de dados");
        }
        return response.json();
      })
      .catch((error) =>{
        console.error("Erro ao obter registros:", error);
      })
  }

function cadastrarAlertas(registros, alertas) {
registros.forEach((registro) => {
    let nomeHardware = registro.nomeHardware;
    let gravidade;
    let descricao;
    let valorHardware = registro.valorHardware;
    let valorAtual = registro.valor;
    const calculo = ((valorAtual / valorHardware) * 100).toFixed(1);

    if (calculo >= 80.0 && calculo >= 90.0) {
    if (calculo >= 80.0) {
        gravidade = "Alerta";
        descricao = `O componente ${nomeHardware} está acima de ${calculo}% do ideal para o uso.`;
    } else if (calculo >= 90.0) {
        gravidade = "Crítica";
        descricao = `O componente ${nomeHardware} está em estado crítico, acima de ${calculo}% do ideal para o uso. Envie um técnico imediatamente.`;
    }

    console.log(alertas)
    const alertaExistente = alertas.some(
    (alerta) => alerta.fkRegistro === registro.idRegistro
    );

    console.log(alertaExistente);

    if (!alertaExistente) {
        const dados = {
        gravidadeServer: gravidade,
        descricaoServer: descricao,
        fkRegistroServer: registro.idRegistro
        };

        fetch("/alertas/cadastrarAlertas", {
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
            console.log("Alerta Inserido")
        }
        })
        .catch((error) => {
        console.error("Erro ao inserir alerta:", error);
        });
    }
    }
});
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

    if (alertas.length === 0) {
        divMaquinasAlertas.innerHTML = "<p style='color: var(--dark);'>Não há alertas do tipo alerta.</p>";
        divMaquinasCriticas.innerHTML = "<p style='color: var(--dark);'>Não há alertas do tipo alerta.</p>";
        return; 
    }

    let alertaAlertaPresente = false;
    let alertaCriticaPresente = false;

    alertas.forEach((alerta) => {
        let valorHardware = alerta.valor[0];
        let valorAtual = alerta.valor[1];
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
            novaDivMaquinaCritica .addEventListener('click', () => {
                const idComputador = novaDivMaquinaCritica .getAttribute('data-id');
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
    window.location.href =  `dashboard.html?id=${idComputador}`;
}


function atualizarRegistrosEAlertas() {
    obterRegistrosDoBanco().then((registros) => {
        obterAlertasDoBanco().then((alertas) => {
            cadastrarAlertas(registros, alertas);
            criarElementosDosAlertas(alertas); 
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {  
    const elementosPiscantes = document.querySelectorAll('registro-maquina-critico');      
        setInterval(function() {
            elementosPiscantes.forEach(elemento => {
            elemento.classList.toggle('piscando');
            })  
        }, 500);

    setInterval(atualizarRegistrosEAlertas, 5000);
});