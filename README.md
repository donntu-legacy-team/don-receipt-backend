# ДонРецепты.ру

## Настройка проекта для тестовой среды

### Установка зависимостей
```bash
$ npm install
```
### Настройки окружения
> Обратите внимание на переменные окружения в `docker-compose.yml`. Переменные окружения для базы данных должны соответствовать тем, что находятся у вас в `.env.development`.

> `POSTGRES_HOST: "postgres"` в `docker-compose.yml` не соответствует с `POSTGRES_HOST` в переменных окружения backend-сервиса. **Это требуется для запуска базы данных в `docker-compose`**.

`.env.development`
```dotenv
ENVIRONMENT=dev
HTTP_HOST=localhost
HTTP_PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_USERNAME=root
POSTGRES_PASSWORD=root
POSTGRES_DATABASE=don_receipt
```

## Компиляция и запуск проекта

```bash
# docker-compose
$ docker-compose up

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Запуск тестов

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
