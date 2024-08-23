import fastify from "fastify";
import { knex } from "./database";

const app = fastify(); //Base da aplicação

// GET, POST, PUT, PATCH, DELETE

// app.post
// app.get
// app.put
// app.patch
// app.delete

app.get('/hello', async () => {
    //tabela padrão do sqlite
    const test = knex('sqlite_schema').select('*')

    return test
});

app.listen({
    port: 3333
}).then(() => {
    console.log("Server up and running")
    console.log("http://localhost:3333")
});