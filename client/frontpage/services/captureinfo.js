
export default () => {
  return fetch('/api/captureInfo')
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server")
      }
      return response.json();
    })
}

