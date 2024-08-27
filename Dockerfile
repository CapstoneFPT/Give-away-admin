# Build stage
FROM node:18-alpine as build
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
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]