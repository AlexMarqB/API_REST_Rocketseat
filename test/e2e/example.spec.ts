import { expect, test } from 'vitest'

//3 variaveis importantes
// Enunciado: qual teste será feito

test('O usuário consegue criar uma nova transação', () => {
    // O que será feito no teste: Faremos uma chamada HTTP
    
    const responseStatusCode = 201

    // Validação: O retorno da chamada foi com status 200 
    expect(responseStatusCode).toEqual(201)
})