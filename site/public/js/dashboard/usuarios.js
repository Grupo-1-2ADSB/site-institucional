// Função para exibir senhas
function exibirSenha(input) {
    input.type = (input.type === "password") ? "text" : "password";
}

// Função para mudar cor da option quando for selecionada no select
const corSelecionada = "var(--primary)";
const selectCargo = document.getElementById("select_cargo");

selectCargo.addEventListener("change", function() {
    this.style.color = corSelecionada;
});

