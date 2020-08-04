let express = require('express');
let http = require('http');
let querystring = require('querystring');
let router = express.Router();

/**
 * Get log contents from remote server
 * @param server
 * @param log
 * @param requestParams
 * @returns {Promise<String>}
 */
function getLog(server, log, requestParams) {
  return new Promise((resolve, reject) => {
    http.get('http://' + server + '/log/' + log + '?' + querystring.stringify(requestParams), (response) => {
      let respValue = '';

      response.on('data', (chunk) => {
        respValue += chunk;
      });

      response.on('end', () => {
        resolve(respValue);
      });
    }).on('error', (error) => {
      reject('Error: ' + error.message);
    });
  });
}

/**
 * Request log from 1 or more servers
 * @param servers
 * @param log
 * @param requestParams
 * @returns {Promise<{}>}
 */
async function requestLogs(servers, log, requestParams) {
  let result = {};
  for (let i in servers) {
    let server = servers[i];
    try {
      result[server] = {
        log: await getLog(server, log, requestParams)
      };
    } catch (e) {
      console.error('Error while requesting log: ' + e);
      result[server] = {
        error: e
      };
    }
  }

  return result;
}

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
  } else {
    // Split servers list into array
    servers = servers.split(',');
  }

  if (lines) {
    requestParams.num = lines;
  }

  if (filter) {
    requestParams.filter = filter;
  }

  res.setHeader('Content-Type', 'application/json');

  // Request logs from specified hosts and return json result
  requestLogs(servers, log, requestParams).then(result => {
    res.json(result);
  });
});

module.exports = router;
