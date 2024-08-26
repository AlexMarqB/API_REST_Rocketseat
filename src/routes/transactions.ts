import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export async function transactionsRoutes(app: FastifyInstance) {

    app.get('/', async (_, rep) => {
        const transactions = await knex('tb_transactions').select()

        return rep.status(302).send({success: true, message: "Search was successfully!", transactions})
    })

    //:id => Parametro da minha rota para identificar
    app.get('/:id', async (req, rep) => {

        const createTransactionParamsSchema = z.object({
            id: z.string().uuid()
        })

        const {id} = createTransactionParamsSchema.parse(req.params)

        const transaction = await knex('tb_transactions').where('id', id).first()

        return rep.status(302).send({success: true, message: "Transaction found!", transaction})
    })

    app.post('/', async (req, rep) => {

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body);
        
        await knex('tb_transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
        })

        return rep.status(201).send({success: true, message: "Created transaction succesfully!"})
    })
}