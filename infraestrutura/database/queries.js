const conexao = require('./conexao');

const executaQuery = (sql, paramentros = '') => {
    return new Promise((resolve, reject) => {

        conexao.query(sql, paramentros, (erros, resultados, campos) => {
            if(erros) {
                reject(erros);
            } else {
                resolve(resultados);
            }
        });
    });
    
}

module.exports = executaQuery;