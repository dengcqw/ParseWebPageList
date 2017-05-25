//
//https://stackoverflow.com/questions/5744990/how-to-upload-a-file-from-node-js
//更多内容 https://cnodejs.org/topic/4ffed8544764b729026b1da3
//https://stackoverflow.com/questions/19906488/convert-stream-into-buffer

// multipart/form-data 描述了传送大文件时 ，body的格式
// https://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.2

const apiOptions = require('../SyncDetail/api.js')
const fs = require('fs')
const http = require('http')
const archiver = require('archiver')
const streamBuffers = require('stream-buffers')
const request = require("request");

const uploadOption = apiOptions.uploadOption

function uploadFileWithRequst(zipBuffer, callback=(response, err)=>{}) {
  var options = {
    method: 'POST',
    url: 'http://' + uploadOption.host + uploadOption.path,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: {
      file: {
        value: zipBuffer,
        options: {
          filename: ' tvguoapp.zip',
          contentType: null
        }
      }
    }
  }

  request(options, function (error, response, body) {
    callback(response, error)
    console.log(body)
  })
}

function uploadFileWithHttp(zipBuffer, callback=(response, err)=>{}) {
  var options = {
    port: 80,
    host: uploadOption.host,
    path: uploadOption.path,
    method: 'POST'
  }

  var reqHttp = http.request(options, function(response) {
    console.log("statusCode: ", response.statusCode)
    console.log("headers: ", response.headers)
    reqHttp.on('close', function() {
      console.log("----> http req close")
      callback(response, null)
    })
    reqHttp.on("finish", function() {
      console.log("----> http req finish")
    })
  })
  reqHttp.on('error', function(error) {
    callback(null, error)
  })

  var boundaryKey = Math.random().toString(16)
  var payload = '--' + boundaryKey + '\r\n'
  + 'Content-Disposition: form-data; name="file"; filename="tvguoapp.zip"\r\n\r\n'
  var enddata  = '\r\n--' + boundaryKey + '--'

  //格式必须按标准来写，空行也不能少
  //console.log("post body:\n" + payload + zipBuffer.toString() + enddata)

  reqHttp.setHeader('Content-Type', 'multipart/form-data; boundary='+boundaryKey+'')
  reqHttp.write(payload)
  reqHttp.write(zipBuffer)
  reqHttp.write(enddata)
  reqHttp.end()
}

function refreshCache(callback=(response, err)=>{}) {
  request(apiOptions.clearFileCacheOption, function (error, response, body) {
    callback(response, error)
    console.log(body)
  })
}


function zipFileToStream(fileContent, stream) {
  var archive = archiver('zip', {
    zlib: { level: 9 }
  })

  archive.on('error', function(err) {
    throw err
  })
  archive.on('finish', function(err) {
    console.log("----> archive finish")
  })

  var buffer = Buffer.from(fileContent)
  archive.append(buffer, { name: '/tvguoapp/top.json' })
  // pipe archive data to the file
  archive.pipe(stream)
  // finalize the archive (ie we are done appending files but streams have to finish yet)
  archive.finalize()
}

function writeToBuffer(fileContent) {
  return new Promise(function(res, rej) {
    var writeStream = new streamBuffers.WritableStreamBuffer({
      initialSize: (50 * 1024),   // start at 100 kilobytes.
      incrementAmount: (5 * 1024) // grow by 10 kilobytes each time buffer overflows.
    })
    writeStream.on("finish", function() {
      console.log("----> zip file write to buffer finish")
      console.log("----> zip file size", writeStream.size())
      res(writeStream.getContents())
    })
    zipFileToStream(fileContent, writeStream)
  })
}

const PromiseWrapper = (wrapper=(res, rej)=>{}) => {
  return new Promise(function(res, rej){
    wrapper(res, rej)
  })
}


module.exports = (fileContent) => {
  return writeToBuffer(fileContent).then(zipBuffer => {
    console.log("----> zip buffer length", zipBuffer.length)
    return PromiseWrapper((res, rej) => {
      uploadFileWithRequst(zipBuffer, (response, err) =>{
        if (err) rej(err)
        else res(response)
      })
    })
  }).then(response => {
    console.log("----> upload file response", response.statusCode)
    return PromiseWrapper((res, rej) => {
      refreshCache((response, err) =>{
        if (err) rej(err)
        else res(response)
      })
    })
  }).then(response => {
    console.log("----> clear cache file response", response.statusCode)
  })
}

