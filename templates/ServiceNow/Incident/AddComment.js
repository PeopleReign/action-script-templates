/*
Requires configurations:
    serviceNowInstanceName: ID of ServiceNow instance (like: 'acmecorpsubprod', corresponding to https://acmecorpsubprod.service-now.com)
    serviceNowVirtualAgentUsername: ServiceNow username for the Virtual Agent to use when accessing ServiceNow

Requires secrets:
    serviceNowVirtualAgentPassword: ServiceNow password for the Virtual Agent to use when accessing ServiceNow

Required ctx:
    state.serviceNowUpdateIncidentSysId: Sys ID of incident in ServiceNow to add the comment to.    
    state.serviceNowUpdateIncidentComment: Text of the comment to add to the incident
    state.serviceNowUpdateIncidentCommenterSysId: sys ID of user leaving the comment
    state.serviceNowUpdateIncidentCommenterDisplayName: display-name of user leaving the comment

Writes values:
    ctx.state.serviceNowIncidentResult: obj, content of new incident (value of 'result' property in PATCH response)
*/

const [snInstanceName, snUsername] = await getVariables(['serviceNowInstanceName', 'serviceNowVirtualAgentUsername']);
const snPassword = await getSecret('serviceNowVirtualAgentPassword');
const tableName = 'incident';
const url = 'https://' + snInstanceName + '.service-now.com/api/now/table/' + tableName + '/' + ctx.state.serviceNowUpdateIncidentSysId;

// Engineer the text of the comment
const comment = ctx.state.serviceNowUpdateIncidentComment + '\n\nComment added by the PeopleReign Virtual Agent on behalf of ';
if (state.serviceNowUpdateIncidentCommenterDisplayName) {
    comment += state.serviceNowUpdateIncidentCommenterDisplayName;
    if (state.serviceNowUpdateIncidentCommenterSysId) {
        comment += '(User sys_id: ' + state.serviceNowUpdateIncidentCommenterSysId + ')';
    }
} else {
    if (state.serviceNowUpdateIncidentCommenterSysId) {
        comment += 'user with sys_id ' + state.serviceNowUpdateIncidentCommenterSysId;
    } else {
        comment += 'anonymous user'
    }
}

const config = {
    headers: {
        Accept: 'application/json',
    },
    auth: {
        username: snUsername,
        password: snPassword
    }
}

const res = null;
try {
    res = await axios.patch(url, { comments: comment }, config);
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
    ctx.state.serviceNowIncidentResult = res.data.result;
}