require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
    region: 'us-east-2', 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Instanciar o DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Como o dynamo não possui autoincrement, é consultado o ID a ser usado em uma tabela secundária
const proximoID = async () => {
    const params = {
        TableName: 'servless-challenge-controle-ids'
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        return data.Items[0].proximoID;
    } catch (error) {
        console.error('Erro ao consultar ID');
    }
};

// Como o dynamo não possui autoincrement, é atualizado o ID a ser usado na tabela secundária
const novoProximoID = async (idAntigo) => {
    const params = {
        TableName: 'servless-challenge-controle-ids',
        Key: { 'id': '1' },
        UpdateExpression: 'SET proximoID = :newID',
        ExpressionAttributeValues: {
            ':newID': parseInt(idAntigo) + 1
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const data = await dynamoDB.update(params).promise();
        console.log("data: ", data)
    } catch (error) {
        console.error('Erro ao atualizar ID');
    }
};

// Função para adicionar um funcionário no DynamoDB
module.exports.criarFuncionario = async (req) => {

    if(!req.idade) { return { "message": "Campo idade é obrigatório" } }
    if(!req.nome) { return { "message": "Campo nome é obrigatório" } }
    if(!req.cargo) { return { "message": "Campo cargo é obrigatório" } }

    let id = String(await proximoID());
    console.log("ID: ", id)
    const params = {
        TableName: 'servless-challenge-funcionarios',
        Item: {
            'id': id,
            'idade': req.idade,
            'nome': req.nome,
            'cargo': req.cargo
        }
    };

    try {
        const data = await dynamoDB.put(params).promise();
        console.log('Funcionário inserido com sucesso:');
    } catch (error) {
        console.error('Erro ao inserir funcionário');
    }

    try {
        const data = novoProximoID(id);
        console.log('Próximo ID atualizado com sucesso:', data);
    } catch (error) {
        console.error('Erro ao atualizar ID');
    }

    return {
        "message": "Funcionário inserido com sucesso"
    }
};

module.exports.removerFuncionario = async (req) => {
    if(!req.id) { return { "message": "Campo ID é obrigatório" } }

    const params = {
        TableName: 'servless-challenge-funcionarios',
        Key: { 'id': String(req.id) }
    };

    try {
        const data = await dynamoDB.delete(params).promise();
        console.log('Funcionário removido com sucesso');
        return {
            "message": "Funcionário removido com sucesso"
        }
    } catch (error) {
        console.error('Erro ao remover funcionário');
        return {
            "message": "Erro ao remover funcionário"
        }
    }
};

module.exports.alterarFuncionario = async (req) => {
    if(!req.id) { return { "message": "Campo ID é obrigatório" } }
    if(!req.nome && !req.idade && !req.cargo) { return { "message": "Pelo menos um campo nome, idade ou cargo é obrigatório" } }

    const params = {
        TableName: 'servless-challenge-funcionarios',
        Key: { ['id']: String(req.id) },
        ConditionExpression: `attribute_exists(id)`,
        UpdateExpression: 'SET',
        ExpressionAttributeValues: {},
        ReturnValues: 'UPDATED_NEW'
    };

    if(req.nome) { 
        params.UpdateExpression += (params.UpdateExpression.length == 3 ? '' : ',') + " nome = :nome";
        params.ExpressionAttributeValues[":nome"] = req.nome;
    }
    if(req.cargo) { 
        params.UpdateExpression += (params.UpdateExpression.length == 3 ? '' : ',') + " cargo = :cargo";
        params.ExpressionAttributeValues[":cargo"] = req.cargo; 
    }
    if(req.idade) { 
        params.UpdateExpression += (params.UpdateExpression.length == 3 ? '' : ',') + " idade = :idade";
        params.ExpressionAttributeValues[":idade"] = req.idade;
    }

    console.log("params:",params)

    try {
        const data = await dynamoDB.update(params).promise();
        console.log('Funcionário alterado com sucesso');
        return {
            "message": "Funcionário alterado com sucesso"
        }
    } catch (error) {
        console.error('Erro ao alterar funcionário');
        return {
            "message": "Erro ao alterar funcionário"
        }
    }
};

// Como o dynamo não possui autoincrement, é consultado o ID a ser usado em uma tabela secundária
module.exports.consultarFuncionario = async (req) => {
    const params = {
        TableName: 'servless-challenge-funcionarios'
    };

    try {
        let data;
        if(!req.id) {
            data = await dynamoDB.scan(params).promise();
            return data.Items;
        } else {
            params.Key = { 'id': String(req.id) }
            data = await dynamoDB.get(params).promise();
            return data;
        }
    } catch (error) {
        console.error('Erro ao consultar ID');
    }
};