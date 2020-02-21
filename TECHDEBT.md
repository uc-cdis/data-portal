# Tech debt

### Arborist auth mapping
Observed: October 2019
Impact: (if this tech debt affected your work somehow, add a +1 here with a
date and optionally a note)
+1 Zoe 2020 Feb 20 This is an example of a +1
##### Problem:
The ArboristUI features rely on hitting Arborist /auth/mapping one time to get
the auth mapping, and then consult the auth mapping to decide which components
should be rendered and which should not.
##### Why it was done this way:
This was done to avoid having to make many (tens?) of calls to Arborist upon
each page load, for example upon loading the profile page.
##### Why this way is problematic:
The auth mapping returns a bunch of resource paths, and the resource paths are
part of a hierarchy. When Arborist resolves auth requests it understands the
resource hierarchy, so for example if a user has a policy granting them access
to /programA then Arborist knows the user has access to /programA/project1.
Windmill, being the front-end service, should not need to understand the
resource hierarchy. But if it is to receive the raw auth mapping from Arborist
and do logic on that, instead of hitting /auth/request, then in order to
correctly make authz decisions for resource paths, it has to understand the
resource hierarchy. Currently it just does the wrong thing. But our resource
hierarchy is not too complex yet, mostly just program-project, so for now it
doesn't happen very often.
##### What the solution might be:
Call /auth/request for every authz-protected component that loads.
##### Why we aren't already doing the above:
That's a lot of requests to Arborist all at once.
##### Next steps:
Just try it the other way?? Figure out how to chunk requests to Arborist?
Redis cache...????????
##### Other notes:
Tube has a similar problem, where each document is associated with a resource
path, but Tube just tries to do a simple match on the resource path and the
auth mapping keys.
