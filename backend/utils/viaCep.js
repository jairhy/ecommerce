const axios = require('axios')

async function buscarEnderecoPorCep(cep) {
    const cepLimpo = String(cep).replace(/\D/g, '')

    if (cepLimpo.length !== 8) {
        throw new Error('CEP inválido, deve conter 8 dígitos')
    }

    const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)

    if (data.erro) {
        throw new Error('CEP não encontrado')
    }

    return {
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf
    }
}

module.exports = buscarEnderecoPorCep
