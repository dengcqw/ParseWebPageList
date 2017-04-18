
const phantom = require('phantom');

const loadWebPage = async function(pageURL) {
  const instance = await phantom.create();
  const page = await instance.createPage();

  const status = await page.open(pageURL);
  console.log(status);

  const content = await page.property('content');

  await instance.exit();

  return content;
};

module.exports = loadWebPage;

