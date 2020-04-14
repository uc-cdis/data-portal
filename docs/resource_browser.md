# Resource Browser

Example configuration:

```
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
},
```

- `public` is false by default
- `link` and `imageUrl` can be absolute or relative URLs
- `category`, `description` and `imageUrl` are optional
