para rodar o projeto:

opção 1 - com Docker:

dentro da pasta Iara rode:

npm install @angular/animations --save
npm install @angular/cdk --save

com docker desktop aberto rode:

docker-compose up

opção 2 - apenas com Angular - node v22.12.0:
dentro da pasta Iara rode:

npm install
npm install @angular/animations --save
npm install @angular/cdk --save

ng serve

para rodar bateria de testes:

ng test

projeto deployed:

https://iarahmychallenge.netlify.app/

----------------------------------

informações gerais sobre minha solução

angular v20.0 com tailwind css e Docker
arquitetura: Clean architeture + facade

-------
imaginei um cenário onde a quantidade de dados seria de milhares ou milhões. Neste caso, o projeto para manter perfomance teria que ser refatorado, para tal, implementei: virtual scrolling e a paralelização de requisições: Para otimizar a aplicação para milhões de dados, que renderiza somente os itens visíveis na tela para economizar memória, e a paralelização de requisições, que busca todos os dados de uma vez para acelerar drasticamente o carregamento. Juntas, essas técnicas garantem que o sistema permaneça rápido e eficiente em qualquer escala.
-------

em um cenário onde o endpoint da API não responde foi implementado um caso que mostra isso de forma visual pro usuario como feedback.


o sistema esta responsivo, apropriado também para smartphones.

layout visualmente mais atrativo e animações adicionada.

features adicionais:
"filtrar transcrições": permite retornar apenas descrições que tem o iten de busca digitado pelo o usuario.
"exportar para .TXT": permite exportar toda a transcrição para um arquivo TXT

--------

alguns erros tratados do codigo base do desafio:
melhor filtro de palavra chave. EX: em "A DOR piora quando fico muito tempo em frente ao computaDOR" ele idenficava dor com computador como palavra chave.



