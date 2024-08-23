import type { Knex } from "knex";

//O que essa migration vai fzr no nosso banco de dados? Vai remover? Adicionar? Atualizar?
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tb_transactions', (table) => {
        table.uuid('id').primary()
        table.text('title').notNullable()
        table.decimal('amount', 10, 2).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}

//Faz o contrario do metódo up para caso aconteça algum erro
export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('tb_transactions')
}

