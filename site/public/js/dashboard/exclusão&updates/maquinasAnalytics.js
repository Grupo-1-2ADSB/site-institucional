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
          `;
  
      tbodyConteudo.appendChild(novaTrUsuario);
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    obterUsuariosDoBanco().then((usuarios) => {
      criarElementosDosUsuarios(usuarios);
    });
  });