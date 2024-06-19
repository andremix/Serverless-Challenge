# Serverless Challenge

Projeto com finalidade de administrar os funcionários cadastrados no sistema.

**Node**: 20.11.1
**Base de dados**: DynamoDB

**Índice**

[TOC]

## Consultar

**Método**: Post
**URL**: http://localhost:3000/consultar

Caso não for informado nenhum ID, o sistema retorna a lista completa de funcionários.

Body:
```javascript
{
}
```

Caso informe um ID, o sistema retorna os dados do funcionário:

Body:
```javascript
{
	"id": 3
}
```

## Adicionar

**Método**: Post
**URL**: http://localhost:3000/adicionar

Aqui é necessário informar os campos "nome", "idade" e "cargo". O ID do registro é gerado automaticamente.

Body:
```javascript
{
    "nome": "Nome_do_funcionrio",
    "idade": 20,
    "cargo": "Cargo_do_funcionario"
}
```

## Alterar

**Método**: Patch
**URL**: http://localhost:3000/alterar

Aqui é possível alterar o nome, cargo ou idade do funcionário. Não é necessário informar todos os campos, mas é obrigatório informar o ID e pelo menos um dos dados alterados.

Body:
```javascript
{
    "id": 3,
    "nome": "Nome_da_funcionria",
    "idade": 21,
    "cargo": "Cargo_da_funcionaria"
}
```

## Remover

**Método**: Delete
**URL**: http://localhost:3000/remover

Com este endpoint é possível remover um funcionário cadastrado informando apenas o ID do funcionário.

Body:
```javascript
{
    "id": 3
}
```

