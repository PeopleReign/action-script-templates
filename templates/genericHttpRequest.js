/*
Template for executing a generic HTTP request with Axios.

More information on Axios available at: https://www.npmjs.com/package/axios
*/

// Define the request parameters
let requestParams = {
  // `url` is the server URL that will be used for the request
  url: '/user',

  // `method` is the request method to be used when making the request
  method: 'get', // default

  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to methods of that instance.
  baseURL: 'http://foo.bar',

  // `headers` are custom headers to be sent
  headers: { 'Content-Type': 'application/json' },

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream, Buffer
  data: {
    firstName: 'Fred'
  },

  // `timeout` specifies the number of milliseconds (1000 = 1 second) before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 1000, // default is `0` (no timeout)

  // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
  // This will set an `Authorization` header, overwriting any existing
  // `Authorization` custom headers you have set using `headers`.
  // Please note that only HTTP Basic auth is configurable through this parameter.
  // For Bearer tokens and such, use `Authorization` custom headers instead.
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `maxContentLength` defines the max size of the http response content in bytes allowed in node.js
  maxContentLength: 2000,

  // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed
  maxBodyLength: 2000,

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // If set to 0, no redirects will be followed.
  maxRedirects: 21, // default

}

// Execute the request
axios.request(requestParams)
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
  