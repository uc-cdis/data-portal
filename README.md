# Windmill data portal

A generic data portal that supports some basic interaction with Gen3 services like [peregrine](https://github.com/uc-cdis/peregrine), [sheepdog](https://github.com/uc-cdis/sheepdog) and [fence](https://github.com/uc-cdis/fence).

## Get Started

### Prerequisites

- [npm](https://www.npmjs.com/)

### Installing

```
npm install
```

### Local development and dev.html

The portal's `/dev.html` path loads javascript and most css
from `localhost`. Test code under local development with this procedure:

- `npm install`
- launch the webpack dev server, and configure local code with the same configuration as the server to test against. For example - if we intend to test against the local Docker Compose stack running on localhost, then:

```
HOSTNAME=localhost APP=pcdc ./runWebpack.sh
```

> **NOTE:** To locally test Tiered Access features, you must include the additional environment variable `TIER_ACCESS_LIMIT`, which should have the same values as the server's "global.tier_access_limit" properties in its [`manifest.json`](https://github.com/uc-cdis/cdis-manifest).
>
> **Example**:`HOSTNAME=localhost TIER_ACCESS_LIMIT=50 bash ./runWebpack.sh`

- Accept the self-signed certificate at https://localhost:9443/bundle.js

- Load the test environment's `/dev.html` - ex: https://localhost/dev.html

### Component story books

To run Storybook:
`npm run storybook`

### Run Windmill using Docker

Build the container image first

```
docker build -t windmill .
```

Then run the container

```
docker run --rm -e HOSTNAME=qa.planx-pla.net -p 443:443 -ti windmill
```

You will then need to visit `https://localhost` and accept the self-signed certificate warnings

### Deployment

docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal

### GraphQL configuration

The configurations of Homepage charts are specified data/config/<common-name>.json, or gitops.json in gitops repo. For each common, we need to specify the following json entities:

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

Except the default case/file count charts, you could add more to the homepage, and those customized charts will be added to a carousel.
We support categorical horizontal grouped bar charts, and the chart will be using data from Guppy, so make sure you correctly ETL them to your Elasticsearch database. The new added charts are configured in portal config's components.index.customHomepageChartConfig config, make sure configurations are correct. Example config (notice the comments won't work for JSON):

```
"customHomepageChartConfig": [
  {
    "chartType": "horizontalGroupedBar", // we currently only support this type
    "dataType": "participant", // type name in your Elasticsearch db
    "yAxisProp": "country", // field name for y axis
    "xAxisProp": "ibd_affection_status", // field name for x axis
    "constrains": {
      "project_id": "jnkns-jenkins" // only support one constrains, could used to render charts for specific project or program
    },
    "chartTitle": "jnkns-jenkins project", // chart title
    "logBase": 1, // optional, log base, default is 1,
    "initialUnselectedKeys": ["no data", "Unknown"], // optional, an array of string, means the values those will be initially unselected
    "subTitle": "number of cases by countries", // optional, by default it will be "number of ${dataTypePlural} by ${yAxisProp}"
    "dataTypePlural": "cases" // optional, string, by default it will be `${dataType}s`
  }
]
```

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
