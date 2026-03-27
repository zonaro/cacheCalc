if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js')
        .then(serviceWorker => {
            console.log('Service Worker registered: ' + serviceWorker);
        })
        .catch(error => {
            console.log('Error registering the Service Worker: ' + error);
        });
}

Array.prototype.uniqueMerge = function (a) {
    for (var nonDuplicates = [], i = 0, l = a.length; i < l; ++i) {
        if (this.indexOf(a[i]) === -1) {
            nonDuplicates.push(a[i]);
        }
    }
    return this.concat(nonDuplicates)
};

function getPercent(total, percent) {
    total = total || 0;
    percent = percent || 100;
    return parseFloat(percent) * parseFloat(total) / 100.00;
}

function calcularFatia(array, percent, total) {
    let totalADividir = getPercent(total, percent);
    let fatia = array.map(function (p) {
        return { nome: p, valor: (totalADividir / parseFloat(array.length)) };
    });
    return fatia
}

function calcularCache(total, arrayProducao, arrayComercial, arrayArtista, arrayProdutor, porcentagemBeatfellas, porcentagemProducao, porcentagemComercial, porcentagemArtista, porcentagemProdutor) {
    let separado = {
        producao: calcularFatia(arrayProducao, porcentagemProducao, total),
        comercial: calcularFatia(arrayComercial, porcentagemComercial, total),
        artista: calcularFatia(arrayArtista, porcentagemArtista, total),
        produtor: calcularFatia(arrayProdutor, porcentagemProdutor, total)
    }

    let everyone = arrayProducao.uniqueMerge(arrayComercial).uniqueMerge(arrayArtista);

    separado.totais = everyone.map(function (pessoa) {
        let totalizador = function (element) {
            if (element.nome.toLowerCase() == pessoa.toLowerCase()) {
                return parseFloat(element.valor);
            }
            return 0.0;
        }
        let redutor = function (a, b) { return a + b; }
        return {
            nome: pessoa,
            valor: (separado.producao.map(totalizador).reduce(redutor, 0) + separado.comercial.map(totalizador).reduce(redutor, 0) + separado.artista.map(totalizador).reduce(redutor, 0) + separado.produtor.map(totalizador).reduce(redutor, 0)).toFixed(2)
        }

    });

    separado.totais.push({ nome: "BeatFellas", valor: getPercent(total, porcentagemBeatfellas).toFixed(2) });

    return separado;
}

let distributionChart = null;

