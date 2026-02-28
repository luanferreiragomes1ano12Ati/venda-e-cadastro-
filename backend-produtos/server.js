const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

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
        if (err) {
            console.error('Erro no SELECT:', err);
            return res.status(500).json({ erro: "Erro ao buscar produtos" });
        }
        res.status(200).json(results);
    });
});

app.post('/produtos', (req, res) => {
    const { nome, categoria, preco, descricao } = req.body;

    if (!nome || !categoria || !preco) {
        return res.status(400).json({ erro: "Todos os campos (nome, categoria, preco) sao obrigatorios!" });
    }

    const sql = 'INSERT INTO products_luan (nome, categoria, preco, descricao) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [nome, categoria, preco, descricao], (err, result) => {
        if (err) {
            console.error('Erro no INSERT:', err);
            return res.status(500).json({ erro: "Erro ao salvar no banco", detalhes: err.message });
        }
        res.status(201).json({ 
            mensagem: "Produto salvo no MySQL!", 
            id: result.insertId 
        });
    });
});

app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products_luan WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro no DELETE:', err);
            return res.status(500).json({ erro: "Erro ao remover produto" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Produto nao encontrado!" });
        }

        res.status(200).json({ mensagem: `Produto com ID ${id} removido com sucesso!` });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});