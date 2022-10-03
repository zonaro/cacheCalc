

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
    return percent * total / 100;
}

function calcularFatia(array, percent, total) {
    let totalADividir = getPercent(total, percent);
    let fatia = array.map(function (p) {
        return { nome: p, valor: (totalADividir / array.length).toFixed(2) };
    });
    return fatia
}

function calcularCache(total, arrayProducao, arrayComercial, arrayArtista,arrayProdutor, porcentagemBeatfellas, porcentagemProducao, porcentagemComercial, porcentagemArtista,porcentagemProdutor) {
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
            valor: separado.producao.map(totalizador).reduce(redutor, 0) + separado.comercial.map(totalizador).reduce(redutor, 0) + separado.artista.map(totalizador).reduce(redutor, 0) + separado.produtor.map(totalizador).reduce(redutor, 0)
        }

    });

    separado.totais.push({ nome: "BeatFellas", valor: getPercent(total, porcentagemBeatfellas) });

    return separado;
}