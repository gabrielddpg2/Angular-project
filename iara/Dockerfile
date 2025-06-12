# ======================================================================
# ESTÁGIO 1: Build (O Ambiente de Construção)
# ======================================================================
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

# Copia nosso arquivo .npmrc com as configurações de resiliência
COPY .npmrc ./

# Executa o npm install, que agora será muito mais robusto a falhas de rede
RUN npm install

# Copia o resto do código
COPY . .

# Executa o build de produção. Agora o esbuild será a versão correta para Linux.
RUN npm run build -- --configuration=production


# ======================================================================
# ESTÁGIO 2: Serve (O Ambiente de Produção)
# (Este estágio não muda)
# ======================================================================
FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/iara/browser /usr/share/nginx/html

EXPOSE 80