const express = require('express');

const app = express();

const cors = require('cors');

const mysql = require('mysql2');



app.use(express.json());

app.use(cors());



const db = mysql.createConnection({

    host: 'benserverplex.ddns.net',

    user: 'alunos',

    password: 'senhaAlunos', 

    database: 'web_03mc'

});



db.connect(err => {

    if (err) {

        console.error('Erro ao conectar ao MySQL:', err);

        return;

    }

    console.log('Conectado ao banco web_03mc e pronto para usar a tabela products_luan!');

});



app.get('/produtos', (req, res) => {

    db.query('SELECT * FROM products_luan', (err, results) => {

        if (err) return res.status(500).json(err);

        res.status(200).json(results);

    });

});



app.post('/produtos', (req, res) => {

    const { nome, categoria, preco } = req.body;

    const sql = 'INSERT INTO products_luan (nome, categoria, preco) VALUES (?, ?, ?)';

    

    db.query(sql, [nome, categoria, preco], (err, result) => {

        if (err) return res.status(500).json(err);

        res.status(201).json({ mensagem: "Produto salvo no MySQL!", id: result.insertId });

    });

});



app.delete('/produtos/:id', (req, res) => {

    const { id } = req.params;

    db.query('DELETE FROM products_luan WHERE id = ?', [id], (err) => {

        if (err) return res.status(500).json(err);

        res.status(200).json({ mensagem: "Produto removido do banco!" });

    });

});



const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Servidor rodando em http://localhost:${PORT}`);

}); 