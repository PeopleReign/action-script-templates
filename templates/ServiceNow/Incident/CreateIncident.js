/*
Requires configurations:
    serviceNowInstanceName: ID of ServiceNow instance (like: 'acmecorpsubprod', corresponding to https://acmecorpsubprod.service-now.com)
    serviceNowVirtualAgentUsername: ServiceNow username for the Virtual Agent to use when accessing ServiceNow

Requires secrets:
    serviceNowVirtualAgentPassword: ServiceNow password for the Virtual Agent to use when accessing ServiceNow

Requires ctx:
    state.serviceNowCreateIncidentParams: obj, key/value pairs to add to new incident via request-body. For more info see https://developer.servicenow.com/dev.do#!/reference/api/sandiego/rest/c_TableAPI#table-POST.    

Writes values:
    ctx.state.serviceNowIncidentResult: obj, content of new incident (value of 'result' property in POST response)
*/


const [snInstanceName, snUsername] = await getVariables(['serviceNowInstanceName', 'serviceNowVirtualAgentUsername']);
const snPassword = await getSecret('serviceNowVirtualAgentPassword');
const tableName = 'incident';
const url = 'https://' + snInstanceName + '.service-now.com/api/now/table/' + tableName;

const data = {};
if (ctx.state.serviceNowCreateIncidentParams) {
    data = ctx.state.serviceNowCreateIncidentParams;
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
    res = await axios.post(url, data, config);
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