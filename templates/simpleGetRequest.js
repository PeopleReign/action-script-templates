/*
Template for executing a simple GET request with Axios.

More information on Axios available at: https://www.npmjs.com/package/axios
*/

let url = 'http://foo.bar';
let res = axios.get(url)
  .then((resp) => {
    // Handle a successful response

    /* 
    Available properties include:
    - 
    - data: the response body that was provided by the server
    - status: integer, the HTTP status code from the server response
    - statusText: string, the HTTP status message from the server response
    - headers: object, the headers that the server responded with (all header names lowercased)
    */
  })
  .catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      
      /* 
      Relevant properties include:
      - error.response.data: the response body that was provided by the server
      - error.response.status: integer, the HTTP status code from the server response
      - error.response.statusText: string, the HTTP status message from the server response
      - error.response.headers: object, the headers that the server responded with (all header names lowercased)      console.log(error.response.data);
      */
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      
      /*
      Relevant properties include:
      - error.request: the request that was sent
      */
    } else {
      // Something happened in setting up the request that triggered an Error
      
      /*
      Relevant properties include:
      - error.message: string, message indicating what went wrong with the request
      */
    }
    console.log(error.config);

  })