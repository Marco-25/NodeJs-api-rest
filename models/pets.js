const conexao = require('../infraestrutura/database/conexao');
const uploadDeArquivos = require('../infraestrutura/arquivos/uploadDeArquivos');

class Pet {
    adiciona(pet,res) {
        const sql = `INSERT INTO Pets SET ?`;

        uploadDeArquivos(pet.imagem, pet.nome, (erro ,novoCaminho) => {
            if (erro)return  res.status(400).json({erro});
           const novoPet = { nome: pet.nome, imagem: novoCaminho }
           
            conexao.query(sql, novoPet, erro => {
                if(erro) return res.status(400).json(erro);
                res.status(200).json(novoPet);
            })
        });
        
    }
}

module.exports = new Pet;