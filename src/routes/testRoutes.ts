import { randomUUID } from "node:crypto";
import { _knex } from "../database";
import { FastifyInstance } from "fastify";

export async function testRoutes(app: FastifyInstance) {
	app.post("/teste", async () => {
		const transaction = await _knex("tb_transactions")
			.insert({
				id: randomUUID(),
				title: "Transação de teste",
				amount: 1000,
			})
			.returning("*");

		return transaction;
	});

	app.get("/teste", async () => {
		const transaction = await _knex("tb_transactions").select("*");

		return transaction;
	});

	app.get("/teste2", async () => {
		const transaction = await _knex("tb_transactions")
			.where("amount", 1500)
			.select("*");

		return transaction;
	});
}
