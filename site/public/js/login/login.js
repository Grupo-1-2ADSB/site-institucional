const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const sign_in_btn2 = document.querySelector("#sign-in-btn2");
const sign_up_btn2 = document.querySelector("#sign-up-btn2");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
})

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
})

sign_up_btn2.addEventListener("click", () => {
    container.classList.add("sign-up-mode2");
})

sign_in_btn2.addEventListener("click", () => {
    container.classList.remove("sign-up-mode2");
})

function validarLogin(){
    const userNameVar = userName_input.value;
    const senhaVar = senha_input.value;
    const regexSenha = /^(?=.*[0-9]).{8,}$/;
    
    var validacao_senha01 = senhaVar == "";
    var validacao_nameUser01 = userNameVar == "";

  
    if(validacao_senha01){
        Swal.fire({
            title: "Mensagem de Erro:",
            text: "Sua senha está em branco e assim não é possível prosseguir!",
            imageUrl: "",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image"
        });
    } else if(validacao_nameUser01){
        Swal.fire({
            title: "Mensagem de Erro:",
            text: "Seu nome de usuário está em branco e assim não é possível prosseguir!",
            imageUrl: "",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image"
        });  
    } else if(!regexSenha.test(senhaVar)){
        Swal.fire({
            title: "Mensagem de Erro:",
            text: "Sua senha tem que ter pelo menos 5 caracteres, contendo um dígito numérico",
            imageUrl: "",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image"
          });
    } else {
        logar()
    }
}

function logar(){
    var senhaVar = senha_input.value;
    var nameUserVar = userName_input.value;

    fetch("/login/logar",{
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            nameUserServer: nameUserVar,
            senhaServer: senhaVar
        })
    }).then(function (resposta) {
        console.log("ESTOU NO THEN DO logar()!");

        if(resposta.ok){
            console.log(resposta);

            resposta.json().then(json => {
                cardMsg.style.display = "block"
                cardMsg.style.border = "2px solid #00B802"
                cardMsg.style.boxShadow = "0px 0px 8px rgba(0, 0, 0, 0.7)"
                cardMsg.style.color = "#00B802"
                cardMsg.innerHTML = "✅Entrando! Aguarde...✅"; 
            })
        } else {
            cardMsg.style.display = "block"
            cardMsg.style.border = "2px solid red"
            cardMsg.style.color = "red"
            cardMsg.style.boxShadow = "0px 0px 8px rgba(0, 0, 0, 0.7)"
            cardMsg.innerHTML = "❌Conta não cadastrada❌";

            resposta.text().then(texto => {
                console.error(texto);
            });  
        }
    }).catch(function (erro) {
        console.log(erro);
    });

    return false;
}