const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        li.classList.add('active');
    });
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');
const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

let allRecords = []; 

google.charts.load('current', { packages: ['corechart', 'bar', 'line', 'area'] });

function obter7RegistrosDoBanco() {
    const fkUnidadeHospitalar = sessionStorage.HOSPITAL;
    const idComputador = getQueryParam('id'); 

    return fetch(`/maquinas/obter7RegistrosDoBanco/${fkUnidadeHospitalar}/${idComputador}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao obter registros do banco de dados");
            }
            return response.json();
        })
        .then((registros) => {
            console.log("Registros recebidos do servidor:", registros);
            allRecords = registros;
            return registros;
        })
        .catch((error) => {
            console.error("Erro ao obter registros:", error);
        });
}

let uniqueRecords = [];
function fetchNewRecords() {
    return obter7RegistrosDoBanco().then((novosRegistros) => {
        novosRegistros.forEach((registro) => {
            const registroExistente = uniqueRecords.find(reg => reg.idRegistro === registro.idRegistro);

            if (!registroExistente) {
                if (uniqueRecords.length >= 7) {
                    uniqueRecords.shift();
                }
                uniqueRecords.push(registro);
            }
        });
        setTimeout(updateChartsWithNewRecords, 5000);
    });
}

function updateChartsWithNewRecords() {
    fetchNewRecords().then(() => {
        drawAllCharts(allRecords);
        setTimeout(updateChartsWithNewRecords, 5000);
    });
}

updateChartsWithNewRecords();


function prepararDadosParaGrafico(registros, numRegistros) {
    const dadosCPU = [["Hora do dia", "Uso da CPU(%)"]];
    const dadosRAM = [["Hora do dia", "Uso da RAM(%)"]];
    const dadosDisco = [["Discos", "% usado", { role: "style" }]];
    let maxDisco = 0;
    let calculo;

    const registrosCPU = registros.filter(r => r && r.nomeHardware === 'CPU');
    const registrosRAM = registros.filter(r => r && r.nomeHardware === 'Memoria RAM');
    const registrosDisco = registros.filter(r => r && r.nomeHardware === 'Armazenamento');
    const registrosRede = registros.filter(r => r && r.nomeHardware === 'Rede');

    registrosCPU.reverse();
    registrosRAM.reverse();
    registrosDisco.reverse();
    registrosRede.reverse();

    registrosDisco.forEach(r => {
        if (r.valorHardware > maxDisco) {
            maxDisco = r.valorHardware;
        }
    });

    registrosCPU.forEach((r) => {
        const horaString = r.dataHora.slice(11, 19);
        calculo = ((r.valor / r.valorHardware) * 100);
        dadosCPU.push([horaString, calculo]);
    });

    registrosRAM.forEach((r) => {
        const horaString = r.dataHora.slice(11, 19);
        calculo = ((r.valor / r.valorHardware) * 100);
        dadosRAM.push([horaString, calculo]);
    });

    registrosDisco.forEach((r) => {
        const percentual = (r.valor / maxDisco) * 100;
        dadosDisco.push(["Disco", percentual, "blue"]);
    });

    const dadosRede = [["Hora do dia", "Valor"]]; 

    registrosRede.forEach((r) => {
        const horaString = r.dataHora.slice(11, 19);
        dadosRede.push([horaString, r.valor]);
    });

    return { dadosCPU, dadosRAM, dadosDisco, dadosRede };
}

function getThemeColor() {
    var isDarkTheme = document.getElementById('theme-toggle').checked;
    return getComputedStyle(document.documentElement).getPropertyValue(isDarkTheme ? '--light' : '--dark');
}

function drawAllCharts(registros) {
    var darkColor = getThemeColor();
    var { dadosCPU, dadosRAM, dadosDisco, dadosRede, maxCPU } = prepararDadosParaGrafico(registros, 7);

    obterQtdDisco(getQueryParam('id'));

    var optionsCPU = {
        title: "Desempenho do Sistema (CPU)",
        legend: { position: "top", textStyle: { color: darkColor } },
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        animation: {
            duration: 1000,
            easing: 'out',
        },
        titleTextStyle: { color: darkColor },
        hAxis: { title: 'Hora do dia', textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        vAxis: {
            title: 'Uso da CPU (%)',
            textStyle: { color: darkColor }, titleTextStyle: { color: darkColor },
            minValue: 0,
            maxValue: 100
        },
        chartArea: {
            width: "100%",
            height: "70%",
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
        vAxis: {
            title: 'Medidas ',
            minValue: 0,
            maxValue: 100
        },
        chartArea: {
            width: "100%",
            height: "70%",
            top: "10%",
            left: "10%",
        },
        animation: {
            duration: 1000,
            easing: 'out',
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
        hAxis: {
            title: 'Medidas ',
            minValue: 0,
            maxValue: 100
        },
        vAxis: { textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        chartArea: {
            width: "100%",
            height: "70%",
            top: "10%",
            left: "10%",
        },
        animation: {
            duration: 1000,
            easing: 'out',
        },
    };

    var optionsRede = {
        title: "Velocidade de Download da Rede",
        hAxis: { title: "Medida", titleTextStyle: { color: darkColor }, textStyle: { color: darkColor } },
        vAxis: { minValue: 0, textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        vAxis: {
            title: 'Medidas ',
            minValue: 0,
            maxValue: 100
        },
        titleTextStyle: { color: darkColor },
        chartArea: {
            width: "75%",
            height: "70%",
            top: "10%",
            left: "10%",
        },
        animation: {
            duration: 1000,
            easing: 'out',
        },
    };

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

function obterQtdDisco(idComputador) {
    return fetch(`/dashboard/obterQtdDisco/${idComputador}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao obter qtd do disco do banco de dados");
            }
            return response.json();
        })
        .then((qtdDisco) => {
            console.log("Qtd Disco: ", qtdDisco[0].quantidade_armazenamento);
            return qtdDisco;
        })
        .catch((error) => {
            console.error("Erro ao obter qtd do Disco:", error);
        });
}


// Função para logout
function logout() {
    sessionStorage.clear();
    setTimeout(function () {
        window.location.href = "../../index.html";
    }, 1000);
}
