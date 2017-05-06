

export default (detailItem) => {
  return fetch('/api/saveDetail', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(detailItem)
  }).then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server")
    }
    return response.json()
  })
}
