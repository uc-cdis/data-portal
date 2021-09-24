# System Use Message
This feature will show a Use Message in a popup, to inform users of the use policy of the commons.

To enable a system use message, define the following in gitops.json:
```json
  ...
    "systemUse": {
      "systemUseText" : "VA systems are intended to be used by authorized VA network users for ....",
      "displayUseMsg": "cookie",
      "expireUseMsgDays" : 103
    },
  ...
```

the fields are:
* systemUseText: text to display in the popup dialog
* displayUseMsg: when to show the warning. The two permitted values are:
  * "session": show message on every new session, i.e. fresh load of the commons
  * "cookie": use a cookie to store the acceptance of the policy, the default cookie expiration is 10 days and can be changed by adding:
    * "expireUseMsgDays" : 10
