FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_BASE=http://localhost:5500/api
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=build /app ./

ENV NODE_ENV=production
EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]