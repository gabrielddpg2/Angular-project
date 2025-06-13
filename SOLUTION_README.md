# Iara Health - solução

## 🔧 Como rodar o projeto

Estou usando Angular na sua versão 20.0 com Node 22.12.0

### 🐳 Opção 1 - Usando Docker

1. Navegue até a pasta `Iara`:
   ```bash
   cd iara
   ```
2. Com o Docker Desktop aberto, execute:
   ```bash
   docker-compose up
   ```
3. Em caso de retornar error ao executar docker-compose, possivelmente é o Angular que está exigindo que instale essas dependências de forma manual:
   ```bash
   npm install @angular/animations --save
   npm install @angular/cdk --save
   ```
   depois rode docker-compose up novamente

para ambos casos estará rodando em: [http://localhost:4200/](http://localhost:4200/)

---

### 🧩 Opção 2 - Rodando localmente (Node.js v22.12.0)

1. Navegue até a pasta `Iara`:
   ```bash
   cd iara
   ```

2. Instale todas as dependências:
   ```bash
   npm install
   npm install @angular/animations --save
   npm install @angular/cdk --save
   ```

3. Inicie a aplicação:
   ```bash
   ng serve
   ```

---

## ✅ Testes

Para rodar a bateria de testes:

```bash
ng test
```

---

## 🌐 Projeto em produção

Acesse: [https://iarahmychallenge.netlify.app/](https://iarahmychallenge.netlify.app/)

---

## 📌 Sobre a solução

- **Framework:** Angular v20.0  
- **Estilização:** Tailwind CSS  
- **Containerização:** Docker  
- **Arquitetura:** Clean Architecture + Facade Pattern  

---

## 🚀 Otimizações implementadas

### Pensando em escalabilidade

Imaginando um cenário com **milhares ou milhões de registros**, implementei:

- **Virtual Scrolling:**  
  Exibe apenas os elementos visíveis, economizando memória.

- **Paralelização de requisições:**  
  Realiza múltiplas chamadas simultâneas para reduzir o tempo de carregamento.

Essas técnicas mantêm o sistema **leve e rápido em qualquer escala**.

---

### 🧠 Tratamento de Erros

- Em caso de falha da API, o sistema exibe **feedback visual** ao usuário.

---

### 📱 Responsividade

- Layout adaptado para **dispositivos móveis**.
- Animações para melhorar a **experiência visual**.

---

## ✨ Funcionalidades adicionais

- **Filtro de transcrições:**  
  Exibe apenas descrições que contenham o termo buscado pelo usuário.

- **Exportação para TXT:**  
  Permite exportar a transcrição completa para um arquivo `.txt`.

---

## ✨ Testes

 Configurei testes unitário para a aplicação.

---

## 🛠️ Melhorias no código base original

- **Filtro de palavras-chave aprimorado:**  
  Exemplo:
  > Antes, a frase "A DOR piora quando fico muito tempo em frente ao computaDOR" identificava erroneamente "dor" como parte de "computador".

  Agora o filtro é **mais preciso**, evitando falsos positivos.

---
