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
                    "icon": "query"
                }
            ]
        }
    },
    "resourceBrowser": {
        "title": "My Data Commons' Jupyter Notebooks",
        "description": "Here's a collection of notebooks I'm proud of",
        "public": true,
        "resources": [
            {
                "title": "Custom Notebook",
                "category": "Notebooks",
                "description": "This is a custom notebook that generates a bunch of charts",
                "link": "https://blah.net/notebooks/nb.html",
                "imageUrl": "https://link-to-image.png"
            },
            {
                "title": "Custom Notebook 2",
                "link": "/notebooks/nb.html",
                "imageUrl": "/relative-link-to-image.png"
            }
        ]
    }
}
```

- `resourceBrowser`:
  - `title` is required
  - `description` and `public` are optional. `resources` too, but why would you not include it?
  - `public` is false by default. If true, users can visit the page without being logged in. If false, they will need to log in _but_ the access to individual notebooks will not be controlled.
- `resourceBrowser.resources`:
  - `title` and `link` are required
  - `category`, `description` and `imageUrl` are optional
  - `link` and `imageUrl` can be absolute or relative URLs

## Possible improvements

- `category` is not used right now. The goal is to organize resources by category.
- Add a resource path to each resource for authz. The authz would be checked if `public` is false.
