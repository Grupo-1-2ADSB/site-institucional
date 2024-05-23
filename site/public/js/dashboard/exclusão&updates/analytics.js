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

  function criarElementosDasMaquinasAnalytics(maquinas) {
    const taskList = document.getElementById("task_list");
  
    maquinas.forEach((maquina) => {
      let statusClass = "";
      switch (maquina.statusPC) {
        case "ativado":
          statusClass = "completed";
          break;
        case "desativado":
          statusClass = "not-completed";
          break;
        case "manutenção":
          statusClass = "status-maintenance";
          break;
        default:
          statusClass = "";
      }
  
      const novaUlMaquina = document.createElement("ul");
  
      novaUlMaquina.innerHTML = `
          <li class="${statusClass}">
            <div class="task-title">
                <i class='bx bx-check-circle'></i>
                <p>${maquina.nome}</p> 
            </div>
          </li>
          `;
  
      taskList.appendChild(novaUlMaquina);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    obterMaquinasDoBanco().then((maquinas) => {
      criarElementosDasMaquinasAnalytics(maquinas);
    });
  });