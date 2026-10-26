FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/dist ./dist
COPY --from=build /app/db/migrations ./db/migrations
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["node", "dist/boot.js"]
