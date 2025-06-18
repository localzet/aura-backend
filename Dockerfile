FROM alpine:3.19 AS frontend
WORKDIR /opt/frontend

RUN apk add --no-cache curl unzip ca-certificates \
    && curl -L https://github.com/localzet/aura-frontend/releases/latest/download/aura-frontend.zip -o frontend.zip \
    && unzip frontend.zip -d frontend_temp

FROM node:22 AS backend-build
WORKDIR /opt/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npm run build

RUN npm run migrate:generate

RUN npm cache clean --force 

RUN npm prune --omit=dev

FROM node:22
WORKDIR /opt/app

COPY --from=backend-build /opt/app/dist ./dist
COPY --from=frontend /opt/frontend/frontend_temp/dist ./frontend
COPY --from=backend-build /opt/app/prisma ./prisma
COPY --from=backend-build /opt/app/node_modules ./node_modules

COPY configs /var/lib/aura/configs
COPY package*.json ./

COPY ecosystem.config.js ./
COPY docker-entrypoint.sh ./

RUN npm install pm2 -g \
    && npm link

CMD [ "/bin/sh", "docker-entrypoint.sh" ]