# Automação de Testes com Playwright - Sauce Demo

Este projeto foi desenvolvido como parte do desafio técnico para a vaga de SDET na voidr. O objetivo é automatizar testes end-to-end (E2E) para a aplicação web **Sauce Demo** utilizando o framework **Playwright**. O projeto abrange testes de login, carrinho, inventário, ordenação, formulário de checkout e fluxo de compra.

---

## Documentação

A documentação do projeto está disponível em: [https://<seu-usuario>.github.io/<nome-do-repositorio>/](https://<seu-usuario>.github.io/<nome-do-repositorio>/)

---

## **Funcionalidades**

- **Automação de testes:** Criação de casos de teste para validar funcionalidades da aplicação Sauce Demo.
- **Page Objects:** Uso do padrão Page Object Model (POM) para organizar o código e facilitar a manutenção.
- **Relatórios:** Geração de relatórios de execução dos testes.
- **Multiplataforma:** Execução dos testes em diferentes navegadores (Chromium, Firefox, WebKit).
- **Comparação de Imagens:** Utilização de bibliotecas como `pixelmatch` e `pngjs` para validação de imagens.
- **Documentação Automatizada:** Geração de documentação com TypeDoc para descrever a estrutura do projeto e os testes.

---

## **Cenários de Teste Automatizados**

Foram implementados os seguintes cenários de teste:

### **Login**

1. **Login com credenciais válidas:** Valida o login com usuário e senha corretos.
2. **Login com credenciais inválidas:** Verifica a mensagem de erro ao usar credenciais incorretas.
3. **Login com usuário bloqueado:** Valida o comportamento ao tentar logar com um usuário bloqueado.
4. **Login com usuário com problemas de performance:** Verifica o comportamento ao logar com um usuário que simula atrasos.

### **Carrinho**

5. **Adicionar item ao carrinho:** Testa a funcionalidade de adicionar um produto ao carrinho.
6. **Remover item do carrinho:** Valida a remoção de um item do carrinho.
7. **Verificar itens no carrinho:** Confirma se os itens adicionados ao carrinho correspondem aos esperados.
8. **Verificar comportamento do carrinho com `problem_user`:** Testa o comportamento do carrinho para um usuário com problemas no sistema.

### **Inventário**

9. **Ordenação de produtos por nome (A-Z e Z-A):** Verifica a ordenação dos produtos por nome.
10. **Ordenação de produtos por preço (menor para maior e maior para menor):** Valida a ordenação dos produtos por preço.
11. **Verificação de detalhes do produto:** Testa a exibição correta dos detalhes de um produto.

### **Formulário de Checkout**

12. **Validação de campos obrigatórios:** Verifica se os campos do formulário de checkout são validados corretamente.
13. **Envio do formulário com dados válidos:** Testa o fluxo de preenchimento e envio do formulário de checkout.
14. **Cancelamento da compra:** Valida o comportamento ao cancelar o processo de checkout.

### **Fluxo de Compra**

15. **Finalização de compra:** Testa o fluxo completo de compra, desde o login até a confirmação do pedido.
16. **Verificação de mensagens de erro:** Valida as mensagens de erro exibidas durante o fluxo de compra.

### **Outros**

17. **Logout:** Valida a funcionalidade de logout.
18. **Acesso ao menu lateral:** Testa a funcionalidade do menu lateral.
19. **Resetar estado da aplicação:** Verifica se o estado da aplicação é resetado corretamente.

---

## **Tecnologias Utilizadas**

- **[Playwright](https://playwright.dev/):** Framework de automação de testes.
- **[Node.js](https://nodejs.org/):** Ambiente de execução TypeScript.
- **[TypeScript](https://www.typescriptlang.org/):** Linguagem de programação para tipagem estática.
- **[Git](https://git-scm.com/):** Controle de versão.
- **[GitHub](https://github.com/):** Hospedagem do repositório.
- **[Pixelmatch](https://www.npmjs.com/package/pixelmatch):** Biblioteca de comparação de imagens.
- **[PNGJS](https://www.npmjs.com/package/pngjs):** Biblioteca para manipulação de imagens PNG.
- **[TypeDoc](https://typedoc.org/):** Gerador de documentação para projetos TypeScript.

---

## **Pré-requisitos**

Antes de executar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Git](https://git-scm.com/) (opcional, para clonar o repositório)

---

## **Como Executar o Projeto**

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

├── tests/                         # Casos de teste

│ ├── login.spec.ts                # Testes de login

│ ├── cart.spec.ts                 # Testes de carrinho

│ ├── inventory.spec.ts            # Testes do inventário

│ ├── sorting.spec.ts              # Testes de ordenação

│ ├── form.spec.ts                 # Testes do formulário de checkout

│ └── purchase.spec.ts             # Testes de compra

├── pages/                         # Page Objects

│ ├── loginPage.ts                 # Página de login

│ ├── cartPage.ts                  # Página do carrinho

│ ├── inventoryPage.ts             # Página do inventário

│ ├── purchaseFlow.ts              # Fluxo de compra

│ └── imageFlow.ts                 # Fluxo de imagens

├── interfaces/                    # Interfaces TypeScript

│ ├── inventory.interface.ts       # Interface para itens do inventário

│ ├── login.interface.ts           # Interface para credenciais de login

│ └── form.interface.ts            # Interface para o formulário de checkout

├── utils/                         # Utilitários e helpers

│ ├── getInventory.ts              # Função para obter itens do inventário

│ └── imageCompare.ts              # Funções auxiliares para comparação de imagens

├── playwright.config.ts           # Configurações do Playwright

├── package.json                   # Dependências do projeto

├── tsconfig.json                  # Configurações do TypeScript

├── typedoc.json                   # Configurações do TypeDoc

└── README.md                      # Documentação do projeto

### 6. Boas práticas adotadas

- Page Object Model (POM): Separação das páginas da aplicação em classes para facilitar a manutenção e reutilização do código.
 
- Testes Independentes: Cada teste é independente e pode ser executado separadamente.

- Relatórios Automatizados: Geração de relatórios detalhados após a execução dos testes.

- Configuração Multiplataforma: Execução dos testes em diferentes navegadores (Chromium, Firefox, WebKit).

- Uso de TypeScript: Tipagem estática para melhorar a qualidade e a manutenibilidade do código.

- Documentação Automatizada: Geração de documentação com TypeDoc para descrever a estrutura do projeto e os testes.

- Variáveis de Ambiente: Uso de variáveis de ambiente para credenciais e configurações sensíveis.

### 7. Documentação com TypeDoc

Para gerar a documentação do projeto, execute:
```bash
npx typedoc
```

A documentação será gerada na pasta docs/. Abra o arquivo index.html para visualizar a documentação.
