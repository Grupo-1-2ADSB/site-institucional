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

  usuarios.forEach((usuario) => {
    const partesNome = usuario.nomeCompleto.split(" ");
    const nomeAbreviado = partesNome.slice(0, 2).join(" ");

    const novaTrUsuario = document.createElement("tr");
    novaTrUsuario.innerHTML = `
      <td>
        <i class="fa-solid fa-user"></i>
        <p>${nomeAbreviado}</p>
      </td>
    `;

    tbodyConteudo.appendChild(novaTrUsuario);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  obterUsuariosDoBanco().then((usuarios) => {
    criarElementosDosUsuarios(usuarios);
  });
});

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

function criarElementosDasMaquinasAnalytics(maquinas) {
  const taskList = document.getElementById("task_list");
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
        break;
      default:
        statusClass = "";
    }

    const novaUlMaquina = document.createElement("ul");

    let maquinaEstadoComponentes = "Crítico";
    novaUlMaquina.innerHTML = `
      <li class="${statusClass}">
        <div class="task-title">
          <i class='bx bx-check-circle'></i>
          <p>${maquina.nome} - Estado ${maquinaEstadoComponentes}</p> 
        </div>
        <div>
          <button class="btn-visualizar-dash" data-id="${maquina.idComputador}">Visualizar Detalhadamente</button>
        </div>
      </li>
    `;

    taskList.appendChild(novaUlMaquina);
  });

  criarElementosMaqOnOff(maquinasOn);

  document.querySelectorAll('.btn-visualizar-dash').forEach(button => {
    button.addEventListener('click', () => {
      const idComputador = button.getAttribute('data-id');
      irParaDash(idComputador);
    });
  });
}

function criarElementosMaqOnOff(maquinasOn) {
  const novaLiOn = document.createElement("li");
  const novaLiOff = document.createElement("li");

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

  statusMaquinas.appendChild(novaLiOn);
  statusMaquinas.appendChild(novaLiOff);
}

function irParaDash(idComputador) {
  window.location.href =  `dashboard.html?id=${idComputador}`;
}

document.addEventListener("DOMContentLoaded", () => {
  obterMaquinasDoBanco().then((maquinas) => {
    criarElementosDasMaquinasAnalytics(maquinas);
  });

  const elementosPiscantes = document.querySelectorAll('.registro-maquina-critico');      
  setInterval(function() {
    elementosPiscantes.forEach(elemento => {
      elemento.classList.toggle('piscando');
    })  
  }, 500);
});
