import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export async function transactionsRoutes(app: FastifyInstance) {

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