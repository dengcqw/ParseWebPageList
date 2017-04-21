
var express = require('express'),
  router = express.Router();

/*
 * /api/ as relerant root
 */
router.all('/:id', function(req, res) {
  console.log("----> "+"request api:");
  console.log(req.params.id);
  if (req.params.id == 'count.json')  {
    res.send(['json', 'xml']);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
