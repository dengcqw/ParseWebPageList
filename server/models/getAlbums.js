
// need bind this to index db obj
function getAlbumsPromise(urlIds) {
  return new Promise((res, rej) => {
    getAlbums(this, urlIds, function(result, err) {
      if (result) res(result)
      else rej(err)
    })
  })
}


// models is db defined in ./idnex.js
function getAlbums(models, urlIds, callback/* (result, err) */) {
  if (!urlIds) {
    callback(null, new Error('get hot list with null date'))
    return
  }
  let jobCount = urlIds.length
  let result = {}
  urlIds.forEach(urlid => {
    if (!urlid) return
    models.updateQueue.enqueue(() => {
      return models.Album.find({where:{urlid}})
        .then(album => {
          if (album) {
            result[urlid] = album.toJSON()
          } else {
            result[urlid] = {}
            console.log("----> get albums error, album not exist:", urlid)
          }
          jobCount--
          if (jobCount == 0) callback(result)
        }).catch(err => {
          console.log("----> get albums error: ", urlid, err)
          result[urlid] = {}
          jobCount--
          if (jobCount == 0) callback(result)
        })
    })
  })
}


// send all the urlid in a day
module.exports = {
  getAlbums,
  getAlbumsPromise,
}

