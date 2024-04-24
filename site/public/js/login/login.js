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

// Início da rota de Login
// validção dos inputs

function validarLogin(){
    const userNameVar = senha_input.value;
    const senhaVar = senha_input.value;
    const regexSenha = /^(?=.*[0-9]).{8,}$/;
    
    var validacao_senha01 = senhaVar == "";
    var validacao_email01 = userNameVar == "";

  
    if(validacao_senha01 && validacao_email01){
        cardMsg.style.display = "block"
        cardMsg.style.border = "2px solid red"
        cardMsg.style.boxShadow = "0px 0px 8px rgba(0, 0, 0, 0.7)"
        cardMsg.style.color = "red"
        cardMsg.innerHTML = "❌ Todos os seu dados estão em branco!"; 

    } else if(validacao_senha01){
        cardMsg.style.display = "block"
        cardMsg.style.border = "2px solid red"
        cardMsg.style.boxShadow = "0px 0px 8px rgba(0, 0, 0, 0.7)"
        cardMsg.style.color = "red"
        cardMsg.innerHTML = "❌ Sua senha está em branco e assim não é possível prosseguir!"; 

    } else if(validacao_email01){
        cardMsg.style.display = "block"
        cardMsg.style.border = "2px solid red"
        cardMsg.style.boxShadow = "0px 0px 8px rgba(0, 0, 0, 0.7)"
        cardMsg.style.color = "red"
        cardMsg.innerHTML = "❌ Seu nome de usuário está em branco e assim não é possível prosseguir!";

    } else if(!regexSenha.test(senhaVar)){
        cardMsg.style.display = "block"
        cardMsg.style.border = "2px solid red"
        cardMsg.style.boxShadow = "0px 0px 4px rgba(0, 0, 0, 0.7)"
        cardMsg.style.color = "red"
        cardMsg.innerHTML = "❌ Senha INVÁLIDA";

    } else {
        logar()
    }
}

function logar(){
    var senhaVar = senha_input.value;
    var emailVar = email_input.value;

    fetch("/login/logar",{
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            emailServer: emailVar,
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

                sessionStorage.ID_USUARIO = json.idUsuario;
                sessionStorage.NAME_USER = json.nomeUser;
                sessionStorage.CARGO = json.FkCargo;
                sessionStorage.EMAIL = json.email;
                sessionStorage.SENHA = json.senha;
                sessionStorage.HOSPITAL = json.fkUnidadeHospitalar;
                
                setTimeout(function() {
                    window.location.href = "../../dashboard/dashboard.html";
                }, 2000);
            })
        } else {
            cardMsg.style.display = "block"
            cardMsg.style.border = "2px solid red"
            cardMsg.style.color = "red"
            cardMsg.style.boxShadow = "0px 0px 8px rgba(0, 0, 0, 0.7)"
            cardMsg.innerHTML = "❌Conta NÃO cadastrada❌";

            resposta.text().then(texto => {
                console.error(texto);
            });  
        }
    }).catch(function (erro) {
        console.log(erro);
    });

    return false;
}

function logout() {
    sessionStorage.clear();

    setTimeout(function() {
        window.location.href = "../../index.html";
    }, 2000);
}