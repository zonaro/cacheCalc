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



$(document).ready(function () {

});

$("select").select2({
    tags: true
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

        var tt = calcularCache(cache, prods, com, arts, pd, beatfellas, por_prod, por_com, por_art, por_pd);

        console.log("Calculado", tt);


        tt.totais.forEach(element => {
            $("#result").append("<tr><td>" + element.nome + "</td><td>R$ " + element.valor + "</td></tr>");
        });
    } else {
        console.warn("Porcentagens mau distribuidas", sum_por)
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