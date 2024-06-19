const express = require("express")
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const controller = require("./controller")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Seja bem-vindo à API de Funcionários')
})

app.post('/consultar', async (req, res) => {
    let retorno = await controller.consultarFuncionario(req.body);
    res.send(retorno)
})

app.post('/adicionar', async (req, res) => {
    let retorno = await controller.criarFuncionario(req.body);
    res.send(retorno)
})

app.delete('/remover', async (req, res) => {
    let retorno = await controller.removerFuncionario(req.body);
    res.send(retorno)
})

app.patch('/alterar', async (req, res) => {
    let retorno = await controller.alterarFuncionario(req.body);
    res.send(retorno)
})

app.listen(port, () => {
    console.log(`Serviço iniciado na porta ${port}`)
})