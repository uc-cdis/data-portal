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

### Local development and dev.html

The portal's `/dev.html` path loads javascript and most css
from `localhost`.  Test code under local development with this procedure:
* `npm install`
* launch the webpack dev server, and configure local code with the same configuration as the server to test against.  For example - if we intend to test against dev.planx-pla.net, then:
```
HOSTNAME=dev.planx-pla.net NODE_ENV=auto bash ./runWebpack.sh
```
, or for qa-brain:
```
HOSTNAME=qa-brain.planx-pla.net NODE_ENV=auto bash ./runWebpack.sh
```

* Accept the self-signed certificate at https://localhost:9443/bundle.js

* Load the test environment's `/dev.html` - ex: https://qa-brian.planx-pla.net/dev.html


### Local development and gitops

Most production commons currently load custom configuration via gitops.  The configuration for a production commons is available in that commons' gitops repository (mostly https://github.com/uc-cdis/cdis-manifest), and can be copied for local development.  The `runWebpack.sh` script automates this process when `NODE_ENV` is set to `auto` - ex:
```
HOSTNAME=qa-brain.planx-pla.net NODE_ENV=auto bash ./runWebpack.sh
```

Note: the legacy `dev` NODE_ENV is still available, but the `APP` environment must also be manually set to load the configuration that matches the dictionary from HOSTNAME - ex:
```
HOSTNAME=dev.planx-pla.net NODE_ENV=dev APP=dev bash ./runWebpack.sh
```

### Component story books

To run Storybook:
`npm run storybook`

To run with Arranger components:
1. Set local environment variables:
  - $STORYBOOK_ARRANGER_API: localhost:3000
  - $STORYBOOK_PROJECT_ID: search
  - $REACT_APP_ARRANGER_API: /api/v0/flat-search
  - $REACT_APP_PROJECT_ID: search
2. Run ElasticSearch at localhost:9200
3. Clone and `cd` into `gen3-arranger`. Run:
```cd Docker/Stacks
docker-compose -f esearch.yml up -d
export ESHOST=localhost:9200
source esearch/indexSetup.sh
es_indices
es_delete_all
es_setup_index
es_gen_data 0 20
```
4. Follow the [Arranger](https://github.com/overture-stack/arranger) setup steps - run the server and the dashboard.
5. At the Arranger Dashboard (localhost:6060), add a new version called 'dev'.
6. Click on 'dev' and add a new index. Name: subject, Index: gen3-dev-subject, ES Type: subject.
7. Go back to Versions and hit the lightning bolt. The endpoint should go from a red arrow to a green arrow.
8. At this point, running the Data Portal from our Storybook should work.

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
All the configurations of Homepage and Explorer page are specified data/config/<common-name>.json. For each common, we need to specify the following json entities:
```
"graphql": {
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

### Certificates configuration
All the configurations of necessary certificates are define in src/<common-name>.json. For each common, we need to specify the following json entities:
```
"components": {
  "certs": {
    "<certificate-name>": {
      "title": "BloodPAC User agreement",
      "description": "The agreement on what you can and need to do in a Commons.",
      "questions": [
        {
          "name": "Things you can do after registration",
          "question": "As a registered user, I can do the following things without any problem. Is it true or not:",
          "options": ["Browse public Project", "Upload file", "Download file", "Invite people"],
          "answer": 0,
          "hint": "Some information about this question"
        },
        {
          "name": "Things you need to do to become the registered user",
          "question": "In order to be a register user, I must do the following things otherwise:",
          "options": ["Agree the user agreement", "Accept a consent", "None of them", "Both of them"],
          "answer": 2,
          "hint": "Some information about this question"
        },
        {
          "name": "Things you can do with data",
          "question": "How can I share data with other people according to the policy of the commons",
          "options": ["I can not share data", "I can only share data with BPA memebers", "I can share data with family", "I can share data with my wife"],
          "answer": 1,
          "hint": "Some information about this question"
        }
      ]
    }
  }
}

```
Then, specify all the required certificates that need to be completed before using the portal in following entry:
```
"requiredCerts": ["<certificate-name>"]
```
Default is an empty list.

### Style Guide
When styling components, we adhere to a few rules. We style using class selectors (`.class-name` instead of `#class-name`), and separate class names with hypens instead of camel case (`.class-name` instead of `.className`). The CSS file should be named {component}.css, and be in the same folder as the component. It is then imported into the component's .jsx file.

We are moving toward using the [BEM methodology](http://getbem.com/introduction/) in terms of CSS organizational conventions. This means we are dividing chunks of code within a component into blocks, are avoiding nesting components, and are using the naming convention of `{block}__{elements}--{modifer}`. `{element}` and `{modifier}` are optional depending on the situation - see the [BEM guidelines](http://getbem.com/introduction/) for more examples.

For our example, say we have a simple component called `Component`:
```
import './Component.css';

class Component extends React.Component {
  render() {
    return (
      <div>
        <h1>This is my component</h1>
        <button>Submit</button>
        <button>Cancel</button>
      </div>
    );
  }
}
```
Our block would be `.component`, and elements in that block would consist of the buttons and the title. So our CSS would look like this, based on the BEM naming conventions:

```
.component { }
.component__title { }
.component__button { }
```

And the code would look like this:

```
import './Component.css';

class Component extends React.Component {
  render() {
    return (
      <div className="component">
        <h1 className="component__title">This is my component</h1>
        <button className="component__button">Submit</button>
        <button className="component__button">Cancel</button>
      </div>
    );
  }
}
```

The buttons can also have modifiers - let's say we want two different colors depending on if the button is a submit button or a cancel button. Then our CSS and code would look something like this, respectively:

```
.component { }
.component__title { }
.component__button { }
.component__button--submit {
  color: blue;
}
.component__button--cancel {
  color: red;
}
```

```
import './Component.css';

class Component extends React.Component {
  render() {
    return (
      <div className="component">
        <h1 className="component__title">This is my component</h1>
        <button className="component__button component__button--submit">Submit</button>
        <button className="component__button component__button--cancel">Cancel</button>
      </div>
    );
  }
}
```
