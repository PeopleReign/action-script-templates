/*
Description:
    Searches Workday Workers for ctx.user.firstName + ' ' + ctx.user.lastName and updates ctx.state with resulting matches.

Requires ctx:
    state.auth.workday.accessToken: str or null, newly-fetched access token (if request-success) or null (if request-failure)
    state.updateBusinessTitleForWorkerId: Worker ID of user to create business title change on behalf of
    state.updateBusinessTitleTo: New value to change specified worker's business title to

Requires configurations:
    workdayTenantId: ID of Workday tenant

Writes values:
    state.businessTitleChangeRequestResult: obj, properties of newly-created business title change request. Example value:
        {
            "proposedBusinessTitle": ctx.state.updateBusinessTitleTo,
            "id": "string",
            "href": "string",
            "descriptor": ""
        }

Description: Creates new business-title change request for specified worker, proposing new business title for approval. 
*/

const accessToken = ctx.state.auth.workday.accessToken;
const tenantId = await getVariable('workdayTenantId');

var options = {
    method: 'POST',
    url: 'https://wd2-impl-services1.workday.com/api/common/v1/' + tenantId + '/workers/' + ctx.state.updateBusinessTitleForWorkerId,
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
    },
    data: { proposedBusinessTitle: ctx.state.updateBusinessTitleTo }
};

const res = null;
try {
    res = await axios.request(options)
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
    ctx.state.businessTitleChangeRequestResult = res.data;
}
