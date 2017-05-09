
export default () => {
  return fetch('/api/downloadJson')
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server")
      }
      return response.text();
    })
}
