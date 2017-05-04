

export default ({siteID, categoryID}) => {
  return fetch('/api/fetchCatetory?siteid='+siteID+'&categoryid='+categoryID)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server")
      }
      return response.json()
    }).catch(err => console.log('fetchCatetory error: ', err.message))
}


