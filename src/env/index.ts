import {config} from 'dotenv'
import { z } from 'zod'

// O vitest automaticamente define a variavel de ambiente chamda NODE_ENV como 'test' quando executamos testes, assim 
// criamos um banco de dados apenas para o ambiente de teste
if(process.env.NODE_ENV === 'test') {
    config({path: '.env.test'})
} else {
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'prod']).default('prod'),
    DATABASE_CLIENTE: z.enum(['sqlite', 'pg']),
    DATABASE_URL: z.string(),
    //  converte para numero
    PORT: z.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env) 

if(_env.success === false) {
    //Mostra qual variavel está com erro
    console.error("=( Invalid environment variable", _env.error.format())

    throw new Error("Invalid environment variable")
}

export const env = _env.data;
