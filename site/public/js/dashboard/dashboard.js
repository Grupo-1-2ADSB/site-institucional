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

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

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
        title: `Desempenho do Sistema (CPU)`,
        legend: { position: "bottom", textStyle: { color: darkColor } },
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        animation: {
            duration: 1000,
            easing: 'out',
        },
        titleTextStyle: { color: darkColor },
        hAxis: { textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        vAxis: {
            title: 'Escala de Percentual',
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
            title: 'Escala de Percentual',
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
            title: 'Escala de Percentual',
            textStyle: { color: darkColor }, titleTextStyle: { color: darkColor },
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
        hAxis: { title: "Uso da Rede(Mbps)", titleTextStyle: { color: darkColor }, textStyle: { color: darkColor } },
        vAxis: { minValue: 0, textStyle: { color: darkColor }, titleTextStyle: { color: darkColor } },
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        vAxis: {
            title: 'Escala de Mbps',
            textStyle: { color: darkColor }, titleTextStyle: { color: darkColor },
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


function obterMaquinasDoBanco() {
    const fkUnidadeHospitalar = sessionStorage.HOSPITAL;
    return fetch(`/maquinas/obterMaquinasDoBanco/${fkUnidadeHospitalar}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao obter maquinas do banco de dados");
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Erro ao obter maquinas:", error);
        });
}

function irParaDashComGrafico1Maq() {
    obterMaquinasDoBanco().then((maquinas) => {
        if (maquinas.length > 0) {
            const primeiraMaquina = maquinas[0];
            const idComputador = primeiraMaquina.idComputador;
            window.location.href = `dashboard.html?id=${idComputador}`;
        } else {
            console.log("Nenhuma máquina encontrada.");
        }
    });
}

function obterInfoMaquina(idComputador) {
    return fetch(`/dashboard/obterInfoMaquina/${idComputador}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao obter informações da máquina no banco de dados");
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Erro ao obter informações da máquina:", error);
        });
}

function irParaDash(idComputador) {
    window.location.href = `dashboard.html?id=${idComputador}`;
}

const divTitleListMaq = document.getElementById("div_title_list_maq");
const divInfoMaq = document.getElementById("div_info_maquina");


var dataAtual = new Date();
var dia = dataAtual.getDate();
var mes = dataAtual.getMonth() + 1;
var ano = dataAtual.getFullYear();

var dataFormatada = dia + '/' + mes + '/' + ano;

document.addEventListener("DOMContentLoaded", () => {
    divTitleListMaq.innerHTML = `
            <h3 style="color: var(--dark);">Desempenho da Máquina com ID ${getQueryParam("id")} durante o dia <span style="color: var(--primary);">${dataFormatada}</span>.</h3>
        `;

    function displayMachineInfo(infoMaquinas) {
        const container = document.getElementById('div_info_maquina');
        const groupedByComputer = {};

        // Agrupa as informações por computador
        infoMaquinas.forEach(info => {
            if (!groupedByComputer[info.idComputador]) {
                groupedByComputer[info.idComputador] = {
                    ...info,
                    componentes: []
                };
            }
            groupedByComputer[info.idComputador].componentes.push(info);
        });

        // Cria os elementos HTML para cada computador
        for (const [idComputador, machineInfo] of Object.entries(groupedByComputer)) {
            const machineDiv = document.createElement('div');
            machineDiv.classList.add('machine-info');

            const machineHeader = `
                    <div style="padding-bottom: 30px;">
                        <h3>Monitore outra máquina:</h3>
                        <select name="" id="select_maquinas_${idComputador}" class="select-maquinas">
                        </select>
                    </div>
                    <div>
                        <h2>Informações da Máquina</h2>
                        <p><strong>ID:</strong> ${machineInfo.idComputador}</p>
                        <p><strong>Nome:</strong> ${machineInfo.nome}</p>
                        <p><strong>Localização:</strong> ${machineInfo.localizacao}</p>
                        <p><strong>Status:</strong> ${machineInfo.statusPC}</p>
                        <p><strong>Sistema Operacional:</strong> ${machineInfo.nomeSO} ${machineInfo.versaoSO} (${machineInfo.arquiteturaSO})</p>
                        <h2>Componentes monitorados:</h2>
                    </div>
                `;

            machineDiv.innerHTML = machineHeader;
            container.appendChild(machineDiv);

            const selectMaquinas = document.getElementById(`select_maquinas_${idComputador}`);
            selectMaquinas.addEventListener('change', (event) => {
                irParaDash(event.target.value);
            });

            // Preencher o select com máquinas
            obterMaquinasDoBanco().then((maquinas) => {
                maquinas.forEach((maquina) => {
                    if (maquina.statusPC === "ativado") {
                        const option = document.createElement('option');
                        option.value = maquina.idComputador;
                        option.textContent = maquina.nome;
                        selectMaquinas.appendChild(option);
                    }
                });
            });

            machineInfo.componentes.forEach(component => {
                const componentDiv = document.createElement('div');
                componentDiv.classList.add('component');

                const componentInfo = `
                        <h3 style="color: var(--primary);">${component.nomeHardware}</h3>
                    `;

                componentDiv.innerHTML = componentInfo;
                machineDiv.appendChild(componentDiv);
            });
        }
    }

    // Obtém as informações da máquina e exibe-as
    obterInfoMaquina(getQueryParam("id")).then((infoMaquina) => {
        console.log("Info Máquinas: " + JSON.stringify(infoMaquina));
        displayMachineInfo(infoMaquina);
    });
});
