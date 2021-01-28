const moment = require('moment');
const axios = require('axios');
const conexao = require('../infraestrutura//database/conexao');
const repositorio = require('../repositorios/atendimentos');

class Atendimentos {

    constructor() {
        this.dataEhValida = (data, dataCriacao) => moment(data).isSameOrAfter(dataCriacao);
        this.nomeEhValido = (tamanho) => tamanho >= 5;
        this.valida = parametros => this.validacoes.filter(campo => {
            const { nome } = campo;
            const parametro = parametro[nome];
            return !campo.valido(parametro);
        });

        this.validacoes = [
            {
                nome: 'data',
                valido: this.dataEhValida,
                mensagem: 'Data dever maior ou igual a data atual, no formato 00/00/0000'
            },
            {
                nome: 'cliente',
                valido: this.nomeEhValido,
                mensagem: 'Nome dve conter 3 ou mais letras'
            }
        ];
    }

    adiciona(atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');

        const parametros = {
            data: {data, dataCriacao},
            cliente: { tamanho: atendimento.cliente.length }
        }
        const erros = this.valida(parametros);
        const existemErros = erros.length;

        if (existemErros) return new Promise((resolve, reject) => reject(erros)) ;

        const atendimentoDatado = {...atendimento, data, dataCriacao}
        
        return repositorio.adiciona(atendimentoDatado)
            .then(resultado => {
                const id = resultado.insertId;
                return {id,...atendimento};
            });
    }

    lista () {
        return repositorio.lista();
    }

    buscaPorId (id,res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;
        conexao.query(sql, async (erros, resultado) => {
            if(resultado < 1) return  res.status(400).json('Não encontrado');
            const atendimento = resultado[0];
            const cpf = atendimento.cliente;
            if (erros) return res.status(400).json(erros);

            const { data } = await axios.get(`http://localhost:8082/${cpf}`);
            atendimento.cliente = data;
            res.status(200).json(atendimento);
        });
    }

    altera (id, valores) {
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        }
        return repositorio.altera(id, valores);
    }

    deleta (id) {
        return repositorio.deleta(id);
    }
}

module.exports = new Atendimentos;