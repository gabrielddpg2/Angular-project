# ======================================================================
# ESTÁGIO 1: Build (O Ambiente de Construção)
# Usamos uma imagem oficial do Node.js v22 para compilar nosso projeto Angular.
# A tag '-alpine' usa uma versão mais leve do Linux.
# 'AS build' dá um nome a este estágio.
# ======================================================================
FROM node:22-alpine AS build

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia 'package.json' e 'package-lock.json' primeiro.
# Isso otimiza o cache do Docker. A reinstalação do npm só ocorrerá se estes arquivos mudarem.
COPY package*.json ./

# Instala todas as dependências do projeto.
RUN npm install

# Copia todo o resto do código-fonte do projeto para o contêiner.
COPY . .

# Executa o comando de build de produção do Angular.
# Isso gera os arquivos estáticos na pasta /app/dist/
RUN npm run build -- --configuration=production

# ======================================================================
# ESTÁGIO 2: Serve (O Ambiente de Produção)
# Usamos uma imagem oficial e super leve do Nginx, um servidor web de alta performance.
# Este será o nosso contêiner final.
# ======================================================================
FROM nginx:stable-alpine

# Remove a configuração padrão do Nginx.
RUN rm /etc/nginx/conf.d/default.conf

# Copia nosso arquivo de configuração customizado para o Nginx (criaremos a seguir).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia APENAS os arquivos compilados do estágio 'build' para a pasta que o Nginx serve.
# ATENÇÃO: O nome da pasta 'iara' deve ser o nome do seu projeto em angular.json.
COPY --from=build /app/dist/iara/browser /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do Nginx.
EXPOSE 80

# O comando para iniciar o Nginx já está embutido na imagem base.