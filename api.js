//requires
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');


//imports
const fun = require('./imports/functions');
const sqlConfig = require('./imports/mysql_config');

//vars para disponibilidade e versionamento
const API_AVAILABILITY = true;
const API_VERSION = '1.0.0';

//iniciando Servidor
const app = express();
app.listen(3000, () => { console.log('Executando API iniciação operante') });

//verificação de disponibilidade

app.use((req, res, next) => {
    if (API_AVAILABILITY) {
        next()
    } else {
        res.json(fun.response('Atenção', 'API OFFLINE', 0, null));
    }
})

//conexao mysql
const connect = mysql.createConnection(sqlConfig);

//cors
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
            res.json(fun.response('sucesso', 'SUCESSO DEMAIS',rows.length,rows))
        } else {
            res.json(fun.response('Erro', err.message, 0, null))
        }
    })
})
//erro de rota
app.use((req, res) => {
    res.json(fun.response('ATENÇÃO', 'ROTA NÃO ENCONTRADA', 0, null))
})
