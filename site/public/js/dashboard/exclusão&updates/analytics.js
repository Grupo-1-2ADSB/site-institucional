function obterUsuariosDoBanco() {
  const fkUnidadeHospitalar = sessionStorage.HOSPITAL;
  return fetch(`/usuarios/obterUsuariosDoBanco/${fkUnidadeHospitalar}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao obter usuários do banco de dados");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erro ao obter usuários:", error);
    });
}

function obterUsuariosDoBanco() {
  const fkUnidadeHospitalar = sessionStorage.HOSPITAL;
  return fetch(`/usuarios/obterUsuariosDoBanco/${fkUnidadeHospitalar}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao obter usuários do banco de dados");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erro ao obter usuários:", error);
    });
}

function criarElementosDosUsuarios(usuarios) {
  const tbodyConteudo = document.getElementById("tbody");

  console.log(usuarios);
  usuarios.forEach((usuario) => {
    const partesNome = usuario.nomeCompleto.split(" ");
    const nomeAbreviado = partesNome.slice(0, 2).join(" ");

    const novaTrUsuario = document.createElement("tr");
    novaTrUsuario.innerHTML = `
      <td>
        <i style="font-size: 25px;" class="fa-solid fa-user"></i>
        <div style="display: flex;
        flex-direction: column;">
        <p style="font-size: 17px;
        line-height: 19px;">${nomeAbreviado}</p>
        <p style="font-size: 13px;
        font-style: italic;">${usuario.nome}</p>
        </div>
      </td>
    `;

    tbodyConteudo.appendChild(novaTrUsuario);
  });
}

function obterMaquinasDoBanco() {
  const fkUnidadeHospitalar = sessionStorage.HOSPITAL;
  return fetch(`/maquinas/obterMaquinasDoBanco/${fkUnidadeHospitalar}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao obter maquinas do banco de dados");
      }
      return response.json(); 
    })
    .catch((error) => {
      console.error("Erro ao obter maquinas:", error);
    });
}

let maquinasOn = 0;
let maquinasOff = 0;
let maquinasManutencao = 0;

function criarElementosDasMaquinasAnalytics(maquinas, alertas) {
  const taskList = document.getElementById("task_list");

  // Verifique se a lista de máquinas está vazia
  if (maquinas.length === 0) {
    taskList.innerHTML = "<p>Não há máquinas cadastradas.</p>";
    return; // Interrompe a execução da função
  }

  maquinas.forEach((maquina) => {
    let statusClass = "";
    switch (maquina.statusPC) {
      case "ativado":
        statusClass = "completed";
        maquinasOn++;
        break;
      case "desativado":
        statusClass = "not-completed";
        maquinasOff++;
        break;
      case "manutenção":
        statusClass = "status-maintenance";
        maquinasManutencao++;
        break;
      default:
        statusClass = "";
    }

    let estadoMaquina = "Normal";
    let iconEstadoMaquina = "bx bx-check-circle";

    const alertaMaquina = alertas.find(alerta => alerta.idComputador === maquina.idComputador);
    if (alertaMaquina) {
      estadoMaquina = alertaMaquina.gravidade === "Crítica" ? "Crítica" : "Alerta";
    } 
    if (estadoMaquina === "Alerta") {
      iconEstadoMaquina = "bx bx-error";
    } else if (estadoMaquina === "Crítica") {
      estadoMaquina = "fa-solid fa-land-mine-on";
    }

    alertas.find(alerta => alerta.idComputador === maquina.idComputador);
    if (alertaMaquina) {
      estadoMaquina = alertaMaquina.gravidade === "Crítica" ? "Crítica" : "Alerta";
    }

    const novaUlMaquina = document.createElement("ul");

    novaUlMaquina.innerHTML = `
      <li class="${statusClass}">
        <div class="task-title">
          <i class='${iconEstadoMaquina}'></i>
          <p>${maquina.nome} - Estado ${estadoMaquina}</p>
        </div>
        <div>
          <button class="btn-visualizar-dash" data-id="${maquina.idComputador}">Visualizar Detalhadamente</button>
        </div>
      </li>
    `;

    taskList.appendChild(novaUlMaquina);
  });

  criarElementosMaqOnOff(maquinasOn, maquinasOff, maquinasManutencao);

  document.querySelectorAll('.btn-visualizar-dash').forEach(button => {
    button.addEventListener('click', () => {
      const idComputador = button.getAttribute('data-id');
      irParaDash(idComputador);
    });
  });
}

function criarElementosMaqOnOff(maquinasOn, maquinasOff, maquinasManutencao) {
  const novaLiOn = document.createElement("li");
  const novaLiOff = document.createElement("li");
  const novaLiManutencao = document.createElement("li");

  const statusMaquinas = document.getElementById("status_maquinas");

  novaLiOn.innerHTML = `
    <i class='bx bx-desktop'></i>
    <span class="info">
      <h3>${maquinasOn}</h3>
      <p>Máquinas On</p>
    </span>
  `;

  novaLiOff.innerHTML = `
    <i class='bx bx-desktop'></i>
    <span class="info">
      <h3>${maquinasOff}</h3>
      <p>Máquinas Off</p>
    </span>
  `;

  novaLiManutencao.innerHTML = `
    <i class='bx bx-desktop'></i>
    <span class="info">
      <h3>${maquinasManutencao}</h3>
      <p>Máquinas em Manutenção</p>
    </span>
  `;

  statusMaquinas.appendChild(novaLiOn);
  statusMaquinas.appendChild(novaLiOff);
  statusMaquinas.appendChild(novaLiManutencao);
}


function irParaDash(idComputador) {
  window.location.href =  `dashboard.html?id=${idComputador}`;
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

document.addEventListener("DOMContentLoaded", () => {
  obterUsuariosDoBanco().then((usuarios) => {
    criarElementosDosUsuarios(usuarios);
  });

  obterMaquinasDoBanco().then((maquinas) => {
    obterAlertasDoBanco().then((alertas) => {
      criarElementosDasMaquinasAnalytics(maquinas, alertas);
    })
  });
});
