import { app } from "./app";
import { env } from "./env";

app.listen({
    port: env.PORT
}).then(() => {
    console.log("Server up and running")
    console.log(env.PORT)
});