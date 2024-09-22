# Build stage
FROM node:18-alpine as build

ARG NODE_ENV
ARG VITE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_APP_ID
ARG VITE_MEASUREMENT_ID

ENV NODE_ENV=${NODE_ENV}
ENV VITE_API_KEY=${VITE_API_KEY}
ENV VITE_AUTH_DOMAIN=${VITE_AUTH_DOMAIN}
ENV VITE_PROJECT_ID=${VITE_PROJECT_ID}
ENV VITE_STORAGE_BUCKET=${VITE_STORAGE_BUCKET}
ENV VITE_MESSAGING_SENDER_ID=${VITE_MESSAGING_SENDER_ID}
ENV VITE_APP_ID=${VITE_APP_ID}
ENV VITE_MEASUREMENT_ID=${VITE_MEASUREMENT_ID}

WORKDIR /app

# Install yarn
RUN apk add --no-cache yarn

# Copy yarn.lock in addition to package.json
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production stage
FROM nginx:alpine
RUN apk add --no-cache tzdata
COPY --from=build /app/dist /usr/share/nginx/html
ENV TZ=Asia/Saigon

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 2052 2053

CMD ["nginx", "-g", "daemon off;"]