FROM node:24.13.0-alpine AS base

#WORKDIR /usr/src/app
ENV DIR /app
WORKDIR ${DIR}
ARG NPM_TOKEN

FROM base AS dev

ENV NODE_ENV=development
ENV CI=true

RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
    pnpm install --frozen-lockfile && \
    rm -f .npmrc

COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts

COPY tsconfig*json ./
COPY src src

RUN pnpm prisma generate

EXPOSE $PORT
CMD ["pnpm","start:dev"]

# Copiar archivos de dependencias
##COPY package.json ./
#COPY package-lock.json ./

# Instalar dependencias
#RUN npm install

# Copiar el resto del proyecto
#COPY . .

# # Generar cliente de Prisma
# RUN npx prisma generate

# Exponer el puerto
#EXPOSE 3000

#CMD ["sh", "-c", "npx prisma generate && npm run start:dev"]