// Selecionando todos os links do menu lateral, exceto o link de logout
const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

// Iterando sobre cada link do menu lateral
sideLinks.forEach(item => {
    // Obtendo o elemento pai <li> de cada link
    const li = item.parentElement;
    // Adicionando um evento de clique a cada link
    item.addEventListener('click', () => {
        // Removendo a classe 'active' de todos os links do menu lateral
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        // Adicionando a classe 'active' apenas ao link clicado
        li.classList.add('active');
    });
});

// Selecionando o ícone do menu na barra de navegação
const menuBar = document.querySelector('.content nav .bx.bx-menu');
// Selecionando a barra lateral
const sideBar = document.querySelector('.sidebar');

// Adicionando um evento de clique ao ícone do menu
menuBar.addEventListener('click', () => {
    // Alternando a classe 'close' na barra lateral ao clicar no ícone do menu
    sideBar.classList.toggle('close');
});

// Selecionando o botão de pesquisa na barra de navegação
const searchBtn = document.querySelector('.content nav form .form-input button');
// Selecionando o ícone dentro do botão de pesquisa
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
// Selecionando o formulário de pesquisa
const searchForm = document.querySelector('.content nav form');

// Selecionando o alternador de tema
const toggler = document.getElementById('theme-toggle');

// Adicionando um evento de mudança ao alternador de tema
toggler.addEventListener('change', function () {
    // Verificando se o alternador está marcado
    if (this.checked) {
        // Adicionando a classe 'dark' ao corpo do documento se o alternador estiver marcado
        document.body.classList.add('dark');
    } else {
        // Removendo a classe 'dark' do corpo do documento se o alternador não estiver marcado
        document.body.classList.remove('dark');
    }
});
