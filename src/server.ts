import fastify from "fastify";
import { knex } from "./database";
import { randomUUID } from "crypto";
import { env } from "./env";

const app = fastify(); //Base da aplicação

// GET, POST, PUT, PATCH, DELETE

// app.post
// app.get
// app.put
// app.patch
// app.delete

app.post('/teste', async () => {
    const transaction = await knex('tb_transactions').insert({
        id: randomUUID(),
        title: "Transação de teste",
        amount: 1000,
    }).returning('*')

    return transaction;
})

app.get('/teste', async () => {
    const transaction = await knex('tb_transactions').select("*")

    return transaction;
});

app.get('/teste2', async () => {
    const transaction = await knex('tb_transactions')
    .where('amount', 1500)
    .select("*")

    return transaction;
});

app.listen({
    port: env.PORT
}).then(() => {
    console.log("Server up and running")
    console.log("http://localhost:3333")
});