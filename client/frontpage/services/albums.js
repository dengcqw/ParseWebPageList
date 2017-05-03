
export default (urlIds) => {
  return fetch('/api/getAlbums', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(urlIds)
  }).then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server")
    }
    return response.json()
  })
}
