/*
Requires configurations:
    workdayTenantId: ID of Workday tenant

Requires secrets:
    workdayClientId: Created when you create a new Application in Workday Cred Admin. You can always go look this value up in Cred Admin.
    workdayClientSecret: Also created when you create a new Application in Workday Cred Admin. You must save this key immedately upon creation of an Application. Workday does not hold this key for you.
    workdayRefreshToken: Workday refresh token to use when fetching new access token.

Writes values:
    ctx.state.auth.workday.accessToken: str or null, newly-fetched access token (if request-success) or null (if request-failure)
*/

if (!('errorLog' in ctx.state)) {
    ctx.state.errorLog = [];
}

// Prepare ctx.state to add our access token later
if (!('auth' in ctx.state)) {
    ctx.state.auth = {};
}
if (!('workday' in ctx.state.auth)) {
    ctx.state.auth.workday = {};
}

try {
    // Implement x-www-form-urlencoded param serialization
    serialize = function (obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };

    let [tenantId] = await getConfiguration('workdayTenantId');
    let [clientId, clientSecret, refreshToken] = await getSecrets(['workdayClientId', 'workdayClientSecret', 'workdayRefreshToken']);

    // Define the request parameters
    let requestParams = {
        method: 'POST',
        url: 'https://wd2-impl-services1.workday.com/ccx/oauth2/' + tenantId + '/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: clientId,
            password: clientSecret
        },
        data: serialize({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    };

    // Execute the request
    const res = null;
    try {
        res = axios.request(requestParams);
    }
    catch (error) {
        if (error.response) {
            ctx.state.errorLog.push(error.response);
        } else if (error.request) {
            ctx.state.errorLog.push(error.request);
        } else {
            ctx.state.errorLog.push("Error encountered" + error);
        }
    }

    if (res !== null) {
        // Handle a successful response
        ctx.state.auth.workday.accessToken = res.data.data.access_token;

    }

} catch (error) {
    let newErr = JSON.stringify(err, Object.getOwnPropertyNames(err));
    ctx.state.errorLog.push(newErr);
}