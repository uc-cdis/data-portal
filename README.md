# Windmill data portal

A generic data portal that supports some basic interaction with [gdcapi](https://github.com/uc-cdis/gdcapi/) and [user-api](https://github.com/uc-cdis/user-api).

## Get Started

### Prerequisites

- [npm](https://www.npmjs.com/)

### Installing
```
npm install
```

Then, update schema from gdcapi by running `npm run-script schema`.
This command will update the latest schema that is used by Relay and GraphiQL.
Without parameter, it will point to the endpoint at local API (http://localhost:5000/v0/submission/getschema).
Use the parameter to point to remote url (e.g. https://dev.bionimbus.org/api/v0/submission/getschema) as follow:
```
npm run-script schema -- https://dev.bionimbus.org/api/v0/submission/getschema
```

### Running
To run for development:
```
export NODE_ENV=dev
export MOCK_STORE=true
npm run schema
npm run relay
./node_modules/.bin/webpack-dev-server --hot
```
Then browse to http://localhost:8080/webpack-dev-server/ . Since we are running it without APIs, this will only render static pages but any submission actions to APIs will fail.

### Docker Build for Local Development
Build the container image first
```
docker build -t windmill .
```

Then run the container
```
docker run --rm -e HOSTNAME=dev.example.net -e APP=dev -p 443:443 -ti windmill
```

You will then need to visit `https://localhost` and accept the self-signed certificate warnings

### Deployment
docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal

### GraphQL configuration
All the configurations of Homepage and Explorer page are specified src/parameters.json. For each common, we need to specify the following json entities:
```
"<common_name>": {
  "boardCounts": [
    {
      "graphql": "_case_count",
      "name": "Case",
      "plural": "Cases"
    },
    {
      "graphql": "_experiment_count",
      "name": "Experiment",
      "plural": "Experiments"
    },
    {
      "graphql": "_aliquot_count",
      "name": "Aliquot",
      "plural": "Aliquots"
    }
  ],
  "chartCounts": [
    {
      "graphql": "_case_count",
      "name": "Case"
    },
    {
      "graphql": "_experiment_count",
      "name": "Experiment"
    },
    {
      "graphql": "_aliquot_count",
      "name": "Aliquot"
    }
  ],
  "projectDetails": "boardCounts"
}

```
- `boardCounts` are the counts that you want to display in the top-left of dashboard's
- `chartCounts` are the counts that you want to display in the bar chart of dashboard's
- `projectDetails` are the counts that you want to display in the list of projects. It could be same as `boardCounts`, in this case, you only need to point to `boardCounts`.
