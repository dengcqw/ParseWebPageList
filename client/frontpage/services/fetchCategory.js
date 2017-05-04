

export default ({siteID, categoryID}) => {
  return fetch('/api/fetchCatetory?siteid='+siteId+'&categoryid='+categoryID)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server")
      }
      return response.json();
    })
}


