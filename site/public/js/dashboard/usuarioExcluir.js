// const btnExcluirUser = document.getElementById("btn_excluir_user");
// const tbody = document.getElementById("tbody");

// function excluirUsuario(valueUsuario) {
//     fetch("/usuarios/excluirUsuario", {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//         }, 
//         body: JSON.stringify({
//             valueUsuarioServer: valueUsuario
//         }),
//     })
//     .then(function (resposta) {
//         if (resposta.ok) {
//             console.log("Usuario com id" + valueUsuario + "deletado");
//             tbody.innerHTML = `
//                     <tr>
//                     <td>
//                         <img
//                             src="https://pm1.aminoapps.com/8209/33a84f48852bee9f54addaf6b8a500ba47c0456fr1-720-721v2_hq.jpg">
//                         <p>Bia Rosa</p>
//                     </td>
//                     <td><button class="btn-excluir-user">Excluir</button></td>
//                 </tr>
//                 <tr>
//                     <td>
//                         <img src="https://i.pinimg.com/736x/d0/66/6a/d0666ab048429c9f6e4393ca26549fdf.jpg">
//                         <p>Lucas de Paula</p>
//                     </td>
//                     <td><button class="btn-excluir-user">Excluir</button></td>
//                 </tr>
//             `;
//         } else {
//             throw new Error("Houve um erro ao tentar excluir usuário");
//         }
//     })
//     .catch (function (erro) {
//         console.error("Erro ao tentar excluir usuário:", erro);
//     });
//     return false;
// }

function a() {
    console.log("ENTROU");

}