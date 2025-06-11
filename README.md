# **Desafio Técnico: Transcrição de Áudio em Tempo Real**

## **Contexto**

Bem-vindo(a) ao nosso desafio de programação\! Somos a Iara Health, uma healthtech de IA especializada em reconhecimento de fala para auxiliar profissionais de saúde a emitir laudos médicos e documentar interações com pacientes de forma eficiente.

Neste desafio, você trabalhará em um componente de front-end que exibe transcrições de áudio ao vivo, simulando a interação com nosso servidor de reconhecimento de fala.

## **O Desafio**

Fornecemos um código base inicial (em index.html). Este código contém uma simulação de uma API que transcreve segmentos de áudio e uma implementação inicial para exibir essas transcrições. O código fornecido não inclui dependências externas, porém você tem a liberdade de integrar bibliotecas ou frameworks de sua escolha, ou manter o desenvolvimento com Javascript puro.

Seu objetivo é refatorar, otimizar e aprimorar essa implementação.

### **Requisitos**

1. **Refatoração e Boas Práticas:**

   - O código inicial não segue as melhores práticas de desenvolvimento (e.g., estrutura do HTML, manipulação do DOM, clareza do código), e pode apresentar erros em casos que fujam do cenário básico.
   - **Sua tarefa:** Refatore o código para torná-lo mais legível, manutenível e escalável. Sinta-se à vontade para reestruturar o HTML, CSS e JavaScript como julgar necessário.

2. **Garantir a Ordem das Transcrições:**
   - A função `fetchTranscription` simula chamadas de API para nosso servidor. As chamadas são feitas em intervalos fixos, mas as respostas podem chegar fora de ordem devido a variações na rede ou no tempo de processamento.
   - **Sua tarefa:** Modifique a lógica para garantir que as transcrições sejam sempre exibidas na tela na ordem correta em que foram solicitadas (sequencialmente, por `segmentId`).
3. **Otimização de Performance:**

   - A função `processKwds` é intencionalmente ineficiente. Com um grande número de transcrições e palavras-chave, ela pode causar lentidão na interface.
   - **Sua tarefa:** Otimize esta função para melhorar seu desempenho. O resultado final (destacar palavras-chave na transcrição) deve permanecer o mesmo.

4. **Apresentação e UX:**
   - Melhore a experiência do usuário. A interface atual é muito básica.
   - **Sua tarefa:** Adicione um feedback visual para indicar quando uma nova transcrição está sendo carregada ou processada. Opcionalmente, melhore o layout e o estilo para tornar a visualização um pouco mais agradável e profissional.

### **Como entregar**

1. Inclua um SOLUTION_README.md com instruções sobre como executar seu projeto e uma breve explicação das decisões que você tomou.
2. Crie um arquivo .zip com os arquivos do projeto e encaminhe por email para daniel@iarahealth.com.

Avaliamos não apenas a solução final, mas também o seu processo de pensamento, a qualidade do código e a clareza da sua comunicação.

Boa sorte\!
