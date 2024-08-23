import fastify from "fastify";

const app = fastify(); //Base da aplicação

// GET, POST, PUT, PATCH, DELETE

// app.post
// app.get
// app.put
// app.patch
// app.delete

app.get('/hello', () => {
    return "Hello World"
});

app.listen({
    port: 3333
}).then(() => {
    console.log("Server up and running")
    console.log("http://localhost:3333")
});