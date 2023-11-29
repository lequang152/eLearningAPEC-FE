# Stage 1: Install Dependencies
FROM node:18-alpine AS deps

LABEL author="baolq <baolq1.work@gmail.com>"

WORKDIR /app

COPY package.json yarn.lock ./
RUN apk add --no-cache libc6-compat git && \
    yarn install --production --frozen-lockfile && \
    yarn cache clean

# Stage 2: Build Application
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build && \yarn cache clean

# Stage 3: Create Production Image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3005
ENV PORT 3005

CMD ["yarn", "start"]
