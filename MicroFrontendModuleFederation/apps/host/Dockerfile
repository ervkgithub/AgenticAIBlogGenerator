FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./
COPY --from=build /app/.env.production ./ .
EXPOSE 4000
ENV NODE_ENV=production
ENV PORT=4000
CMD ["node", "server.js"]
