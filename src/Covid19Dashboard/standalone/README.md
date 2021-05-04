## Gen3 Map Template

This project acts as a Map template for creating map-based visualization
for inclusion into the Gen3 data portal.
This template will make adding your visualization easier to
a Gen3 based data portal. You can use this project as the
basis for your own data visualization by changing the data
and the Layer definitions to match your data and visualization
style.

The template is written in [Typescript](https://www.typescriptlang.org/) and is
based on [React](https://reactjs.org/), [MapBox](www.mapbox.com), and
uses [npm](https://www.npmjs.com).

To develop a map based visualization look at src/BaseMap/index.jsx.
It is composed of the following elements:


#### Data
Data for any mapping project needs to be geospatial
data in GeoJSON format,
one of two formats that MapBox accepts. In the
template, the data is imported into a JSON object. O
ther methods would include reading from an AWS S3 bucket
or a URL. For inclusion into Gen3 the data files must be in
GeoJSON format and not read from a database or other service.

#### Map Component
The [InteractiveMap](https://visgl.github.io/react-map-gl/docs/api-reference/interactive-map) component
is a Mapbox based map. It requires for you to supply a MapBox token
detail of which are described below. You do not need to make
any changes to the mapboxToken in this file.

#### Data Source and Layer
To display your data on top of a MapBox map you need
to define a Data Source and a Layer. The Datasource is used
to load your GeoJSON map data and the Layer is used to
render some or all of the data.

Layer uses the MapBox style [definition](https://docs.mapbox.com/mapbox-gl-js/style-spec/)
which is flexible enough to render a wide variety of different
styles of visualization. In addition it support filter operations
which allows you to use a single datasource to render multiple Layers.
You can also add you own processing to the data but for
many operation using so called [Data Driven Styling](https://docs.mapbox.com/help/getting-started/map-design/#data-driven-styles)
is more efficient due to MapBox's render optimization. The template has an example of data driven styling.


## Installation

To install the template you will need npm. Note that the version
of npm needs to be less than version 7 or you will run into errors.

To install type the following:
```
npm install
```

You will also need to set up a Mapbox token which is needed
to access their services. You can obtain a Mapbox token and free access
[here](https://docs.mapbox.com/help/getting-started/access-tokens/).
To do this, create a .env file in the template
root level directory and add the line:
```
MAPBOX_API_TOKEN=your mapbox token
```
where you replace *your mapbox token* with the appropriate
Mapbox token.

You will see some warnings, however you should be able safely ignore them.
Assuming the installation complete without errors, you can start
a webserver by:
```
npm start
```

you see something similar to:
```
> gdc-map-template@0.1.0 start .. .../Projects/CTDS/gen3/data-portal/..
> webpack-dev-server --mode development

ℹ ｢wds｣: Project is running at http://localhost:8081/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: Content not from webpack is served from ./dist
ℹ ｢wdm｣: Hash: 5c1e470f2e6c21006fdf
Version: webpack 4.46.0
.
.
.
ℹ ｢wdm｣: Compiled successfully.

```
You can access the url shown above
(the port number might be different) and should see something
like:
![Illinois map with population](img/Map1.png)


### Creating a new Overlay

Creating a new overlay require that you defined a GeoJson data source,
style it and then add it to the map.
