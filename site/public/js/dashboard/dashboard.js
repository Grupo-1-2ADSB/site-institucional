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

    let allRecords = []; // Lista global para armazenar todos os registros

    google.charts.load('current', {packages: ['corechart', 'bar', 'line', 'area']});
    // google.charts.setOnLoadCallback(() => {
    //     // Atualizar os registros e desenhar os gráficos iniciais
    //     updateRecordsAndDrawChart();
    //     // Iniciar o processo de atualização contínua dos registros e dos gráficos
    //     updateChartsWithNewRecords();
    // });


    function obter7RegistrosDoBanco() {
        const fkUnidadeHospitalar = sessionStorage.HOSPITAL;
        const idComputador = getQueryParam('id'); // Certifique-se de passar o nome do parâmetro correto
    
        console.log(`Obtendo registros para Unidade Hospitalar: ${fkUnidadeHospitalar}, Computador: ${idComputador}`);
    
        return fetch(`/maquinas/obter7RegistrosDoBanco/${fkUnidadeHospitalar}/${idComputador}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao obter registros do banco de dados");
                }
                return response.json();
            })
            .then((registros) => {
                console.log("Registros recebidos do servidor:", registros);
                allRecords = registros; // Armazenar os registros recebidos na lista global
                return registros;
            })
            .catch((error) => {
                console.error("Erro ao obter registros:", error);
            });
    }
    
let uniqueRecords = [];
function fetchNewRecords() {
    return obter7RegistrosDoBanco().then((novosRegistros) => {
        console.log("Registros obtidos do servidor:", novosRegistros);

        // Iterar pelos novos registros
        novosRegistros.forEach((registro) => {
            // Verificar se o registro específico já está na lista
            const registroExistente = uniqueRecords.find(reg => reg.idRegistro === registro.idRegistro);

            // Adicionar apenas se ainda não estiver na lista
            if (!registroExistente) {
                // Se a lista já contiver 7 registros, remover o mais antigo
                if (uniqueRecords.length >= 7) {
                    uniqueRecords.shift();
                }
                uniqueRecords.push(registro);
                console.log(`Unique Records: ${uniqueRecords}`)
            }
        });

        console.log("Registros únicos:", uniqueRecords);

        // Agendar a próxima atualização após 5 segundos
        setTimeout(updateChartsWithNewRecords, 5000);
    });
}
    
    // Defina a função updateChartsWithNewRecords
    function updateChartsWithNewRecords() {
        fetchNewRecords().then(() => {
            // Atualizar os gráficos com os novos registros
            drawAllCharts(allRecords);
            // Agendar a próxima atualização após 5 segundos
            setTimeout(updateChartsWithNewRecords, 5000);
        });
    }

    updateChartsWithNewRecords();

    
// function updateRecordsAndDrawChart() {
//     obter7RegistrosDoBanco().then((registros) => {
//         const registrosCPU = registros['CPU'] || [];
//         const registrosRAM = registros['Memória RAM'] || [];
//         const registrosDisco = registros['Armazenamento'] || [];
//         const registrosRede = registros['Rede'] || [];
        
//         drawAllCharts(registrosCPU.concat(registrosRAM, registrosDisco, registrosRede));
//     });
// }

// fetchNewRecords().then((newRecords) => {
//     console.log("1 - " + newRecords)

//     if (Array.isArray(newRecords) && newRecords.length > 0) {
//         // Atualizar os gráficos com os novos registros
//         console.log("2 - " + newRecords)
//         drawAllCharts(newRecords);
//     }
//     // Agendar a próxima atualização após 5 segundos
//     setTimeout(updateChartsWithNewRecords, 5000);
// });

    function prepararDadosParaGrafico(registros, numRegistros) {
        const dadosCPU = [["Hora do dia", "Uso da CPU(%)"]];
        const dadosRAM = [["Hora do dia", "Uso da RAM(%)"]];
        const dadosDisco = [["Discos", "% usado", { role: "style" }]];
        const dadosRede = [["Medida", "Valor"]];

        const todosRegistros = registros.flatMap(registro => registro);

        // Filtrando os registros por tipo de componente e garantindo que a propriedade 'nomeHardware' esteja definida
        const registrosCPU = registros.filter(r => r && r.nomeHardware === 'CPU');
        const registrosRAM = registros.filter(r => r && r.nomeHardware === 'Memória RAM');
        const registrosDisco = registros.filter(r => r && r.nomeHardware === 'Armazenamento');
        const registrosRede = registros.filter(r => r && r.nomeHardware === 'Rede');

        // Processando os registros válidos
        registrosCPU.forEach((r) => {
            const hora = new Date(r.dataHora).toLocaleTimeString();
            dadosCPU.push([hora, r.valor]);
        });

        registrosRAM.forEach((r) => {
            const hora = new Date(r.dataHora).toLocaleTimeString();
            dadosRAM.push([hora, r.valor]);
        });

        registrosDisco.forEach((r) => {
            dadosDisco.push(["Disco", r.valor, "blue"]);
        });

        registrosRede.forEach((r) => {
            const hora = new Date(r.dataHora).toLocaleTimeString();
            dadosRede.push([hora, r.valor]);
        });

        return { dadosCPU, dadosRAM, dadosDisco, dadosRede };
    }


    function getThemeColor() {
        // Obtenha a cor da variável CSS com base no estado do checkbox
        var isDarkTheme = document.getElementById('theme-toggle').checked;
        return getComputedStyle(document.documentElement).getPropertyValue(isDarkTheme ? '--light' : '--dark');
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

    // function getLastNRecords(records, n) {
    //     if (!Array.isArray(records)) {
    //         console.error("getLastNRecords: records não é um array", records);
    //         return [];
    //     }
    //     return records.slice(Math.max(records.length - n, 0));
    // }

    // document.addEventListener("DOMContentLoaded", () => {
    //     // Atualizar os registros e desenhar os gráficos iniciais
    //     updateRecordsAndDrawChart();
    //     // Iniciar o processo de atualização contínua dos registros e dos gráficos
    // });



    // Adicionando evento quando o conteúdo do documento estiver carregado
    document.addEventListener("DOMContentLoaded", () => {
        // Obtendo o parâmetro 'id' da URL
        const idComputador = getQueryParam('id');
        console.log("ID do Computador:", idComputador);
    });

    // document.addEventListener("DOMContentLoaded", () => {
    //     setInterval(() => {
    //         obter7RegistrosDoBanco().then((registros) => {
    //             console.log(registros)
    //         });
    //     }, 5000); 
    // });



    // Função para logout
    function logout() {
        // Limpando a sessão
        sessionStorage.clear();
        // Redirecionando para a página de login após 1 segundo
        setTimeout(function() {
            window.location.href = "../../index.html";
        }, 1000);
    }
