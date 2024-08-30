import { expect, test, beforeAll, afterAll, describe, beforeEach } from "vitest";
// import { app } from '../../src/server'
// A partir do momento que você importa esse app ele irá tentar subir o servidor na porta 3333
// Porém não é bom usar a mesma porta que a aplicação

//agora com o supertest e o app separado do server
import { app } from "../../src/app";
import request from "supertest";
import { execSync } from "node:child_process";

//cria uma categoria
describe("Transactions routes", () => {
	//executa algo antes de que todos os testes sejam executados
	beforeAll(async () => {
		await app.ready(); //aguarde até que todos os testes estejam prontos
	});

	afterAll(async () => {
		await app.close(); //Quando finalizar os testes finalize o app
	});

    beforeEach(async () => {
        //Executa comandos como se fosse no terminal
        execSync('npm run knex migrate:rollback --all') //Defaz todas as migrations
        execSync('npm run knex migrate:latest')
    })

	test("It should be able to create a transaction", async () => {
		const response = await request(app.server).post("/transactions").send({
			title: "New transaction",
			amount: 5000,
			type: "credit",
		});

		expect(response.status).toBe(201);

		expect(response.body).toEqual({
			success: true,
			message: "Created transaction succesfully!",
		});
	});

	test("It should be able to list all transactions", async () => {
		// Para nós listarmos as transações precisamos de um sessionID que só é criado após gerar uma transação
		const createTransactionResponse = await request(app.server)
			.post("/transactions")
			.send({
				title: "New transaction",
				amount: 5000,
				type: "credit",
			});

		const cookies = createTransactionResponse.get("Set-Cookie");

		if (!cookies) {
			expect(cookies).toBeDefined();
		}

		const response = await request(app.server)
			.get("/transactions")
			.set("Cookie", cookies!);

		expect(response.status).toEqual(200);

		expect(response.body).toEqual({
			success: true,
			message: "Search was successfully!",
			transactions: expect.objectContaining([]),
		});

        expect(response.body.transactions).toEqual([
            expect.objectContaining({
                title: "New transaction",
                amount: 5000
            })
        ])
	});
});
