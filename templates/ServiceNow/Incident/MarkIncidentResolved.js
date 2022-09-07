/*
Requires configurations:
    serviceNowInstanceName: ID of ServiceNow instance (like: 'acmecorpsubprod', corresponding to https://acmecorpsubprod.service-now.com)
    serviceNowVirtualAgentUsername: ServiceNow username for the Virtual Agent to use when accessing ServiceNow

Requires secrets:
    serviceNowVirtualAgentPassword: ServiceNow password for the Virtual Agent to use when accessing ServiceNow

Required ctx:
    state.serviceNowResolveIncidentSysId: Sys ID of incident in ServiceNow to mark resolved (state = 6).    

Writes values:
    ctx.state.serviceNowIncidentResult: obj, content of new incident (value of 'result' property in PATCH response)
*/


const [snInstanceName, snUsername] = await getVariables(['serviceNowInstanceName', 'serviceNowVirtualAgentUsername']);
const snPassword = await getSecret('serviceNowVirtualAgentPassword');
const tableName = 'incident';
const url = 'https://' + snInstanceName + '.service-now.com/api/now/table/' + tableName + '/' + ctx.state.serviceNowResolveIncidentSysId;


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
    res = await axios.patch(url, {state: 6}, config);
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

if (res != null) {
    // Handle a successful response
    ctx.state.serviceNowIncidentResult = res.data.result;
}