# System Use Message
This feature will show a Use Message in a popup, to inform users of the use policy of the commons.
It will display a message which requires acceptance before a user can use the site.

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
* displayUseMsg: when to show the warning. The permitted value is ```"cookie"``` which enables using a cookie to store the acceptance of the policy, the default cookie expiration is 0
 which makes the warning show up on each new browser session. Any positive integer value will set
  the number of day until the cookie expires. Anything else will prevent the warning from showing.
    * "expireUseMsgDays" : 10 - number of days until cookie expires

