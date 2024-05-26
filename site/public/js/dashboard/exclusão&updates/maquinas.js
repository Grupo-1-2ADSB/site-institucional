document.addEventListener("DOMContentLoaded", () => {
  obterMaquinasDoBanco().then((maquinas) => {
    criarElementosDasMaquinas(maquinas);
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

function criarElementosDasMaquinas(maquinas) {
  const machineList = document.getElementById("machineList");

  maquinas.forEach((maquina) => {
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
            <div class="li-info-maquinas">
                <i class="bx bx-desktop"></i> 
                <span class="machine-name">${maquina.nome}</span> - <span class="machine-ip">${maquina.localizacao}</span> - <span class="${statusClass}">${maquina.statusPC}</span>
            </div>
            <div class="li-btns">
                <button class="btn-editar-maquina" id="btn_editar_maquina">Editar informações</button>
                <button class="btn-excluir-maquina" id="btn_excluir_maquina">Excluir Máquina</button>
            </div>

        `;

    novaLiMaquina.querySelector(".btn-editar-maquina")
      .addEventListener("click", (event) => {
        event.stopPropagation(); // Impede a propagação do evento para os pais
        exibirModalEditarMaq(event, maquina);
      });

      novaLiMaquina.querySelector(".btn-excluir-maquina")
      .addEventListener("click", (event) => {
        event.stopPropagation(); // Impede a propagação do evento para os pais
        excluirMaquinas(event, maquina.idComputador, maquina.fkSO);
      });

    novaLiMaquina.addEventListener("click", () => {
      modalDetalhes.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Detalhes da Máquina</h2>
                <div class="machine-info">
                    <p><strong>Sistema Operacional:</strong> <span>${maquina.nomeSO} ${maquina.versaoSO}.</span></p>
                    <p><strong>Arquitetura do Sistema Operacional:</strong> <span>${maquina.arquiteturaSO}.</span></p>
                    <p><strong>Nome da Máquina:</strong> <span>${maquina.nome}.</span></p>
                    <p><strong>Código Serial da Máquina:</strong> <span>${maquina.idComputador}.</span></p>
                    <p><strong>Localização da Máquina:</strong> <span>${maquina.localizacao}.</span></p>
                    <p><strong>Status da Máquina:</strong> <span>${maquina.statusPC}.</span></p>
                </div>
        </div>
            `;

      document.querySelectorAll(".modal .close").forEach(function (closeBtn) {
        closeBtn.addEventListener("click", function () {
          var modal = this.closest(".modal");
          modal.style.display = "none";
          modal.querySelector(".modal-content").innerHTML = "";
        });
      });

      modalDetalhes.style.display = "block";
    });
    machineList.appendChild(novaLiMaquina);
  });
}

const modalEditarMaquina = document.getElementById("modal_editar_maquinas");

function exibirModalEditarMaq(event, maquina) {
  event.stopPropagation();


  modalEditarMaquina.innerHTML = `
    <div class="modal-content">
    <span class="close">&times;</span>
    <h2>Edite as informações da ${maquina.nome}</h2>
    <form id="machineForm">
        <div class="secao-info-so">
            <h3>Informações do SO da máquina</h3>
            <div class="form-group">
                <select name="soMaquina" id="sos_maquina_put">
                    <option value="default" default>Selecione um Sistema Operacional</option>
                    <option value="windows" ${maquina.nomeSO === "windows" ? "selected" : ""}>Windows</option>
                    <option value="linux" ${maquina.nomeSO === "linux" ? "selected" : ""}>Linux</option>
                </select>
                <span class="msg-erro-put"></span>
            </div>

            <input type="text" placeholder="Versão SO" id="input_versaoSO_put" value="${maquina.versaoSO}">
            <span class="msg-erro-put"></span>

            <select name="arquiteturaSO" id="arquiteturas_so_put">
                <option value="default">Selecione uma Arquitetura SO</option>
                <option value="x32" ${maquina.arquiteturaSO === "x32" ? "selected" : ""}>x32</option>
                <option value="x64" ${maquina.arquiteturaSO === "x64" ? "selected" : ""}>x64</option>
            </select>
            <span class="msg-erro-put"></span>
        </div>

        <div class="secao-info-so">
            <h3>Informações do computador</h3>

            <input class="input1" type="text" placeholder="Nome" id="input_nome_put" value="${maquina.nome}">
            <span class="msg-erro-put"></span>

            <input type="text" placeholder="Localização" id="input_localizacao_put" value="${maquina.localizacao}">
            <span class="msg-erro-put"></span>

            <div class="form-group2">
                <select name="statusMaquina" id="status_maquina_put">
                    <option value="default">Selecione o status do PC</option>
                    <option value="ativado" ${maquina.statusPC === "ativado" ? "selected" : ""}>Ativo</option>
                    <option value="desativado" ${maquina.statusPC === "desativado" ? "selected" : ""}>Inativo</option>
                    <option value="manutenção" ${maquina.statusPC === "manutenção" ? "selected" : ""}>Manutenção</option>
                </select>
                <span class="msg-erro-put"></span>
            </div>
        </div>

        <button type="button" id="btn_atualizar_maq" onclick="editarInformacoesMaq('${maquina.idComputador}', ${maquina.fkSO})">Atualizar</button>
    </form>
    </div>
    `;

  document.querySelectorAll(".modal-editar-maquina .close")
    .forEach(function (closeBtn) {
      closeBtn.addEventListener("click", function () {
        var modal = this.closest(".modal-editar-maquina");
        modal.style.display = "none";
        modal.querySelector(".modal-content").innerHTML = "";
      });
    });

  modalEditarMaquina.style.display = "block";
}

// Funções para fechar modals
var closeBtn = document.getElementsByClassName("close")[0];

closeBtn.onclick = function () {
  modalEditarMaquina.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modalEditarMaquina) {
    modalEditarMaquina.style.display = "none";
  }
};


// Funções para validar modal de editar informações da máquina
function limparMensagensErroPut() {
  for (let i = 0; i < mensagensErro.length; i++) {
    mensagensErro[i].textContent = "";
  }
}

function validarFormsPut() {
  limparMensagensErroPut();

  const SOsPut = document.getElementById("sos_maquina_put");
  const inputVersaoSOPut = document.getElementById("input_versaoSO_put");
  const arquiteturasSOPut = document.getElementById("arquiteturas_so_put");
  const inputNomePut = document.getElementById("input_nome_put");
  const inputLocalizacaoPut = document.getElementById("input_localizacao_put");
  const statusMaquinaPut = document.getElementById("status_maquina_put");
  const mensagensErroPut = document.getElementsByClassName("msg-erro-put");

  if (SOsPut.options.selectedIndex === 0) {
    mensagensErroPut[0].textContent = "*Selecione uma opção válida.";
    return false;
  } else if (inputVersaoSOPut.value.length < 2 || inputVersaoSOPut.value === "") {
    mensagensErroPut[1].textContent ="*Preencha o campo com 2 caracteres, no mínimo.";
    return false;
  } else if (arquiteturasSOPut.options.selectedIndex === 0) {
    mensagensErroPut[2].textContent = "*Selecione uma opção válida.";
    return false;
  } else if (inputNomePut.value.length < 4 || inputNomePut.value === "") {
    mensagensErroPut[3].textContent = "*Preencha o campo com 4 caracteres, no mínimo.";
    return false;
  } else if (inputLocalizacaoPut.value.length < 3 || inputLocalizacaoPut.value === "") {
    mensagensErroPut[4].textContent = "*Preencha o campo com 4 caracteres, no mínimo.";
    return false;
  } else if (statusMaquinaPut.options.selectedIndex === 0) {
    mensagensErroPut[5].textContent = "*Selecione uma opção válida.";
    return false;
  }

  const dados = {
    soServer: SOsPut.value,
    versaoSOServer: inputVersaoSOPut.value,
    arquiteturaSOServer: arquiteturasSOPut.value,
    nomeMaquinaServer: inputNomePut.value,
    localizacaoServer: inputLocalizacaoPut.value,
    statusMaquinaServer: statusMaquinaPut.value,
    fkUnidadeHospitalarServer: sessionStorage.HOSPITAL,
  };

  return dados;
}

// Fetch editar informações
function editarInformacoesMaq(idComputador, fkSO) {
  const formData = validarFormsPut();

  if (formData) {
    formData.idComputadorServer = idComputador;
    formData.fkSOServer = fkSO;

    fetch("/maquinas/editarInformacoesMaq", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then(function (response) {
      if (response.status === 200) {
        Swal.fire({
          title: "Maravilha!",
          text: "As alterações foram realizadas com sucesso!",
          icon: "success",
        });

        setTimeout(() => {
          location.reload();
        }, 2000);
      } else {
        mensagensErro[6].innerHTML = "Houve um erro ao tentar realizar o cadastro!";
        mensagensErro[6].style.color = "red";
        console.error("Erro ao tentar realizar o cadastro:", body.error);
      }
    })
      .catch(function (erro) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo deu errado! Por favor, reveja os dados alterados.",
        });
        console.error("Erro ao tentar realizar as alterações:", erro);
      });
    return false;
  }
}

function excluirMaquinas(event, idMaquina, fkSO) {
  event.stopPropagation();

  fetch("/maquinas/excluirMaquinas", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idMaquinaServer: idMaquina,
      fkSOServer: fkSO
    }),
  })
    .then(function (resposta) {
      if (resposta.ok) {
        Swal.fire({
          title: "Maravilha!",
          text: "Máquina deletada com sucesso!",
          icon: "success",
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Houve um erro ao tentar excluir máquina");
      }
    })
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo deu errado!",
      });
    });

  return false;
}
