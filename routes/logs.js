let express = require('express');
let http = require('http');
let querystring = require('querystring');
let router = express.Router();

/* GET contents of log files from specified servers */
router.get('/:log', function(req, res, next) {
  let log = req.params.log;
  let servers = req.query.servers;
  let lines = req.query.num || false;
  let filter = req.query.filter || '';
  let requestParams = {};

  if (!servers) {
    res.end('Error: at least one server must be specified for argument "servers"');
    throw Error('Error: at least one server must be specified for argument "servers"');
  }

  if (lines) {
    requestParams.num = lines;
  }

  if (filter) {
    requestParams.filter = filter;
  }

  res.setHeader('Content-Type', 'application/json');

  let result = {};
  for (let i in servers) {
    let server = servers[i];

    http.get('http://' + server + '/log/' + log + '?' + querystring.stringify(requestParams), (response) => {
      let respValue = '';

      response.on('data', (chunk) => {
        respValue += chunk;
      });

      response.on('end', () => {
        result[server] = respValue;
      });
    }).on('error', (error) => {
      console.error('Error: ' + error.message);
      result[server] = {
        error: error.message
      };
    });
  }

  res.json(result);
});

module.exports = router;
