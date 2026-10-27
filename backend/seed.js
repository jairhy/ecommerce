// ============================================================
// seed.js — popula o banco com categorias e peças de exemplo
// Rode DEPOIS do `node sync.js` (que cria as tabelas vazias):
//
//     node sync.js
//     node seed.js
//
// Isso cadastra as mesmas peças que aparecem no catálogo local
// (mock) do frontend, só que agora de verdade no banco — com
// IDs reais, então o carrinho e o checkout funcionam ponta a
// ponta sem o erro "Produto X não encontrado".
// ============================================================

const conn = require('./db/conn')
require('./models/rel')
const Categoria = require('./models/Categoria')
const Produto = require('./models/Produto')
const Estoque = require('./models/Estoque')

const categorias = [
    { nome: 'Placas de Vídeo', descricao: 'GPUs para jogos e produtividade' },
    { nome: 'Processadores', descricao: 'CPUs Intel e AMD' },
    { nome: 'Placas-mãe', descricao: 'Placas-mãe para diversos sockets' },
    { nome: 'Memória RAM', descricao: 'Módulos DDR4 e DDR5' },
    { nome: 'Armazenamento', descricao: 'SSDs e HDs' },
    { nome: 'Fontes', descricao: 'Fontes de alimentação ATX' },
    { nome: 'Gabinetes', descricao: 'Gabinetes Mid Tower e Full Tower' },
    { nome: 'Coolers', descricao: 'Coolers a ar e water coolers' },
]

