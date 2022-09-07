/*
Description:
    Searches Workday Workers for ctx.user.firstName + ' ' + ctx.user.lastName and updates ctx.state with resulting matches.

Requires ctx:
    user.firstName: user's first name
    user.lastName: user's last name
    state.auth.workday.accessToken: str or null, newly-fetched access token (if request-success) or null (if request-failure)

Requires configurations:
    workdayTenantId: ID of Workday tenant

Writes values:
    ctx.state.user.workday.workersMatchingByName: array[obj], one obj for each worker matching by name. Object key/values are profile-details for the worker.

Example of a single element from the ctx.state.user.workday.workersMatchingByName array:
    {
        "id": "16e70a5cf7ff011733b793499f34ea0b",
        "descriptor": "ASHLEY A PARKER",
        "person": {
            "id": "16e70a5cf7ff016aff34d6339f34d40b",
            "email": "aparker@zktechnology.com"
        },
        "primaryJob": {
            "id": "16e70a5cf7ff01b9ffa994499f34ef0b",
            "descriptor": "P-00575 SALES ADMIN ASSISTANCE - ASHLEY A PARKER",
            "location": {
                "id": "4d4ec8ccd071018d93e3c369db0d6105",
                "descriptor": "New Jersey",
                "Location_ID": "LOCATION-6-189",
                "country": {
                    "descriptor": "United States of America",
                    "ISO_3166-1_Alpha-3_Code": "USA"
                }
            },
            "supervisoryOrganization": {
                "id": "4d4ec8ccd07101a5082d0f761f0ea206",
                "descriptor": "Sales Department (Luisa Martinez)",
                "Organization_Reference_ID": "SUPERVISORY_ORGANIZATION-6-228"
            },
            "businessTitle": "SALES ADMIN ASSISTANCE",
            "jobType": {
                "descriptor": "Primary",
                "Job_Type_Name_ID": "Primary"
            },
            "jobProfile": {
                "id": "0ab4a132f857010f4896687c9821d707",
                "descriptor": "SALES ADMIN ASSISTANCE",
                "Job_Profile_ID": "SALES ADMIN ASSISTANCE"
            }
        }
    }
*/

if (!('errorLog' in ctx.state)) {
    ctx.state.errorLog = [];
}

try {
    const fullName = ctx.user.firstName + ' ' + ctx.user.lastName;
    const accessToken = ctx.state.auth.workday.accessToken;
    const tenantId = await getVariable('workdayTenantId');

    // Define the request parameters
    const requestParams = {
        method: 'POST',
        url: 'https://wd2-impl-services1.workday.com/api/common/v1/' + tenantId + '/workers?search=' + fullName,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
    };

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
        ctx.state.user.workday.workersMatchingByName = res.data.data;
    }

} catch (error) {
    const newErr = JSON.stringify(err, Object.getOwnPropertyNames(err));
    ctx.state.errorLog.push(newErr);
}