function renderDistributionChart(totais) {
    if (typeof Chart === 'undefined') {
        return;
    }

    const canvas = document.getElementById('distributionPieChart');
    if (!canvas) {
        return;
    }

    const labels = (totais || []).map(function (item) { return item.nome; });
    const data = (totais || []).map(function (item) { return parseFloat(item.valor) || 0; });

    const chartPalette = [
        '#0090e7', '#00d25b', '#ffab00', '#fc424a', '#0dcaf0', '#9a55ff',
        '#da8cff', '#20c997', '#f96f5d', '#7bdcb5', '#f4d35e', '#7ea8ff'
    ];

    if (distributionChart) {
        distributionChart.destroy();
        distributionChart = null;
    }

    // Trava altura do canvas para evitar crescimento acumulado em resize/refresh
    canvas.style.height = '260px';
    canvas.style.maxHeight = '260px';
    canvas.style.minHeight = '260px';
    canvas.style.width = '100%';

    distributionChart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: labels.map(function (_, index) {
                    return chartPalette[index % chartPalette.length];
                }),
                borderWidth: 1,
                borderColor: 'rgba(25, 28, 36, 0.9)'
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a9a9b0',
                        boxWidth: 12,
                        boxHeight: 12,
                        padding: 14,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw || 0;
                            return context.label + ': R$ ' + Number(value).toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

function clearDistributionChart() {
    if (distributionChart) {
        distributionChart.destroy();
        distributionChart = null;
    }
}



// Array com todas as pessoas disponíveis na aplicação
const pessoasDisponiveis = [
    'Caxa',
    'Kaizonaro',
    'Mautari',
    'Tucca',
    'Sara Rios',
    'Manga',
    'Garfu',
    'Penna'
];

$(document).ready(function () {
    // Preenche todos os selects com as pessoas disponíveis
    pessoasDisponiveis.forEach(function (pessoa) {
        const option = $('<option></option>').attr('value', pessoa).text(pessoa);
        $("select").append(option);
    });

    // Inicializa o Select2 com as opções
    $("select").select2({
        tags: true,
        width: '100%',
        placeholder: 'Selecione ou adicione...',
        language: {
            noResults: function () { return 'Nenhum resultado'; },
            searching: function () { return 'Buscando...'; },
            inputTooShort: function () { return 'Continue digitando...'; }
        }
    });

    // Define as seleções padrão para cada select
    $('#comercial').val(['Mautari']).trigger('change');
    $('#produtores').val(['Mautari']).trigger('change');
    $('#producao').val(['Mautari', 'Kaizonaro']).trigger('change');
    $('#artista').val(['Caxa', 'Kaizonaro', 'Mautari']).trigger('change');
});

$("form").submit(function (e) {

    e.preventDefault();

    let prods = $("#producao").val();
    let arts = $("#artista").val();
    let com = $("#comercial").val();
    let pd = $("#produtores").val();
    let cache = parseFloat($("#cacheTotal").val());
    let beatfellas = parseFloat($("#porcentagemBeatfellas").val());
    let por_art = parseFloat($("#porcentagemArtista").val());
    let por_prod = parseFloat($("#porcentagemProducao").val());
    let por_com = parseFloat($("#porcentagemComercial").val());
    let por_pd = parseFloat($("#porcentagemProdutores").val());

    $("#result").html("");
    let sum_por = (beatfellas + por_art + por_prod + por_com + por_pd)
    if (sum_por == 100) {
        $('#percent-alert').hide();

        var tt = calcularCache(cache, prods, com, arts, pd, beatfellas, por_prod, por_com, por_art, por_pd);

        console.log("Calculado", tt);

        /* Paleta de cores para os avatares */
        var palette = ['#0090e7', '#00d25b', '#ffab00', '#fc424a', '#9a55ff', '#da8cff', '#0dcaf0'];

        tt.totais.forEach(function (element) {
            var initials = element.nome
                .split(' ')
                .map(function (p) { return p[0] || ''; })
                .slice(0, 2)
                .join('')
                .toUpperCase();
            var color = palette[element.nome.charCodeAt(0) % palette.length];

            $("#result").append(
                '<tr>' +
                '<td><div class="table-name-badge">' +
                '<span class="avatar-circle" style="background:' + color + ';">' + initials + '</span>' +
                element.nome +
                '</div></td>' +
                '<td class="value-cell">R$ ' + element.valor + '</td>' +
                '</tr>'
            );
        });

        renderDistributionChart(tt.totais);

    } else {
        $('#percent-sum').text(sum_por.toFixed(1));
        $('#percent-alert').show();
        clearDistributionChart();
        console.warn('Porcentagens mal distribuídas', sum_por);
    }

});

$(":input").on('change', function () {
    $('form').submit();
});

function downloadCSVFile(csv, filename) {
    var csv_file, download_link;
    csv = "sep=,\n" + (csv || "");
    csv_file = new Blob([csv], { type: "text/csv" });

    download_link = document.createElement("a");

    download_link.download = filename;

    download_link.href = window.URL.createObjectURL(csv_file);

    download_link.style.display = "none";

    document.body.appendChild(download_link);

    download_link.click();
}

function htmlToCSV(filename) {
    filename = filename || $("#nome_show").val() || 'Cachê do Show'
    var data = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }

        data.push(row.join(","));
    }

    downloadCSVFile(data.join("\n"), filename);
}