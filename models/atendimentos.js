const moment = require('moment');
const conexao = require('../infraestrutura/conexao')

class Atendimentos {

    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');

        const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
        const nomeEhValido = atendimento.cliente.length >= 3

        const validacoes = [
            {
                nome: 'data',
                valido: dataEhValida,
                mensagem: 'Data dever maior ou igual a data atual, no formato 00/00/0000'
            },
            {
                nome: 'cliente',
                valido: nomeEhValido,
                mensagem: 'Nome dve conter 3 ou mais letras'
            }
        ];

        const erros = validacoes.filter(campo => !campo.valido);
        const existemErros = erros.length;

        if (existemErros) return res.status(400).json(erros);

        const atendimentoDatado = {...atendimento, data, dataCriacao}
        const sql = `INSERT INTO Atendimentos SET ? `;

        conexao.query(sql, atendimentoDatado, (erro, resultado) => {
            if (erro) return res.status(400).json(erro);
            res.status(201).json(atendimento);
            
        })
    }

    lista (res) {
        const sql = `SELECT * FROM Atendimentos`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) return res.status(400).json(erro);
            res.status(200).json(resultados);
        });
    }

    buscaPorId (id,res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;
        conexao.query(sql, (erro, resultado) => {
            const atendimento = resultado[0];
            if (erro) return res.status(400).json(erro);

            res.status(200).json(atendimento);
        });
    }

    altera (id, valores, res) {
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        }
        const sql = `UPDATE Atendimentos SET ? WHERE id=?`;

        conexao.query(sql,[valores, id] ,(erro, resultado) => {
            if (erro) return res.status(400).json(erro);

            res.status(200).json({id});
        });
    }

    deleta (id, res) {
        const sql = `DELETE FROM Atendimentos WHERE id=?`;

        conexao.query(sql, id,(erro, resultado) => {
            if(erro) return res.status(400).json(erro);

            res.status(200).json({id});
        });
    }
}

module.exports = new Atendimentos;