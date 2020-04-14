# Resource Browser

Example configuration:

```
{
    "components": {
        "navigation": {
            "items": [
                {
                    "name": "Resource Browser",
                    "link": "/resource-browser",
                    "icon": "query",
                    "color": "#a2a2a2"
                }
            ]
        }
    },
    "resourceBrowser": {
        "title": "My Data Commons' Jupyter Notebooks",
        "public": true,
        "resources": [
            {
                "title": "Custom Notebook",
                "category": "Notebooks",
                "description": "This is a custom notebook that generates a bunch of charts",
                "link": "https://pauline.planx-pla.net/dashboard/Public/notebooks/nb.html",
                "imageUrl": "https://link-to-image.png"
            },
            {
                "title": "Custom Notebook 2",
                "link": "https://pauline.planx-pla.net/dashboard/Public/notebooks/nb.html",
                "imageUrl": "/relative-link-to-image.png"
            }
        ]
    }
}
```

- `public` is false by default
- `link` and `imageUrl` can be absolute or relative URLs
- `category`, `description` and `imageUrl` are optional

## Possible improvements

- `category` is not used right now. The goal is to organize resources by category.
- Add a resource path to each resource for authz. The authz would be checked if `public` is false.
