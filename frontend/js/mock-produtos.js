// ============================================================
// mock-produtos.js — catálogo local de peças (fallback)
// Usado automaticamente quando a API (js/config.js -> API_URL)
// não responde ou ainda não tem produtos cadastrados.
// Assim que o backend real estiver no ar com dados, ele passa
// a ser usado no lugar deste mock automaticamente.
//
// ============================================================
// COMO TROCAR AS IMAGENS
// ============================================================
// 1. Coloque o arquivo de imagem dentro da pasta:
//        frontend/img/produtos/
//
// 2. No campo "imagem" de cada produto abaixo, troque o caminho
//    pelo nome do arquivo que você colocou. Use sempre caminho
//    ABSOLUTO a partir da raiz do site (começando com "/img/..."),
//    assim funciona tanto no index.html (raiz) quanto nas páginas
//    dentro de html/ (produtos.html, carrinho.html etc.):
//
//        imagem: '/img/produtos/rtx-4060.jpg'
//
// 3. Se preferir usar uma imagem externa (link da internet), é só
//    colar a URL completa no lugar do caminho local:
//
//        imagem: 'https://exemplo.com/imagens/rtx-4060.jpg'
//
// 4. Não precisa se preocupar em quebrar o layout se esquecer
//    alguma: o card já tem fallback automático e mostra
//    "SEM IMAGEM" enquanto o arquivo não existir.
// ============================================================

const MOCK_CATEGORIAS = [
    { codCategoria: 1, nome: 'Placas de Vídeo' },
    { codCategoria: 2, nome: 'Processadores' },
    { codCategoria: 3, nome: 'Placas-mãe' },
    { codCategoria: 4, nome: 'Memória RAM' },
    { codCategoria: 5, nome: 'Armazenamento' },
    { codCategoria: 6, nome: 'Fontes' },
    { codCategoria: 7, nome: 'Gabinetes' },
    { codCategoria: 8, nome: 'Coolers' },
]

