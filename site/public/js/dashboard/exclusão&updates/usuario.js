function obterUsuariosDoBanco() {
    return fetch("/usuarios/obterUsuariosDoBanco")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao obter usuários do banco de dados");
            }
            return response.json();
        })
        .catch(error => {
            console.error("Erro ao obter usuários:", error);
        })
}

function criarElementosDosUsuarios(usuarios) {
    const tbodyConteudo = document.getElementById("tbody");

    usuarios.forEach(usuario => {
        const novaTrUsuario = document.createElement("tr");
        novaTrUsuario.innerHTML = `
                <td>
                    <img src="../assets/dashboard/usuarios/iconsForms/user-svgrepo-com.svg">
                    <p>${usuario.nomeCompleto}</p>
                </td>
                <td><button value="${usuario.idUsuario}" onclick="excluirUsuario(this.value)"  class="btn-excluir-user">Excluir</button></td>
        `;

        tbodyConteudo.appendChild(novaTrUsuario);
    })
}

document.addEventListener("DOMContentLoaded", () => {
    obterUsuariosDoBanco()
        .then(usuarios => {
            criarElementosDosUsuarios(usuarios);
        })
});


const btnExcluirUser = document.getElementsByClassName("btn-excluir-user");

function excluirUsuario(valueUsuario) {
    fetch("/usuarios/excluirUsuario", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify({
            valueUsuarioServer: valueUsuario
        }),
    })
    .then(function (resposta) {
        if (resposta.ok) {
            console.log("Usuario com id" + valueUsuario + "deletado");
        } else {
            throw new Error("Houve um erro ao tentar excluir usuário");
        }
    })
    .catch (function (erro) {
        console.error("Erro ao tentar excluir usuário:", erro);
    });
    return false;
}



