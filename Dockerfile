FROM node:20-buster-slim as builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN npm i -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG GITHUB_TOKEN=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
RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc
RUN pnpm install --frozen-lockfile
RUN rm -f .npmrc


FROM node:20-buster-slim

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN npm i -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG GITHUB_TOKEN=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
RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc
RUN pnpm install --frozen-lockfile --production
RUN rm -f .npmrc

EXPOSE 4001
CMD ["pnpm", "run", "start"]
