/*
Description:
    Searches Workday Workers for ctx.user.firstName + ' ' + ctx.user.lastName and updates ctx.state with resulting matches.

Requires ctx:
    state.user.workday.workerId: user's Workday worker ID
    state.auth.workday.accessToken: str or null, newly-fetched access token (if request-success) or null (if request-failure)

Requires configurations:
    workdayTenantId: ID of Workday tenant

Writes values:
    ctx.state.user.workday.serviceLength: result from Staffing API serviceLength request

Description: fetches worker's service length (and other parameters) from the Staffing API
*/

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

    // Define the request parameters
    let requestParams = {
        method: 'POST',
        url: 'https://wd2-impl-services1.workday.com/api/staffing/v3/' + ctx.state.workdayTenantId + '/workers/' + ctx.state.user.workday.workerId + '/serviceLength',
        headers: {
            'Authorization': 'Bearer ' + ctx.state.auth.workday.accessToken,
        },
    };

    if (!('errorLog' in ctx.state)) {
        ctx.state.errorLog = [];
    }

    // Execute the request
    const res = null;
    try {
        res = axios.request(requestParams)
    } catch (error) {
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
        if (!(ctx.state.user)) {
            ctx.state.user = {};
        }
        if (!(ctx.state.user.workday)) {
            ctx.state.user.workday = {};
        }
        ctx.state.user.workday.serviceLength = resp.data.serviceLength;
    }

} catch (error) {
    let newErr = JSON.stringify(err, Object.getOwnPropertyNames(err));
    ctx.state.errorLog.push(newErr);
}