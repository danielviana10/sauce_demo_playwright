# Automação de Testes com Playwright - Sauce Demo

Este projeto foi desenvolvido como parte do desafio técnico para a vaga de SDET na voidr. O objetivo é automatizar testes end-to-end (E2E) para a aplicação web **Sauce Demo** utilizando o framework **Playwright**.

## Funcionalidades

- **Automação de testes:** Criação de casos de teste para validar funcionalidades da aplicação Sauce Demo.
- **Page Objects:** Uso do padrão Page Object Model (POM) para organizar o código e facilitar a manutenção.
- **Relatórios:** Geração de relatórios de execução dos testes.
- **Multiplataforma:** Execução dos testes em diferentes navegadores (Chromium, Firefox, WebKit).

## Cenários de Teste Automatizados

Foram implementados os seguintes cenários de teste:

1. **Login com credenciais válidas:** Valida o login com usuário e senha corretos.
2. **Login com credenciais inválidas:** Verifica a mensagem de erro ao usar credenciais incorretas.
3. **Adicionar item ao carrinho:** Testa a funcionalidade de adicionar um produto ao carrinho.
4. **Remover item do carrinho:** Valida a remoção de um item do carrinho.
5. **Ordenação de produtos por preço:** Verifica a ordenação dos produtos por preço (menor para maior).
6. **Finalização de compra:** Testa o fluxo completo de compra, desde o login até a confirmação do pedido.
7. **Logout:** Valida a funcionalidade de logout.
8. **Verificação de detalhes do produto:** Testa a exibição correta dos detalhes de um produto.
9. **Acesso ao menu lateral:** Valida a funcionalidade do menu lateral.
10. **Resetar estado da aplicação:** Verifica se o estado da aplicação é resetado corretamente.

## Tecnologias Utilizadas

- **[Playwright](https://playwright.dev/):** Framework de automação de testes.
- **[Node.js](https://nodejs.org/):** Ambiente de execução Typescript.
- **[Git](https://git-scm.com/):** Controle de versão.
- **[GitHub](https://github.com/):** Hospedagem do repositório.
- **[Pixelmatch]([https://github.com/](https://www.npmjs.com/package/pixelmatch/v/1.1.0)):** Biblioteca de comparação de imagens.
- **[PNGjg]([https://www.npmjs.com/package/pngjs]):** Biblioteca codificadora/decodificador para Nodejs

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Git](https://git-scm.com/) (opcional, para clonar o repositório)

## Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Executar os Testes
```
npx playwright test
npx playwright test login.spec.ts (para um teste isolado)
```
Por padrão o headless está marcado como:
  headless: true, ....
Porém, se quer observar os testes acontecendo, mude para false e remova o cometário lauchOptions, caso queria observar mais devagar, aumente para 1000 (1s) ou 2000 (2s):
  launchOptions: {
    slowMo: 500,
  }, ...
ou execute o teste com a tag `--headed`:
```bash
npx playwright test --headed
npx playwright test cart.spec.ts --headed
```

### 4. Gerar relatórios
Para gerar um relatório detalhado da execução dos testes, execute:
```bash
npx playwright show-report
```
Após a execução dos testes, um relatório HTML será gerado automaticamente. Para visualizá-lo, abra o arquivo playwright-report/index.html no seu navegador.

### 5. Estrutura do projeto
/projeto-playwright/
├── tests/               # Casos de teste
│   ├── login.spec.ts    # Testes de login
│   ├── cart.spec.ts     # Testes de carrinho
│   └── ...              # Outros testes
├── pages/               # Page Objects
│   ├── LoginPage.ts     # Página de login
│   ├── CartPage.ts      # Página do carrinho
│   └── ...              # Outras páginas
├── utils/               # Utilitários e helpers
│   ├── getInventory.ts  # Constantes reutilizáveis
│   └── imageCompare.ts  # Funções auxiliares
├── playwright.config.ts # Configurações do Playwright
├── package.json         # Dependências do projeto
└── README.md            # Documentação do projeto

### 6. Boas práticas adotadas
- Page Object Model (POM): Separação das páginas da aplicação em classes para facilitar a manutenção e reutilização do código.
- Testes Independentes: Cada teste é independente e pode ser executado separadamente.
- Relatórios Automatizados: Geração de relatórios detalhados após a execução dos testes.
- Configuração Multiplataforma: Execução dos testes em diferentes navegadores (Chromium, Firefox, WebKit).
- Uso de Typescript: Tipagem estática para melhorar a qualidade e a manutenibilidade do código.
- Variáveis de Ambiente: Uso de variáveis de ambiente para credenciais e configurações sensíveis.
