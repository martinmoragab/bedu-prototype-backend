var router = require('express').Router();

router.get('/', (req, res)=>{
  res.send('Welcome to Stock Market Viewer!');
});

router.use('/users', require('./users'));

module.exports = router;
