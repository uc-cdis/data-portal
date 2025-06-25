# Local Testing: External Commons Config

This README provides instructions for testing the **"Explore In..."** feature without relying on the backend resources. This setup allows developers to use a mock `config.json`, it could be extended for further testing.

---

## 1. Create `config.json`

Create a file at: `src/GuppyDataExplorer/ExplorerExploreExternalButton/config.json`

Then paste in the contents of the `/analysis/tools/external/config` API response. For example:

```
{
    "commons": [
        {
            "label": "Genomic Data Commons",
            "value": "gdc"
        },
        {
            "label": "Gabriella Miller Kids First",
            "value": "gmkf"
        }
    ],
    "commons_dict": {
        "gdc": "TARGET - GDC",
        "gmkf": "GMKF"
    }
}
````

---

## 2. Swap out the fetch logic

In your `ExplorerExploreExternalButton.jsx` file, update the `handleFetchExternalConfig()` function for local testing:

### Replace this:

```
function handleFetchExternalConfig() {
  setIsLoading(true);
  fetchWithCreds({ path: '/analysis/tools/external/config' })
    .then(({ data }) => {
      setExternalConfig(data);
    })
    .catch(console.error)
    .finally(() => setIsLoading(false));
}
```

### With this:

```
import configData from './config.json';

function handleFetchExternalConfig() {
  setIsLoading(true);
  Promise.resolve({ data: configData })
    .then(({ data }) => {
      setExternalConfig(data);
    })
    .catch(console.error)
    .finally(() => setIsLoading(false));
}
```

---

## 3. Avoid Committing Local Config

To avoid accidentally committing local testing files or logic:

* Revert changes to `handleFetchExternalConfig()` before committing.

---

## Summary

| Step | Action                                         |
| ---- | ---------------------------------------------- |
| 1    | Create `config.json` with backend response     |
| 2    | Replace the fetch function in your component   |
| 3    | Don't commit the mock config or modified fetch |
