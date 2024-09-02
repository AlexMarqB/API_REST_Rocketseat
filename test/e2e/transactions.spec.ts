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
        execSync('npm run knex migrate:latest') // Refaz as migrations com um bd totalmente zerado
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
			throw new Error("Cookies where not defined")
		}

		const listTransactionsResponse = await request(app.server)
			.get("/transactions")
			.set("Cookie", cookies);

		expect(listTransactionsResponse.status).toEqual(200);

		expect(listTransactionsResponse.body).toEqual({
			success: true,
			message: "Search was successfully!",
			transactions: expect.objectContaining([]),
		});

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: "New transaction",
                amount: 5000
            })
        ])
	});

	test("It should be able to get a specific transaction", async () => {
		const createTransactionResponse = await request(app.server)
			.post("/transactions")
			.send({
				title: "New transaction",
				amount: 5000,
				type: "credit",
			});

		const cookies = createTransactionResponse.get("Set-Cookie");

		if (!cookies) {
			throw new Error("Cookies where not defined")
		}

		const listTransactionsResponse = await request(app.server)
			.get("/transactions")
			.set("Cookie", cookies);
		
		const transactionId = listTransactionsResponse.body.transactions[0].id;

		const getEspecificTransactionResponse = await request(app.server)
		.get(`/transactions/${transactionId}`)
		.set("Cookie", cookies)
		
		expect(getEspecificTransactionResponse.status).toEqual(200)

		console.log(getEspecificTransactionResponse.body)

		expect(getEspecificTransactionResponse.body.transaction).toEqual(
			expect.objectContaining({
				title: "New transaction",
				amount: 5000
			})
		)
	});

	test("It should be able to get the summary", async () => {
		// Para nós listarmos as transações precisamos de um sessionID que só é criado após gerar uma transação
		const createTransactionResponse = await request(app.server)
			.post("/transactions")
			.send({
				title: "Credit transaction",
				amount: 5000,
				type: "credit",
			});

		const cookies = createTransactionResponse.get("Set-Cookie");

		if (!cookies) {
			throw new Error("Cookies where not defined")
		}

		await request(app.server)
			.post("/transactions")
			.set("Cookie", cookies)
			.send({
				title: "Debit transaction",
				amount: 2000,
				type: "debit",
			});

		const summaryResponse = await request(app.server)
			.get("/transactions/summary")
			.set("Cookie", cookies);

		expect(summaryResponse.status).toEqual(200);

		expect(summaryResponse.body).toEqual({
			success: true,
			message: "Request successfully!",
			summary: expect.objectContaining({
				amount: 3000
			}),
		});
	});
});
