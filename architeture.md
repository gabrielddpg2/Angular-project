# 🧱 Estrutura do Projeto - Clean Architecture + Facade

Este projeto segue os princípios da **Clean Architecture**, organizando responsabilidades em camadas bem definidas e separando as regras de negócio da infraestrutura. Também foi aplicado o padrão **Facade** para facilitar a comunicação entre a camada de apresentação e as demais camadas internas.

---

## 📁 Estrutura de Pastas

```
/src
├── app/
│   ├── features/
│   │   └── transcription/
│   │       ├── 1-presentation/             # Camada de apresentação (UI)
│   │       │   ├── components/
│   │       │   │   ├── transcription.component.css
│   │       │   │   ├── transcription.component.html
│   │       │   │   └── transcription.component.ts
│   │       │   └── transcription.facade.ts  # Fachada que orquestra a comunicação com as outras camadas
│   │       ├── 2-application/              # Casos de uso (application layer)
│   │       │   └── use-cases/
│   │       │       ├── get-medical-keywords.use-case.ts
│   │       │       └── start-transcription-session.use-case.ts
│   │       └── 3-domain/                   # Entidades, modelos e interfaces
│   │           ├── models/
│   │           │   └── transcription.model.ts
│   │           └── repositories/
│   │               └── transcription.repository.ts
│   ├── app.config.ts
│   └── app.component.ts
│
└── core/
    └── infrastructure/                    # Implementações concretas (infraestrutura)
        └── services/
            └── http-transcription.repository.ts
```

---

## 🧠 Conceitos aplicados

### ✅ Clean Architecture

- **Camada de Apresentação (Presentation):**  
  Responsável pela interface com o usuário (componentes Angular) e comunicação com a fachada.

- **Camada de Aplicação (Application):**  
  Contém os *use cases*, que são os orquestradores das regras de negócio.

- **Camada de Domínio (Domain):**  
  Define os modelos de dados e contratos das interfaces (como repositórios).

- **Infraestrutura (Infrastructure):**  
  Implementa os repositórios e serviços concretos que acessam dados externos (ex: API HTTP).

---

### 🧩 Facade Pattern

A **`transcription.facade.ts`** centraliza a lógica de orquestração, abstraindo detalhes da aplicação e facilitando o uso no componente. Essa camada:

- Simplifica a complexidade da aplicação para a UI.
- Torna os componentes mais limpos e desacoplados das regras de negócio.
- Facilita testes e manutenção do código.

---

## 📌 Benefícios da Arquitetura Aplicada

- Alta **manutenibilidade** e **testabilidade**.
- Baixo acoplamento entre as camadas.
- Facilidade para **escalar** o sistema e **substituir tecnologias**.
- Melhor organização para projetos de médio a grande porte.

---
