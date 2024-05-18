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
                    <img src="../../assets/dashboard/usuarios/iconsForms/user-svgrepo-com.svg">
                    <p>${nomeAbreviado}</p>
                </td>
                <td><button value="${usuario.idUsuario}" onclick="excluirUsuario(this.value, event)" class="btn-excluir-user">Excluir</button></td>
        `;

    tbodyConteudo.appendChild(novaTrUsuario);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  obterUsuariosDoBanco().then((usuarios) => {
    criarElementosDosUsuarios(usuarios);
  });
});

function criarElementosDosUsuariosAnalytics(usuarios) {
  usuarios.forEach((usuario) => {
    novaTrUsuario.innerHTML = `
                <td>
                    <img src="../../assets/dashboard/usuarios/iconsForms/user-svgrepo-com.svg">
                    <p>${nomeAbreviado}</p>
                </td>
        `;

    tbodyConteudo.appendChild(novaTrUsuario);
  });
}

const btnExcluirUser = document.getElementsByClassName("btn-excluir-user");

function excluirUsuario(valueUsuario, event) {
  event.preventDefault();
  fetch("/usuarios/excluirUsuario", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      valueUsuarioServer: valueUsuario,
    }),
  })
    .then(function (resposta) {
      if (resposta.ok) {
        Swal.fire({
          title: "Maravilha!",
          text: "Usuário deletado com sucesso!",
          icon: "success",
        });

        setTimeout(() => {
          redirecionarPorCargo();
        }, 2000);
      } else {
        throw new Error("Houve um erro ao tentar excluir usuário");
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

function redirecionarPorCargo() {
  if (sessionStorage.CARGO === "1") {
    setTimeout(() => {
      window.location = "../../dashboard/engenheiroInfra/usuarios.html";
    }, 2000);
  } else if (sessionStorage.CARGO === "2") {
    setTimeout(() => {
      window.location = "../../dashboard/gerenteInfra/usuarios.html";
    }, 2000);
  } else if (sessionStorage.CARGO === "3") {
    setTimeout(() => {
      window.location = "../../dashboard/tecnicoInfra/usuarios.html";
    }, 2000);
  }
}
