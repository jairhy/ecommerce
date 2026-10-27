# Night Market // Peças de PC — Frontend (Cyberpunk 2077)

Frontend estático (HTML/CSS/JS puro) para o e-commerce de peças de computador, no estilo visual **Cyberpunk 2077** (preto, amarelo neon, ciano e magenta, cantos cortados, glitch text, scanlines).

Construído para consumir a API já pronta em `backend-pecas` (Node/Express/Sequelize).

## Categorias e peças sugeridas para popular o catálogo

O catálogo é 100% dinâmico (vem da API) — nenhum produto é fixo no frontend. Use o Painel Admin para cadastrar categorias e peças. Sugestão de categorias e exemplos de itens comuns em lojas de hardware:

- **Placas de Vídeo (GPU)** — ex.: NVIDIA GeForce RTX 4060, RTX 4070, AMD Radeon RX 7600
- **Processadores (CPU)** — ex.: Intel Core i5-13400F, AMD Ryzen 5 7600
- **Placas-mãe** — ex.: ASUS Prime B650, Gigabyte B760M
- **Memória RAM** — ex.: Kingston Fury 16GB DDR4, Corsair Vengeance 32GB DDR5
- **Armazenamento (SSD/HD)** — ex.: SSD NVMe 1TB, HD 2TB SATA
- **Fontes (PSU)** — ex.: Corsair 650W 80 Plus Bronze
- **Gabinetes** — ex.: Gabinete Mid Tower com vidro temperado
- **Coolers e Water Coolers** — ex.: Cooler Master Hyper 212, water cooler 240mm
- **Monitores** — ex.: Monitor 144Hz 24", Monitor 4K 27"
- **Periféricos** — teclado mecânico, mouse gamer, headset

## Estrutura

```
frontend/
├── index.html              # Vitrine pública (home)
├── css/style.css           # Design system cyberpunk (tokens, componentes, responsivo)
├── js/
│   ├── config.js           # API_URL — ajuste aqui a URL do backend
│   ├── auth.js             # Sessão (token JWT), controle de nav pública/privada
│   ├── cart.js              # Carrinho em localStorage
│   ├── produtos-ui.js       # Renderização de cards de produto (compartilhado)
│   ├── index.js / produtos.js / carrinho.js / login.js / cadastro.js
│   ├── perfil.js / pedidos.js / admin.js
│   └── validaCpf.js         # Validação matemática do CPF (mesmo algoritmo do backend)
└── html/
    ├── produtos.html   # Catálogo com busca e filtro por categoria
    ├── carrinho.html   # Carrinho + checkout (rota privada no backend)
    ├── login.html
    ├── cadastro.html   # Cadastro com autocomplete de CEP (ViaCEP) e validação de CPF
    ├── perfil.html     # Dados da conta (rota privada)
    ├── pedidos.html    # Histórico de pedidos (rota privada)
    └── admin.html       # Painel admin: produtos, categorias, estoque, entregas, relatórios (chart.js)
```

## Como rodar localmente

1. Suba o backend (`backend-pecas`) normalmente: `npm install && npm run dev` (porta padrão `3000`).
2. Abra `frontend/index.html` com a extensão **Live Server** do VS Code (ou qualquer servidor estático). Não abra o arquivo direto em `file://`, pois isso pode quebrar o `fetch`.
3. Confirme em `js/config.js` que `API_URL` aponta para `http://localhost:3000`.

## Deploy

- **Backend → Railway**: publique a pasta `backend-pecas` e copie a URL pública gerada (ex.: `https://seuapp.up.railway.app`).
- **Frontend → Vercel**: publique a pasta `frontend`. Antes do deploy, edite `js/config.js`:
  ```js
  const API_URL = 'https://seuapp.up.railway.app'
  ```
- O backend já usa `cors()` liberado, então não é necessário configurar CORS adicional.

## Regras implementadas no frontend

- **Rotas públicas**: vitrine, catálogo com busca/filtro, carrinho (localStorage), login, cadastro com CEP/CPF.
- **Rotas privadas (JWT)**: checkout, perfil, histórico de pedidos, painel admin (produtos, categorias, estoque, entregas, relatórios).
- Token enviado sempre como `Authorization: Bearer <token>`; qualquer resposta `401` desloga o usuário automaticamente (`Auth.authFetch`).
- Carrinho bloqueia adição de itens com estoque zerado ou acima da quantidade disponível.
- CPF validado matematicamente antes do envio (mesmo algoritmo do backend).
- CEP consulta a API do ViaCEP diretamente no frontend para preencher rua/bairro/cidade/UF (o backend também valida/busca ao cadastrar).
- Relatórios usam Chart.js (via CDN) consumindo `/relatorios/vendas` (barras) e `/relatorios/estoque` (linha).
- Layout responsivo: testado nos breakpoints 390×844 (mobile) e 1366×768 (desktop).

## Observação

Este pacote contém **apenas o frontend**. O backend enviado (`backend-pecas`) já foi lido e usado como referência exata de rotas, nomes de campos e formatos de resposta — nenhuma alteração foi feita nele.
