

export default (date) => {
  return fetch('/api/syncDetail?date='+date)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server")
      }
      return response.text();
    })
}


