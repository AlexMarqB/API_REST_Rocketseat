import fastify from "fastify";
import { testRoutes } from "./routes/testRoutes";
import { transactionsRoutes } from "./routes/transactions";
import { fastifyCookie } from "@fastify/cookie";

export const app = fastify(); //Base da aplicação

// GET, POST, PUT, PATCH, DELETE

// app.post
// app.get
// app.put
// app.patch
// app.delete

app.register(fastifyCookie)

app.addHook('preHandler', async (req, rep) => {
    console.log("Global hook")
})

// Importamos as rotas de outro arquivo
app.register(testRoutes)

app.register(transactionsRoutes, {
    prefix: 'transactions'
})