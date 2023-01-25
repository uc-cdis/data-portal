# Windmill data portal

A generic data portal that supports some basic interaction with Gen3 services like [peregrine](https://github.com/uc-cdis/peregrine), [sheepdog](https://github.com/uc-cdis/sheepdog) and [fence](https://github.com/uc-cdis/fence).

## Get Started

### Prerequisites

- [npm](https://www.npmjs.com/)

### Installing

```
npm ci
```

### Local development and dev.html

See the [guide to running data-portal locally](docs/guide_running_portal_locally.md) for a step-by-step guide.

The portal's `/dev.html` path loads javascript and most css
from `localhost`. Test code under local development with this procedure:

- `npm ci`
- launch the webpack dev server, and configure local code with the same configuration as the server to test against. For example - if we intend to test against qa.planx-pla.net, then:

```
HOSTNAME=qa.planx-pla.net NODE_ENV=auto bash ./runWebpack.sh
```

, or for qa-brain:

```
HOSTNAME=qa-brain.planx-pla.net NODE_ENV=auto bash ./runWebpack.sh
```

You can also use the `autoprod` value for `NODE_ENV` to do the `auto` setup, then run `webpack` in production mode, so it generates `.js` and `.html` files instead of launching the dev server - ex:

```
HOSTNAME=qa-brain.planx-pla.net NODE_ENV=autoprod GEN3_BUNDLE=all bash ./runWebpack.sh
```

Tiered-access settings can be configured through either the `TIER_ACCESS_LEVEL` environment variable (site-wide) or through the `tierAccessLevel` property on guppyConfig blocks for each Data Explorer tab in the gitops.json (index-scoped). To use the index-scoped config style, all guppyConfig blocks in the portal config must contain the `tierAccessLevel` property. See `docs/portal_config.md` for thorough example of portal config structure.

> **NOTE:** To locally test site-wide Tiered Access features, the additional environment variables `TIER_ACCESS_LEVEL` and `TIER_ACCESS_LIMIT` should have the same values as the server's "global.tier_access_level" and "global.tier_access_limit" properties in its [`manifest.json`](https://github.com/uc-cdis/cdis-manifest).
>
> **Example**:`HOSTNAME=qa-brain.planx-pla.net TIER_ACCESS_LEVEL=regular TIER_ACCESS_LIMIT=50 NODE_ENV=auto bash ./runWebpack.sh`

If the index-scoped tiered-access setting is used, the `tierAccessLevel` properties in the guppyConfig blocks in gitops.json should have the same values as the server's "guppyConfig[index].tier_access_level" in its [`manifest.json`](https://github.com/uc-cdis/cdis-manifest). Tabs should be configured with the same tiered-access level as the ES index they use.

- Accept the self-signed certificate at https://localhost:9443/bundle.js

- Load the test environment's `/dev.html` - ex: https://qa-brian.planx-pla.net/dev.html

### Local development and gitops

Most production commons currently load custom configuration via gitops. The configuration for a production commons is available in that commons' gitops repository (mostly https://github.com/uc-cdis/cdis-manifest), and can be copied for local development. The `runWebpack.sh` script automates this process when `NODE_ENV` is set to `auto` - ex:

```
HOSTNAME=qa-brain.planx-pla.net NODE_ENV=auto bash ./runWebpack.sh
```

Note: the legacy `dev` NODE_ENV is still available, but the `APP` environment must also be manually set to load the configuration that matches the dictionary from HOSTNAME - ex:

```
HOSTNAME=qa.planx-pla.net NODE_ENV=dev APP=dev bash ./runWebpack.sh
```

### Portal Bundles

The portal webpack configurations selects between multiple application entry points
at build time:

- `commons` - the default data commons portal
- `covid19` - a portal for pandemic response commons
- `nct` - a portal for clinical trials
- `ecosystem` - a portal for Gen3 data ecosystem
- `workspace` - a scaled down portal for workspace accounts

We can use the https://remote/dev.html trick to test a local workspace build by setting the `GEN3_BUNDLE` variable to `workspace`:

```
HOSTNAME=qa.planx-pla.net GEN3_BUNDLE=workspace bash ./runWebpack.sh
```

That just changes the webpack config to serve the workspace bundle as `bundle.js` - which is what `dev.html` expects.

The portal `Dockerfile` runs a deploy time webpack build to incorporate
deploy-time configuration. The `GEN3_BUNDLE` environment variable determines which application gets built at run time.

### Customized Basename

> :warning: To use this feature, make sure the to set the `BASENAME` to a customized value in the portal deployed to the remote before you run the local dev server with the customized basename. Also the customized basename you used for local portal dev server should be the same as you have set for the remote deployment.

Available from `3.23.0`, you can supply a customized basename for portal by setting the `BASENAME` variable:

```
HOSTNAME=qa.planx-pla.net NODE_ENV=auto BASENAME=/portal bash ./runWebpack.sh
```

After that you can visit the local development portal from https://qa.planx-pla.net/portal/dev.html

If this environmental variable is set in production bundle then portal should be accessed from https://qa.planx-pla.net/portal

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
          "options": ["I can not share data", "I can only share data with BPA members", "I can share data with family", "I can share data with my wife"],
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

When styling components, we adhere to a few rules. We style using class selectors (`.class-name` instead of `#class-name`), and separate class names with hyphens instead of camel case (`.class-name` instead of `.className`). The CSS file should be named {component}.css, and be in the same folder as the component. It is then imported into the component's .jsx file.

We are moving toward using the [BEM methodology](http://getbem.com/introduction/) in terms of CSS organizational conventions. This means we are dividing chunks of code within a component into blocks, are avoiding nesting components, and are using the naming convention of `{block}__{elements}--{modifier}`. `{element}` and `{modifier}` are optional depending on the situation - see the [BEM guidelines](http://getbem.com/introduction/) for more examples.

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

### Linting

We use ESLint and Stylelint to lint and automatically format code.

- `npm run eslint` Will run ESLint on the entire code base and automatically try to fix all JS and JS like files.
- `npm run eslint-new` Will run ESLint only on newly added files in the current git branch and automatically try to fix the JS and JS like files.
- `npm run stylelint` Will run Stylelint on all CSS and CSS-like files in the code base and automatically try to fix them.


### Testing

We use JEST and enzyme for unit testing frontend components in this project.

- `npm run test` Will run JEST tests for all the tests found in the complete project.
- `npm run test SUBFOLDER_RELATIVE_PATH` will only consider the part of the project starting at the given subfolder when looking for tests to run.
  - e.g. `npm run test src/Analysis/GWASV2`
