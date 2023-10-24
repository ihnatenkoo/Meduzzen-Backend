## Meduzzen Backend Project

## Before start

- create .env file in the root directory
- copy all variables from `.env.sample` to `.env` file
- fill all variable values

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

```bash
# build production image
$ npm run docker:prod

# build production image and run container
$ npm run docker:prod-run

# build test image
$ pm run docker:test

# build test image and run container
$ npm run docker:test-run
```
