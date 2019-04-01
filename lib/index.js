'use strict';

const wildstring = require('wildstring');
const ipMatch = require('is-match-ip');

const siteIdMapper = (siteIdMap, host) => {

    let siteIdMapList = Object.keys(siteIdMap);

    let siteId = siteIdMapList.reduce((result, key) => {
        let found = siteIdMap[key].list.find(hostEntry => wildstring.match(hostEntry, host));
        if (found && !result) {
            let entry = siteIdMap[key];
            return {
                ...entry,
                id: key,
            };
        }
        return result;
    }, false);

    return siteId; //  || siteIdMap[siteIdMapList[0]];

};

function checkSiteId (siteIdMap, logger) {

    return async function (ctx, next) {

        const result = siteIdMapper(siteIdMap, ctx.host);

        if (!result) {
            if (logger) {
                logger.error('ctx.host was not found in list off siteids', ctx.host, siteIdMap);
            }
            throw new Error('host-not-found-in-siteid-map');
        }

        ctx.locals = ctx.locals || {};
        ctx.locals.siteId = result.id;
        ctx.locals.country = result.country;
        ctx.locals.language = result.language;
        ctx.locals.locale = result.locale;
        ctx.locals.siteId = result.id;

        // Append any extra data we would like to use
        ctx.locals.extraInfo = result.extraInfo;

        if (logger && logger.debug) {
            logger.debug(`Site ID check for "${ctx.host}" got`, ctx.locals);
        }

        if (result.ipRestriction && result.ipRestriction.length > 0) {
            const isMatch = ipMatch(result.ipRestriction);
            const match = isMatch(ctx.ip);
            if (!match) {
                ctx.status = 401;
                ctx.body = 'Not allowed';
                return;
            }
        }

        await next();

    };
}

// expose siteIdMapper so it can be be used in ./routes/api/form/post.js
checkSiteId.siteIdMapper = siteIdMapper;

module.exports = checkSiteId;
