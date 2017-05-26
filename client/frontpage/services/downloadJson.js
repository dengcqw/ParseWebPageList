/**
 * 创建并下载文件
 * @param  {String} fileName 文件名
 * @param  {String} content  文件内容
 */
const downloadFile = fileName => content => {
    var aTag = document.createElement('a')
    var blob = new Blob([content])
    aTag.download = fileName
    aTag.href = URL.createObjectURL(blob)
    aTag.click()
    URL.revokeObjectURL(blob)
    console.log("----> download file", fileName, content)
}

export default (type, fileName, date) => {
  return fetch(`/api/downloadJson?type=${type}&date=${date}`)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server")
      }
      return response.text()
    })
    .then(downloadFile(fileName))
}
