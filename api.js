//16/04 primeira aula criação da infraestrutura
//17/04 adição de novos endpoints

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const fun = require('./imports/functions');
const sqlConfig = require('./imports/mysql_config');

const API_AVAILABILITY = true;
const API_VERSION = '2.0.0';

const app = express();
app.listen(3000, () => { console.log('Executando API: operante') });

app.use((req, res, next) => {
    if (API_AVAILABILITY) {
        next()
    } else {
        res.json(fun.response('Atenção', 'API OFFLINE', 0, null));
    }
})

const connect = mysql.createConnection(sqlConfig);

app.use(cors());

//rotas
//rota inicial(entrada)

app.get('/', (req, res) => {
    res.json(fun.response('Sucesso ao acessar', 'API funcionando', 0, null))
})

//endpoint
//rota para o consultar
app.get('/tasks', (req, res) => {
    connect.query('SELECT * FROM tasks', (err, rows) => {
        if (!err) {
            res.json(fun.response('sucesso', 'SUCESSO DEMAIS', rows.length, rows))
        } else {
            res.json(fun.response('Erro', err.message, 0, null))
        }
    })
})
//rotas de consulta de ID
app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    connect.query(`SELECT * FROM tasks WHERE id = ?`, [id], (err, rows) => {
        if (!err) {
            if (rows.length > 0) {
                res.json(fun.response('sucesso', 'dados obtidos', rows.length, rows))
            } else {
                res.json(fun.response('Algo errado', 'dado pesquisado não consta', 0, null))
            }
        } else {
            res.json(fun.response('Erro', err.message, 0, null))
        }
    })
})
//rota de update
app.put('/tasks/:id/status/:status', (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    connect.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id], (err, rows) => {
        if (!err) {
            if (rows.affectedRows>0) {
                res.json(fun.response('sucesso', 'Status alterado', rows.length, null));
            } else {
                res.json(fun.response('Algo de errado', 'Status não pode ser alterado', 0, null));
            }
        } else {
            res.json(fun.response('Erro', err.message, 0, null))
        }
    })
})

//erro de rota
app.use((req, res) => {
    res.json(fun.response('ATENÇÃO', 'ROTA NÃO ENCONTRADA', 0, null))
})
