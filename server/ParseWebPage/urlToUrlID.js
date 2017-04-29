
const md5Hex = require('md5-hex');

module.exports = function (url, partStrs/* strs to delete */) {
  function deleteStr(origStr, partStr) {
    if (typeof origStr == 'string' && typeof partStr == 'string') {
      if (origStr.indexOf(partStr) != -1) {
        return origStr.slice(0, origStr.indexOf(partStr));
      } else {
        return origStr;
      }
    }
  }

  partStrs = partStrs || ['?', '#'];
  url = partStrs.reduce(deleteStr, url);
  return md5Hex(url).slice(8,24);
}

