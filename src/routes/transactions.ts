import { FastifyInstance } from "fastify";
import { z } from "zod";
import { _knex } from "../database";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

// Cookies <-> Formas de manter contexto entre requisições

export async function transactionsRoutes(app: FastifyInstance) {

	app.get(
		"/",
		{
			preHandler: [checkSessionIdExists],
		},
		async (req, rep) => {
			const { sessionId } = req.cookies;

			const transactions = await _knex("tb_transactions")
				.where("session_id", sessionId)
				.select();

			return rep.status(200).send({
				success: true,
				message: "Search was successfully!",
				transactions,
			});
		}
	);

	//:id => Parametro da minha rota para identificar a transaction
	app.get(
		"/:id",
		{
			preHandler: [checkSessionIdExists],
		},
		async (req, rep) => {
			const createTransactionParamsSchema = z.object({
				id: z.string().uuid(),
			});

			const { id } = createTransactionParamsSchema.parse(req.params);

			const { sessionId } = req.cookies;

			const transaction = await _knex("tb_transactions")
				.where({ id, session_id: sessionId })
				.first();

			return rep.status(200).send({
				success: true,
				message: "Transaction found!",
				transaction,
			});
		}
	);

	app.get(
		"/summary",
		{
			preHandler: [checkSessionIdExists],
		},
		async (req, rep) => {
            const { sessionId } = req.cookies;

			const summary = await _knex("tb_transactions")
            .where('session_id', sessionId)
				.sum("amount", { as: "amount" })
				.first();

			return rep
				.status(200)
				.send({ success: true, message: "Request successfully!", summary });
		}
	);

	// Criar transação
	app.post("/", async (req, rep) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(["credit", "debit"]),
		});

		const { title, amount, type } = createTransactionBodySchema.parse(
			req.body
		);

		let sessionId = req.cookies.sessionId; //buscamos nos cookies do navegador se já existe uma session ID

		if (!sessionId) {
			sessionId = randomUUID();

			rep.cookie("sessionId", sessionId, {
				path: "/", //quais rotas do meu app podem acessar esse cookie?,
				maxAge: 60 * 60 * 24 * 7, //7 days; milisegundos: 1 seg == 1000 ms
			});
		}

		await _knex("tb_transactions").insert({
			id: randomUUID(),
			title,
			amount: type === "credit" ? amount : amount * -1,
			session_id: sessionId,
		});

		return rep
			.status(201)
			.send({ success: true, message: "Created transaction succesfully!" });
	});
}