const MOCK_PRODUTOS = [

    // ---------------------------------------------------------
    // 1. PLACAS DE VÍDEO (GPU)
    // ---------------------------------------------------------
    {
        codProduto: 1001,
        nome: 'GeForce RTX 4060 8GB',
        marca: 'NVIDIA / Asus',
        preco: 2199.90,
        imagem: '/img/produtos/rtx-4060.jpg', // TROQUE AQUI
        descricao: 'Placa de vídeo 8GB GDDR6, ideal para 1080p/1440p com DLSS 3.',
        idCategoria: 1,
        categoria: { codCategoria: 1, nome: 'Placas de Vídeo' },
        estoque: { quantidade: 12 }
    },
    {
        codProduto: 1002,
        nome: 'GeForce RTX 4070 Ti 12GB',
        marca: 'NVIDIA / MSI',
        preco: 4599.90,
        imagem: '/img/produtos/rtx-4070ti.jpg', // TROQUE AQUI
        descricao: 'Placa de vídeo 12GB GDDR6X para 1440p/4K com ray tracing.',
        idCategoria: 1,
        categoria: { codCategoria: 1, nome: 'Placas de Vídeo' },
        estoque: { quantidade: 6 }
    },
    {
        codProduto: 1003,
        nome: 'GeForce RTX 4090 24GB',
        marca: 'NVIDIA / Gigabyte',
        preco: 12999.90,
        imagem: '/img/produtos/rtx-4090.jpg', // TROQUE AQUI
        descricao: 'A GPU mais potente da linha, 24GB GDDR6X, referência em 4K.',
        idCategoria: 1,
        categoria: { codCategoria: 1, nome: 'Placas de Vídeo' },
        estoque: { quantidade: 2 }
    },
    {
        codProduto: 1004,
        nome: 'Radeon RX 7600 8GB',
        marca: 'AMD / Sapphire',
        preco: 1899.90,
        imagem: '/img/produtos/rx-7600.jpg', // TROQUE AQUI
        descricao: 'Placa de vídeo 8GB GDDR6 com ótimo custo-benefício em Full HD.',
        idCategoria: 1,
        categoria: { codCategoria: 1, nome: 'Placas de Vídeo' },
        estoque: { quantidade: 8 }
    },
    {
        codProduto: 1005,
        nome: 'Radeon RX 7900 XTX 24GB',
        marca: 'AMD / XFX',
        preco: 6499.90,
        imagem: '/img/produtos/rx-7900xtx.jpg', // TROQUE AQUI
        descricao: 'Topo de linha AMD, 24GB GDDR6, excelente para 4K.',
        idCategoria: 1,
        categoria: { codCategoria: 1, nome: 'Placas de Vídeo' },
        estoque: { quantidade: 3 }
    },

    // ---------------------------------------------------------
    // 2. PROCESSADORES (CPU)
    // ---------------------------------------------------------
    {
        codProduto: 1010,
        nome: 'Core i5-13400F',
        marca: 'Intel',
        preco: 1349.90,
        imagem: '/img/produtos/i5-13400f.jpg', // TROQUE AQUI
        descricao: 'Processador 10 núcleos / 16 threads, ótimo para jogos e produtividade.',
        idCategoria: 2,
        categoria: { codCategoria: 2, nome: 'Processadores' },
        estoque: { quantidade: 20 }
    },
    {
        codProduto: 1011,
        nome: 'Core i7-13700K',
        marca: 'Intel',
        preco: 2799.90,
        imagem: '/img/produtos/i7-13700k.jpg', // TROQUE AQUI
        descricao: 'Processador 16 núcleos / 24 threads, desbloqueado para overclock.',
        idCategoria: 2,
        categoria: { codCategoria: 2, nome: 'Processadores' },
        estoque: { quantidade: 10 }
    },
    {
        codProduto: 1012,
        nome: 'Core i9-14900K',
        marca: 'Intel',
        preco: 4299.90,
        imagem: '/img/produtos/i9-14900k.jpg', // TROQUE AQUI
        descricao: 'Topo de linha Intel, 24 núcleos / 32 threads, alto clock.',
        idCategoria: 2,
        categoria: { codCategoria: 2, nome: 'Processadores' },
        estoque: { quantidade: 5 }
    },
    {
        codProduto: 1013,
        nome: 'Ryzen 5 7600',
        marca: 'AMD',
        preco: 1499.90,
        imagem: '/img/produtos/ryzen-5-7600.jpg', // TROQUE AQUI
        descricao: 'Processador 6 núcleos / 12 threads, arquitetura Zen 4, socket AM5.',
        idCategoria: 2,
        categoria: { codCategoria: 2, nome: 'Processadores' },
        estoque: { quantidade: 15 }
    },
    {
        codProduto: 1014,
        nome: 'Ryzen 7 7800X3D',
        marca: 'AMD',
        preco: 2999.90,
        imagem: '/img/produtos/ryzen-7-7800x3d.jpg', // TROQUE AQUI
        descricao: 'Cache 3D V-Cache, um dos melhores processadores para jogos.',
        idCategoria: 2,
        categoria: { codCategoria: 2, nome: 'Processadores' },
        estoque: { quantidade: 7 }
    },

    // ---------------------------------------------------------
    // 3. PLACAS-MÃE
    // ---------------------------------------------------------
    {
        codProduto: 1020,
        nome: 'ROG Strix B650-E Gaming',
        marca: 'ASUS',
        preco: 2199.90,
        imagem: '/img/produtos/asus-b650e.jpg', // TROQUE AQUI
        descricao: 'Placa-mãe socket AM5, Wi-Fi 6E, PCIe 5.0, DDR5.',
        idCategoria: 3,
        categoria: { codCategoria: 3, nome: 'Placas-mãe' },
        estoque: { quantidade: 8 }
    },
    {
        codProduto: 1021,
        nome: 'B760M Gaming X',
        marca: 'Gigabyte',
        preco: 899.90,
        imagem: '/img/produtos/gigabyte-b760m.jpg', // TROQUE AQUI
        descricao: 'Placa-mãe socket LGA1700, suporte DDR5, M.2 NVMe.',
        idCategoria: 3,
        categoria: { codCategoria: 3, nome: 'Placas-mãe' },
        estoque: { quantidade: 12 }
    },
    {
        codProduto: 1022,
        nome: 'PRO Z790-A WiFi',
        marca: 'MSI',
        preco: 1799.90,
        imagem: '/img/produtos/msi-z790a.jpg', // TROQUE AQUI
        descricao: 'Placa-mãe socket LGA1700, Wi-Fi integrado, ótima para i7/i9.',
        idCategoria: 3,
        categoria: { codCategoria: 3, nome: 'Placas-mãe' },
        estoque: { quantidade: 6 }
    },

    // ---------------------------------------------------------
    // 4. MEMÓRIA RAM
    // ---------------------------------------------------------
    {
        codProduto: 1030,
        nome: 'Fury Beast 16GB DDR4 3200MHz',
        marca: 'Kingston',
        preco: 249.90,
        imagem: '/img/produtos/kingston-fury-16gb.jpg', // TROQUE AQUI
        descricao: 'Pente único 16GB DDR4 3200MHz, dissipador em alumínio.',
        idCategoria: 4,
        categoria: { codCategoria: 4, nome: 'Memória RAM' },
        estoque: { quantidade: 40 }
    },
    {
        codProduto: 1031,
        nome: 'Vengeance 32GB (2x16GB) DDR5 6000MHz',
        marca: 'Corsair',
        preco: 899.90,
        imagem: '/img/produtos/corsair-vengeance-32gb.jpg', // TROQUE AQUI
        descricao: 'Kit dual channel 32GB DDR5 6000MHz, alta performance.',
        idCategoria: 4,
        categoria: { codCategoria: 4, nome: 'Memória RAM' },
        estoque: { quantidade: 18 }
    },
    {
        codProduto: 1032,
        nome: 'Trident Z5 32GB (2x16GB) DDR5 6400MHz',
        marca: 'G.Skill',
        preco: 1099.90,
        imagem: '/img/produtos/gskill-tridentz5-32gb.jpg', // TROQUE AQUI
        descricao: 'Kit premium DDR5 com iluminação RGB e alto desempenho.',
        idCategoria: 4,
        categoria: { codCategoria: 4, nome: 'Memória RAM' },
        estoque: { quantidade: 10 }
    },

    // ---------------------------------------------------------
    // 5. ARMAZENAMENTO (SSD / HD)
    // ---------------------------------------------------------
    {
        codProduto: 1040,
        nome: 'SSD 970 EVO Plus NVMe 1TB',
        marca: 'Samsung',
        preco: 549.90,
        imagem: '/img/produtos/samsung-970evo-1tb.jpg', // TROQUE AQUI
        descricao: 'SSD M.2 NVMe PCIe 3.0, leitura até 3500MB/s.',
        idCategoria: 5,
        categoria: { codCategoria: 5, nome: 'Armazenamento' },
        estoque: { quantidade: 25 }
    },
    {
        codProduto: 1041,
        nome: 'SSD Black SN850X NVMe 2TB',
        marca: 'WD',
        preco: 1099.90,
        imagem: '/img/produtos/wd-sn850x-2tb.jpg', // TROQUE AQUI
        descricao: 'SSD M.2 NVMe PCIe 4.0, leitura até 7300MB/s, alta performance.',
        idCategoria: 5,
        categoria: { codCategoria: 5, nome: 'Armazenamento' },
        estoque: { quantidade: 14 }
    },
    {
        codProduto: 1042,
        nome: 'HD Barracuda 2TB',
        marca: 'Seagate',
        preco: 379.90,
        imagem: '/img/produtos/seagate-barracuda-2tb.jpg', // TROQUE AQUI
        descricao: 'HD SATA 3.5", 7200RPM, ideal para armazenamento em massa.',
        idCategoria: 5,
        categoria: { codCategoria: 5, nome: 'Armazenamento' },
        estoque: { quantidade: 30 }
    },

    // ---------------------------------------------------------
    // 6. FONTES (PSU)
    // ---------------------------------------------------------
    {
        codProduto: 1050,
        nome: 'RM750x 750W 80 Plus Gold',
        marca: 'Corsair',
        preco: 899.90,
        imagem: '/img/produtos/corsair-rm750x.jpg', // TROQUE AQUI
        descricao: 'Fonte ATX 750W totalmente modular, certificação Gold.',
        idCategoria: 6,
        categoria: { codCategoria: 6, nome: 'Fontes' },
        estoque: { quantidade: 12 }
    },
    {
        codProduto: 1051,
        nome: '600 BQ 600W 80 Plus Bronze',
        marca: 'EVGA',
        preco: 399.90,
        imagem: '/img/produtos/evga-600bq.jpg', // TROQUE AQUI
        descricao: 'Fonte ATX 600W semi-modular, certificação Bronze.',
        idCategoria: 6,
        categoria: { codCategoria: 6, nome: 'Fontes' },
        estoque: { quantidade: 18 }
    },

    // ---------------------------------------------------------
    // 7. GABINETES
    // ---------------------------------------------------------
    {
        codProduto: 1060,
        nome: 'H510 Flow',
        marca: 'NZXT',
        preco: 549.90,
        imagem: '/img/produtos/nzxt-h510.jpg', // TROQUE AQUI
        descricao: 'Gabinete Mid Tower com boa ventilação e design minimalista.',
        idCategoria: 7,
        categoria: { codCategoria: 7, nome: 'Gabinetes' },
        estoque: { quantidade: 14 }
    },
    {
        codProduto: 1061,
        nome: 'MasterBox TD500 Mesh',
        marca: 'Cooler Master',
        preco: 649.90,
        imagem: '/img/produtos/coolermaster-td500.jpg', // TROQUE AQUI
        descricao: 'Gabinete com frontal em malha, 3 fans ARGB inclusos.',
        idCategoria: 7,
        categoria: { codCategoria: 7, nome: 'Gabinetes' },
        estoque: { quantidade: 9 }
    },

    // ---------------------------------------------------------
    // 8. COOLERS
    // ---------------------------------------------------------
    {
        codProduto: 1070,
        nome: 'Hyper 212 Black Edition',
        marca: 'Cooler Master',
        preco: 229.90,
        imagem: '/img/produtos/coolermaster-hyper212.jpg', // TROQUE AQUI
        descricao: 'Cooler a ar, o mais popular do mercado, ótimo custo-benefício.',
        idCategoria: 8,
        categoria: { codCategoria: 8, nome: 'Coolers' },
        estoque: { quantidade: 22 }
    },
    {
        codProduto: 1071,
        nome: 'Kraken 240 RGB',
        marca: 'NZXT',
        preco: 899.90,
        imagem: '/img/produtos/nzxt-kraken240.jpg', // TROQUE AQUI
        descricao: 'Water cooler AIO 240mm com tela LCD e iluminação RGB.',
        idCategoria: 8,
        categoria: { codCategoria: 8, nome: 'Coolers' },
        estoque: { quantidade: 9 }
    },
    {
        codProduto: 1072,
        nome: 'NH-D15',
        marca: 'Noctua',
        preco: 799.90,
        imagem: '/img/produtos/noctua-nhd15.jpg', // TROQUE AQUI
        descricao: 'Cooler a ar duplo-torre, referência em silêncio e performance.',
        idCategoria: 8,
        categoria: { codCategoria: 8, nome: 'Coolers' },
        estoque: { quantidade: 11 }
    },
]
