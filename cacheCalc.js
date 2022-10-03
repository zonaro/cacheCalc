

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
    return array.map(function (p) {
        return { nome: p, valor: (totalADividir / array.length).toFixed(2) };
    });
}

function calcularCache(arrayProducao, arrayComercial, arrayArtista, porcentagemBeatfellas, porcentagemProducao, porcentagemComercial, porcentagemArtista) {
    let separado = {
        beatfellas: getPercent(total, porcentagemBeatfellas),
        producao: calcularFatia(arrayProducao, porcentagemProducao, total),
        comercial: calcularFatia(arrayComercial, porcentagemComercial, total),
        artista: calcularFatia(arrayArtista, porcentagemArtista, total)
    }

    let everyone = arrayProducao.uniqueMerge(arrayComercial).uniqueMerge(arrayArtista);

    separado.totais = everyone.map(function (pessoa) {
        return {
            nome: pessoa,
            valor: separado.producao.array.forEach(element => {
                if (element.nome.toLowerCase() == pessoa.toLowerCase()) {
                    return element.valor;
                } else {
                    return 0;
                }
            }).reduce(function (a, b) { return a + b; }, 0)
        }

    });

    return separado;
}