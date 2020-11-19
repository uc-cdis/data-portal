# Chicagoland Pandemic Response Commons Dashboard

```
|-----------------------------------|
| Data Commons logo, title, buttons |
|-----------------------------------|
| World Tab | IL Tab |              |
|-----------------------------------|
|   # of cases   |   # of deaths    |
|-----------------------------------|
|                         |  Chart  |
|                         | Carousel|
|           Map           |---------|
|                         |  Chart  |
|                         | Carousel|
|-----------------------------------|
```

## Configuration

```
covid19DashboardConfig: {
    dataUrl: ,
    chartsConfig: {
        <tab ID>: [ <carousel 1 config>, <carousel 2 config> ],
        simulations: {
            <prop name>: { title (str, optional), description (str, optional) }
        }
    }
}
```

Where each carousel configuration is:
```
[ <chart 1 config>, <chart 2 config> ]
```

And each chart configuration is:
```
{
    title (str),
    description (str, optional),
    xTitle (str, optional),
    yTitle (str, optional),
    type (str): one of [lineChart, barChart, image],
    prop (str, optional): name of a Covid19Dashboard property
    path (str, optional): if type==image, path can specified instead of prop
    axisLabelMaxLength (int, optional, default: none): for bar/line charts, labels longer than this will be truncated,
    axisLabelFontSize (int, optional, default: 10): for bar/line charts, font size to use for axis labels,
    layout (str, optional, default: horizontal): one of [vertical, horizontal] for bar charts,
    maxItems (int, optional, default: none): for bar charts,
    barColor (str, optional): for bar charts,
    guppyConfig (optional): {
        dataType (str),
        xAxisProp (str),
        yAxisProp (str),
        filters (guppy filter object, optional)
    }
}
```

Available charts:
- `type: "image"` and `path: "path/to/image"`
- `type: "image"` and `prop: name of Covid19Dashboard prop containing the path to the image`
- `type: "lineChart"` and `prop: name of Covid19Dashboard prop containing the data`
- `type: "barChart"` and `guppyConfig`
