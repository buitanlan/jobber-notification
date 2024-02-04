FROM node:20-buster-slim as builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN npm i -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm i -g nodemon

RUN pnpm install --frozen-lockfile

FROM node:20-buster-slim

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN npm i -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm i -g nodemon

RUN pnpm install --frozen-lockfile --production

EXPOSE 4001
CMD ["pnpm", "run", "start"]
