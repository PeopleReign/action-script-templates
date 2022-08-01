/*
Template for executing general-purpose logic.

Action-script code should be wrapped in this template, inside the try-block.
*/

if (!('errorLog' in ctx.state)) {
    ctx.state.errorLog = [];
}

try {

    // Your logic here

} catch (err) {
    let newErr = JSON.stringify(err, Object.getOwnPropertyNames(err));
    ctx.state.errorLog.push(newErr);
}