const { spec, request } = require('pactum');

const { notNull } = require('pactum-matchers');
    
request.setBaseUrl('http://192.168.205.91:1337');

describe('Testando as requisições do tipo GET' , () =>
    {
        it('Devo retornar o status code 200', async() => 
        {
            await spec()
                .get('/api/tarefas')
                .expectStatus(200)
        })

        it('Deve listar todas as tarefas', async() => 
        {
            await spec()
                .get('/api/tarefas')
                .expectStatus(200)
                .expectJsonMatch(
                    {
                        "data": notNull()
                    });
        })

        it('Deve retornar uma tarefa pelo ID', async() => 
        {
            await spec()
                .get('/api/tarefas/{id}')
                .withPathParams('id', 2)
                .expectStatus(200)
                .expectJsonMatch(
                    {
                        "data": notNull()
                    });
        })
    })

    describe('Testando as requisições do tipo POST', () =>
    {
        const taskDescription = 'Criar o BD do PI';
        it('Devo retornar o status code 200 - Cria uma nova tarefa e verifica se ela existe', async() => 
        {
            const id = await spec()
                .post('/api/tarefas')
                .withJson(
                    {
                        'data':
                        { 
                            'nome': taskDescription
                        }
                    }
                )
                .expectStatus(200)
                .returns('data.id')
    
                await spec()
                .get('/api/tarefas/{id}')
                .withPathParams('id', id)
                .expectStatus(200)
                .expectJson('data.attributes.nome', taskDescription);
        })
     
    })

    describe('Testando requisição do tipo DELETE', () =>
    {
        const taskDescription = 'Criar o BD do PI';
        it('Devo retornar o status code 200 - Cria uma nova tarefa e a excluí', async() => 
        {
            const id = await spec()
                .post('/api/tarefas')
                .withJson(
                    {
                        'data':
                        { 
                            'nome': taskDescription
                        }
                    }
                )
                .expectStatus(200)
                .returns('data.id')
    
                await spec()
                .delete('/api/tarefas/{id}')
                .withPathParams('id', id)
                .expectStatus(200)
                .expectJson('data.attributes.nome', taskDescription);
        })
     
    })

    describe('Testando requisição do tipo PUT', () =>
    {
        const taskDescription = 'Nova tarefa';
        const taskDescriptionUpdate = 'Nova tarefa atualizada';
        it('Devo retornar o status code 200 - Cria uma nova tarefa e a atualiza', async() => 
        {
            const id = await spec()
                .post('/api/tarefas')
                .withJson(
                    {
                        'data':
                        { 
                            'nome': taskDescription
                        }
                    }
                )
                .expectStatus(200)
                .returns('data.id')
                await spec()
                .put('/api/tarefas/{id}')
                .withPathParams('id', id)
                .withJson(
                    {
                        'data':
                        { 
                            'nome': taskDescriptionUpdate
                        }
                    }
                )
                .expectStatus(200)
                .returns('data.id')
    
                await spec()
                .get('/api/tarefas/{id}')
                .withPathParams('id', id)
                .expectStatus(200)
                .expectJson('data.attributes.nome', taskDescriptionUpdate);
        })
     
    })