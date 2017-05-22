# data-portal
A generic data portal that supports some basic interaction with [gdcapi](https://github.com/uc-cdis/gdcapi/) and [user-api](https://github.com/uc-cdis/user-api).

## Get Started

### Prerequisites

- [npm](https://www.npmjs.com/)

### Installing
```
npm install
```
To run for development:
```
export NODE_ENV=dev
export MOCK_STORE=true
./node_modules/.bin/webpack-dev-server --hot
```
Then browse to http://localhost:8080/webpack-dev-server/ . Since we are running it without APIs, this will only render static pages but any submission actions to APIs will fail.

### Deployment
docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal