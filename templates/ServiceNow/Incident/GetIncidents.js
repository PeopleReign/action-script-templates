/*
Requires configurations:
    serviceNowInstanceName: ID of ServiceNow instance (like: 'acmecorpsubprod', corresponding to https://acmecorpsubprod.service-now.com)
    serviceNowVirtualAgentUsername: ServiceNow username for the Virtual Agent to use when accessing ServiceNow

Requires secrets:
    serviceNowVirtualAgentPassword: ServiceNow password for the Virtual Agent to use when accessing ServiceNow

Optional ctx:
    state.serviceNowGetIncidentsParams: obj (optional), key/value pairs to pass to request. For more info see https://developer.servicenow.com/dev.do#!/reference/api/sandiego/rest/c_TableAPI#table-GET.    

Writes values:
    ctx.state.serviceNowIncidentResults: arr[obj], one obj for each incident matching provided query params.
*/


const [snInstanceName, snUsername] = await getVariables(['serviceNowInstanceName', 'serviceNowVirtualAgentUsername']);
const snPassword = await getSecret('serviceNowVirtualAgentPassword');
const tableName = 'incident';
const url = 'https://' + snInstanceName + '.service-now.com/api/now/table/' + tableName;

const config = {
    headers: {
        Accept: 'application/json',
    },
    auth: {
        username: snUsername,
        password: snPassword
    }
}

if (ctx.state.serviceNowGetIncidentsParams) {
    config.params = ctx.state.serviceNowGetIncidentsParams;
}

const res = null;
try {
    res = await axios.get(url, config);
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
    ctx.state.serviceNowIncidentResults = res.data.result;
}