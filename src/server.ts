import fastify from "fastify";
import { knex } from "./database";
import { randomUUID } from "crypto";
import { env } from "./env";
import { testRoutes } from "./routes/testRoutes";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify(); //Base da aplicação

// GET, POST, PUT, PATCH, DELETE

// app.post
// app.get
// app.put
// app.patch
// app.delete

// Importamos as rotas de outro arquivo
app.register(testRoutes)

app.register(transactionsRoutes, {
    prefix: 'transactions'
})

app.listen({
    port: env.PORT
}).then(() => {
    console.log("Server up and running")
    console.log("http://localhost:3333")
});