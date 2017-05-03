
/*
 * hot list content in a day, just a collection of url id
 * detail info store in album.js
 */

const contentCache = {}

export default (dateString) => {
  if (!dateString ) throw new Error('dateString is undefined, can not get content')
  if (contentCache[dateString]) {
    console.log("----> "+"get content cache: " + dateString)
    return Promise.resolve(contentCache[dateString])
  }

  return fetch('/api/getHotList?date='+dateString)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server")
      }
      return response.json()
    })
    .then((content) => {
      if (Object.keys(content).length) {
        contentCache[dateString] = content
      }
      return content
    })
}
