const fs = require('fs');
const path = require('path');

module.exports = (caminho,imagem, callBackImagemCriada) => {
    const tiposValidos = ['jpg','png','jpeg'];
    const tipo = path.extname(caminho);
    const tipoEhValido = tiposValidos.indexOf(tipo.substring(1)) !== -1;

    if(!tipoEhValido) {
        const erro = "Erro! tipo invalido.\nTipos validos PNG - JPG - JPEG";
        callBackImagemCriada(erro);
        return;
    }

    const novoCaminho = `./assets/imagens/${imagem}${tipo}`;
    fs.createReadStream(caminho)
    .pipe(fs.createWriteStream(novoCaminho))
    .on('finish', () => callBackImagemCriada(false,novoCaminho));
}

