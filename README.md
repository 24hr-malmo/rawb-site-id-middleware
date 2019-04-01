# rawb-site-id-middleware

A Koa middleware that sets an siteid and other properties depending on ctx.host

## How to use

```
const siteIdMap = {
    "foo": {
        "country": "se",
        "language": "sv",
        "locale": "sv-se",
        "list": [
            "*.foo.se", // Uses https://www.npmjs.com/package/wildstring
            "foo.se",
            "foo.se.localhost",
            "*.foo.se.localhost"
        ],
        "extraInfo": {
          "datamaskin": true
        }
    },
     "bar": {
        "country": "dk",
        "language": "da",
        "locale": "da-dk",
        "list": [
            "*.bar.se",
            "bar.se"
        ],
        ipRestriction: [
            "17?.13.*.12" // Uses https://www.npmjs.com/package/is-match-ip
        ]
    }
};

// logger can be console or winston
app.use(siteId(siteIdMap, logger));

```


### This will add the following variables depeding on the ctx.host

```
ctx.locals.siteId = result.id;
ctx.locals.country = result.country;
ctx.locals.language = result.language;
ctx.locals.locale = result.locale;
ctx.locals.siteId = result.id;

// Append any extra data we would like to use
ctx.locals.extraInfo = result.extraInfo;
```

