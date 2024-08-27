import { expect, test } from 'vitest'
// import { app } from '../../src/server' 
// A partir do momento que você importa esse app ele irá tentar subir o servidor na porta 3333
// Porém não é bom usar a mesma porta que a aplicação

//agora com o supertest e o app separado do server
import { app } from '../../src/app'
import request from 'supertest'

test("User can create a transaction", async () => {
    const response = await request(app.server)
    .post('/transactions')
    .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
    })

    expect(response).toContain({success: true})
})