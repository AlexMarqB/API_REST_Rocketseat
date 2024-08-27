import { expect, test, beforeAll, afterAll } from 'vitest'
// import { app } from '../../src/server' 
// A partir do momento que você importa esse app ele irá tentar subir o servidor na porta 3333
// Porém não é bom usar a mesma porta que a aplicação

//agora com o supertest e o app separado do server
import { app } from '../../src/app'
import request from 'supertest'

//executa algo antes de que todos os testes sejam executados
beforeAll(async () => {
    await app.ready(); //aguarde até que todos os testes estejam prontos
})

afterAll(async () => {
    await app.close(); //Quando finalizar os testes finalize o app
})

test("User can create a transaction", async () => {
    const response = await request(app.server)
    .post('/transactions')
    .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
    })

    expect(response.status).toBe(201)

    expect(response.body).toEqual({
        success: true,
        message: 'Created transaction succesfully!'
    })
})