// quantidade de peças que cada produto entra no estoque inicial
const produtosPorCategoria = {
    'Placas de Vídeo': [
        { nome: 'GeForce RTX 4060 8GB', marca: 'NVIDIA / Asus', preco: 2199.90, imagem: '/img/produtos/rtx-4060.jpg', descricao: 'Placa de vídeo 8GB GDDR6, ideal para 1080p/1440p com DLSS 3.', estoque: 12 },
        { nome: 'GeForce RTX 4070 Ti 12GB', marca: 'NVIDIA / MSI', preco: 4599.90, imagem: '/img/produtos/rtx-4070ti.jpg', descricao: 'Placa de vídeo 12GB GDDR6X para 1440p/4K com ray tracing.', estoque: 6 },
        { nome: 'GeForce RTX 4090 24GB', marca: 'NVIDIA / Gigabyte', preco: 12999.90, imagem: '/img/produtos/rtx-4090.jpg', descricao: 'A GPU mais potente da linha, 24GB GDDR6X, referência em 4K.', estoque: 2 },
        { nome: 'Radeon RX 7600 8GB', marca: 'AMD / Sapphire', preco: 1899.90, imagem: '/img/produtos/rx-7600.jpg', descricao: 'Placa de vídeo 8GB GDDR6 com ótimo custo-benefício em Full HD.', estoque: 8 },
        { nome: 'Radeon RX 7900 XTX 24GB', marca: 'AMD / XFX', preco: 6499.90, imagem: '/img/produtos/rx-7900xtx.jpg', descricao: 'Topo de linha AMD, 24GB GDDR6, excelente para 4K.', estoque: 3 },
    ],
    'Processadores': [
        { nome: 'Core i5-13400F', marca: 'Intel', preco: 1349.90, imagem: '/img/produtos/i5-13400f.jpg', descricao: 'Processador 10 núcleos / 16 threads, ótimo para jogos e produtividade.', estoque: 20 },
        { nome: 'Core i7-13700K', marca: 'Intel', preco: 2799.90, imagem: '/img/produtos/i7-13700k.jpg', descricao: 'Processador 16 núcleos / 24 threads, desbloqueado para overclock.', estoque: 10 },
        { nome: 'Core i9-14900K', marca: 'Intel', preco: 4299.90, imagem: '/img/produtos/i9-14900k.jpg', descricao: 'Topo de linha Intel, 24 núcleos / 32 threads, alto clock.', estoque: 5 },
        { nome: 'Ryzen 5 7600', marca: 'AMD', preco: 1499.90, imagem: '/img/produtos/ryzen-5-7600.jpg', descricao: 'Processador 6 núcleos / 12 threads, arquitetura Zen 4, socket AM5.', estoque: 15 },
        { nome: 'Ryzen 7 7800X3D', marca: 'AMD', preco: 2999.90, imagem: '/img/produtos/ryzen-7-7800x3d.jpg', descricao: 'Cache 3D V-Cache, um dos melhores processadores para jogos.', estoque: 7 },
    ],
    'Placas-mãe': [
        { nome: 'ROG Strix B650-E Gaming', marca: 'ASUS', preco: 2199.90, imagem: '/img/produtos/asus-b650e.jpg', descricao: 'Placa-mãe socket AM5, Wi-Fi 6E, PCIe 5.0, DDR5.', estoque: 8 },
        { nome: 'B760M Gaming X', marca: 'Gigabyte', preco: 899.90, imagem: '/img/produtos/gigabyte-b760m.jpg', descricao: 'Placa-mãe socket LGA1700, suporte DDR5, M.2 NVMe.', estoque: 12 },
        { nome: 'PRO Z790-A WiFi', marca: 'MSI', preco: 1799.90, imagem: '/img/produtos/msi-z790a.jpg', descricao: 'Placa-mãe socket LGA1700, Wi-Fi integrado, ótima para i7/i9.', estoque: 6 },
    ],
    'Memória RAM': [
        { nome: 'Fury Beast 16GB DDR4 3200MHz', marca: 'Kingston', preco: 249.90, imagem: '/img/produtos/kingston-fury-16gb.jpg', descricao: 'Pente único 16GB DDR4 3200MHz, dissipador em alumínio.', estoque: 40 },
        { nome: 'Vengeance 32GB (2x16GB) DDR5 6000MHz', marca: 'Corsair', preco: 899.90, imagem: '/img/produtos/corsair-vengeance-32gb.jpg', descricao: 'Kit dual channel 32GB DDR5 6000MHz, alta performance.', estoque: 18 },
        { nome: 'Trident Z5 32GB (2x16GB) DDR5 6400MHz', marca: 'G.Skill', preco: 1099.90, imagem: '/img/produtos/gskill-tridentz5-32gb.jpg', descricao: 'Kit premium DDR5 com iluminação RGB e alto desempenho.', estoque: 10 },
    ],
    'Armazenamento': [
        { nome: 'SSD 970 EVO Plus NVMe 1TB', marca: 'Samsung', preco: 549.90, imagem: '/img/produtos/samsung-970evo-1tb.jpg', descricao: 'SSD M.2 NVMe PCIe 3.0, leitura até 3500MB/s.', estoque: 25 },
        { nome: 'SSD Black SN850X NVMe 2TB', marca: 'WD', preco: 1099.90, imagem: '/img/produtos/wd-sn850x-2tb.jpg', descricao: 'SSD M.2 NVMe PCIe 4.0, leitura até 7300MB/s, alta performance.', estoque: 14 },
        { nome: 'HD Barracuda 2TB', marca: 'Seagate', preco: 379.90, imagem: '/img/produtos/seagate-barracuda-2tb.jpg', descricao: 'HD SATA 3.5", 7200RPM, ideal para armazenamento em massa.', estoque: 30 },
    ],
    'Fontes': [
        { nome: 'RM750x 750W 80 Plus Gold', marca: 'Corsair', preco: 899.90, imagem: '/img/produtos/corsair-rm750x.jpg', descricao: 'Fonte ATX 750W totalmente modular, certificação Gold.', estoque: 12 },
        { nome: '600 BQ 600W 80 Plus Bronze', marca: 'EVGA', preco: 399.90, imagem: '/img/produtos/evga-600bq.jpg', descricao: 'Fonte ATX 600W semi-modular, certificação Bronze.', estoque: 18 },
    ],
    'Gabinetes': [
        { nome: 'H510 Flow', marca: 'NZXT', preco: 549.90, imagem: '/img/produtos/nzxt-h510.jpg', descricao: 'Gabinete Mid Tower com boa ventilação e design minimalista.', estoque: 14 },
        { nome: 'MasterBox TD500 Mesh', marca: 'Cooler Master', preco: 649.90, imagem: '/img/produtos/coolermaster-td500.jpg', descricao: 'Gabinete com frontal em malha, 3 fans ARGB inclusos.', estoque: 9 },
    ],
    'Coolers': [
        { nome: 'Hyper 212 Black Edition', marca: 'Cooler Master', preco: 229.90, imagem: '/img/produtos/coolermaster-hyper212.jpg', descricao: 'Cooler a ar, o mais popular do mercado, ótimo custo-benefício.', estoque: 22 },
        { nome: 'Kraken 240 RGB', marca: 'NZXT', preco: 899.90, imagem: '/img/produtos/nzxt-kraken240.jpg', descricao: 'Water cooler AIO 240mm com tela LCD e iluminação RGB.', estoque: 9 },
        { nome: 'NH-D15', marca: 'Noctua', preco: 799.90, imagem: '/img/produtos/noctua-nhd15.jpg', descricao: 'Cooler a ar duplo-torre, referência em silêncio e performance.', estoque: 11 },
    ],
}

async function seed() {
    try {
        for (const cat of categorias) {
            const [categoriaCriada] = await Categoria.findOrCreate({
                where: { nome: cat.nome },
                defaults: cat
            })

            const produtos = produtosPorCategoria[cat.nome] || []

            for (const p of produtos) {
                const [produtoCriado, criado] = await Produto.findOrCreate({
                    where: { nome: p.nome },
                    defaults: {
                        descricao: p.descricao,
                        marca: p.marca,
                        preco: p.preco,
                        imagem: p.imagem,
                        idCategoria: categoriaCriada.codCategoria
                    }
                })

                if (criado) {
                    await Estoque.create({
                        idProduto: produtoCriado.codProduto,
                        quantidade: p.estoque,
                        quantidadeMinima: 5
                    })
                }
            }
        }

        console.log('Seed concluído: categorias e peças cadastradas com sucesso!')
    } catch (err) {
        console.error('Erro ao rodar o seed', err)
    } finally {
        await conn.close()
    }
}

seed()
