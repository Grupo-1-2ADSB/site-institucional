// Função para mudar cor da option quando for selecionada no select
const corSelecionada = "var(--primary)";
const selectCargo = document.getElementById("select_cargo");

selectCargo.addEventListener("change", function() {
    this.style.color = corSelecionada;
});

// Função para trocar o tipo dos inputs de senha e mudar o icon do olho
function trocarIconOlho(input, span) {
    if (input.type === "password") {
        input.type = "text";
        span.classList.remove("input-senha-olho-fechado");
        span.classList.add("input-senha-olho-aberto");
        
    } else if (input.type === "text") {
        input.type = "password";
        span.classList.remove("input-senha-olho-aberto");
        span.classList.add("input-senha-olho-fechado");
    }
}

// Chamadas da função

const inputSenha = document.getElementById("input_senha");
const spanSenha = document.getElementById("span_senha");

spanSenha.addEventListener("click", function() {
    trocarIconOlho(inputSenha, spanSenha);
});

const inputRepetirSenha = document.getElementById("input_repetir_senha");
const spanRepetirSenha = document.getElementById("span_repetir_senha");

spanRepetirSenha.addEventListener("click", function() {
    trocarIconOlho(inputRepetirSenha, spanRepetirSenha);
});

