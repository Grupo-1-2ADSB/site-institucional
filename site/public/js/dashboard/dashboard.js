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

// Função para obter parâmetros da URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function obter7RegistrosDoBanco(){
    const fkUnidadeHospitalar = sessionStorage.HOSPITAL;
    return fetch(`/maquinas/obter7RegistrosDoBanco/${fkUnidadeHospitalar}`)
      .then((response) => {
        if(!response.ok){
          throw new Error("Erro ao obter registros do banco de dados");
        }
        return response.json();
      })
      .catch((error) =>{
        console.error("Erro ao obter registros:", error);
      })
  }

  google.charts.load("current", { packages: ["corechart"] });

  function getThemeColor() {
    // Obtenha a cor da variável CSS com base no estado do checkbox
    var isDarkTheme = document.getElementById('theme-toggle').checked;
    return getComputedStyle(document.documentElement).getPropertyValue(isDarkTheme ? '--light' : '--dark');
  }

  function prepararDadosParaGrafico(registros, numRegistrosDesejados) {
    const dadosCPU = [["Hora do dia", "Uso da CPU(%)"]];
    const dadosRAM = [["Hora do dia", "Uso da RAM(%)"]];
    const dadosDisco = [["Discos", "% usado", { role: "style" }]];
    const dadosRede = [["Medida", "Valor"]];

    const ultimosRegistrosCPU = registros
        .filter((r) => r.nomeHardware === 'CPU')
        .slice(-numRegistrosDesejados)
        .reverse();
    const ultimosRegistrosRAM = registros
        .filter((r) => r.nomeHardware === 'Memória RAM')
        .slice(-numRegistrosDesejados)
        .reverse();
    const ultimosRegistrosDisco = registros
        .filter((r) => r.nomeHardware === 'Disco Rígido')
        .slice(-numRegistrosDesejados)
        .reverse();
    const ultimosRegistrosRede = registros
        .filter((r) => r.nomeHardware === 'Rede')
        .slice(-numRegistrosDesejados)
        .reverse();

    for (let i = 0; i < numRegistrosDesejados; i++) {
        const horaCPU = ultimosRegistrosCPU[i] ? new Date(ultimosRegistrosCPU[i].dataHora).toLocaleTimeString() : null;
        const horaRAM = ultimosRegistrosRAM[i] ? new Date(ultimosRegistrosRAM[i].dataHora).toLocaleTimeString() : null;
        const valorDisco = ultimosRegistrosDisco[i] ? ultimosRegistrosDisco[i].valor : null;
        const horaRede = ultimosRegistrosRede[i] ? new Date(ultimosRegistrosRede[i].dataHora).toLocaleTimeString() : null;
        const valorRede = ultimosRegistrosRede[i] ? ultimosRegistrosRede[i].valor : null;

        dadosCPU.push([horaCPU, ultimosRegistrosCPU[i] ? ultimosRegistrosCPU[i].valor : null]);
        dadosRAM.push([horaRAM, ultimosRegistrosRAM[i] ? ultimosRegistrosRAM[i].valor : null]);
        dadosDisco.push(["Disco", valorDisco, "blue"]);
        dadosRede.push([horaRede, valorRede]);
    }

    return { dadosCPU, dadosRAM, dadosDisco, dadosRede };
}

function drawAllCharts(registros) {
    var darkColor = getThemeColor();

    var optionsCPU = {
        title: "Desempenho do Sistema (CPU)",
        legend: { position: "bottom", textStyle: { color: darkColor } },
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        titleTextStyle: { color: darkColor },
        hAxis: { textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        vAxis: { textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        animation: {
            duration: 1000,
            easing: 'out',
        },
        chartArea: {
            width: "100%",
            height: "60%",
            top: "10%",
            left: "10%",
        },
    };

    var optionsRAM = {
        title: "Desempenho do Sistema (RAM)",
        legend: { position: "bottom", textStyle: { color: darkColor } },
        backgroundColor: "transparent",
        series: {
            0: { color: "#D32F2F" },
        },
        width: "100%",
        height: "100%",
        titleTextStyle: { color: darkColor },
        hAxis: { textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        vAxis: { textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        animation: {
            duration: 1000,
            easing: 'out',
        },
        chartArea: {
            width: "100%",
            height: "60%",
            top: "10%",
            left: "10%",
        },
    };

    var optionsDisco = {
        title: "Percentual de uso do Disco",
        backgroundColor: "transparent",
        bar: { groupWidth: "95%" },
        legend: { position: "none" },
        width: "100%",
        height: "100%",
        titleTextStyle: { color: darkColor },
        hAxis: { textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        vAxis: { textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        animation: {
            duration: 1000,
            easing: 'out',
        },
        chartArea: {
            width: "100%",
            height: "60%",
            top: "10%",
            left: "10%",
        },
    };

    var optionsRede = {
        title: "Velocidade de Download da Rede",
        hAxis: { title: "Medida", titleTextStyle: { color: darkColor }, textStyle: { color: darkColor } },
        vAxis: { minValue: 0, textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        titleTextStyle: { color: darkColor },
        animation: {
            duration: 1000,
            easing: 'out',
        },
        chartArea: {
            width: "75%",
            height: "60%",
            top: "10%",
            left: "10%",
        },
    };

    var { dadosCPU, dadosRAM, dadosDisco, dadosRede } = prepararDadosParaGrafico(registros, 7);

    var chartCPU = new google.visualization.LineChart(
        document.getElementById("line_chart_CPU")
    );
    chartCPU.draw(google.visualization.arrayToDataTable(dadosCPU), optionsCPU);

    var chartRAM = new google.visualization.LineChart(
        document.getElementById("line_chart_RAM")
    );
    chartRAM.draw(google.visualization.arrayToDataTable(dadosRAM), optionsRAM);

    var chartDisco = new google.visualization.BarChart(
        document.getElementById("barchart_Disco")
    );
    chartDisco.draw(google.visualization.arrayToDataTable(dadosDisco), optionsDisco);

    var chartRede = new google.visualization.AreaChart(
        document.getElementById("areachart")
    );
    chartRede.draw(google.visualization.arrayToDataTable(dadosRede), optionsRede);
}


let lastSevenRecords = [];
function updateRecordsAndDrawChart() {
    obter7RegistrosDoBanco().then((registros) => {
        // Adicionando os novos registros à lista
        lastSevenRecords.push(...registros);

        // Mantendo apenas os últimos 7 registros na lista
        if (lastSevenRecords.length > 7) {
            lastSevenRecords = lastSevenRecords.slice(-7);
        }

        // Desenhar o gráfico com os últimos 7 registros
        drawAllCharts(lastSevenRecords);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Chamando a função inicialmente
    updateRecordsAndDrawChart();

    // Chamando a função repetidamente a cada 5 segundos
    setInterval(updateRecordsAndDrawChart, 5000);
});


// Adicionando evento quando o conteúdo do documento estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    // Obtendo o parâmetro 'id' da URL
    const idComputador = getQueryParam('id');
    console.log("ID do Computador:", idComputador);
});

document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
        obter7RegistrosDoBanco().then((registros) => {
            console.log(registros)
        });
    }, 5000); 
});



// Função para logout
function logout() {
    // Limpando a sessão
    sessionStorage.clear();
    // Redirecionando para a página de login após 1 segundo
    setTimeout(function() {
        window.location.href = "../../index.html";
    }, 1000);
}
