
var express = require('express'),
  router = express.Router();

var parser = require('../../ParseWebPage/DefaultParser.js');

/*
 * /api/ as relerant root
 */
router.all('/:id', function(req, res) {
  console.log("----> "+"request api:");
  console.log(req.params.id);
  if (req.params.id == 'getFilenames')  {
    parser.getFileNames((names)=> {
      console.log("----> "+"get file names");
      console.log(names);
      res.send(names);
    })
  } else if (req.params.id == 'getContent') { // /getContent?filename='json'
    parser.getContent(req.query.filename, (content)=>{
      res.send(content);
    });
  } else if (req.params.id == 'fetchHotList') {
    parser.start().then((all)=>{
      if (all) {
        res.send(all);
      }
    });
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
