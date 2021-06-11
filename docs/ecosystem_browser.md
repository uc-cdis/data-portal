# Ecosystem Browser
------------------------
The Ecosystem Browser is an exploratory tool in data-portal which allows researchers to browse study data from multiple commons. This page is a modified version of the Discovery page that is disabled by default; it can be enabled using the `discoveryUseAggMDS` featureFlag in the portal config. Note that this featureFlag alters the behavior of the Discovery page to communicate with the Aggregate Metadata path instead of the Metadata path; as a result, a commons admin must choose to either have an Ecosystem Browser or a Discovery page in the commons, not both.

The Ecosystem Browser requires the Metadata Service and a Redis pod to be running in the commons. See the [metadata service documentation](https://github.com/uc-cdis/metadata-service) for more details on how to set up the aggregate metadata path.


All other configuration details are identical to the setup for the Discovery page. See `portal_config.md` for more details.
