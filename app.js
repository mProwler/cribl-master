const PORT = 8181;

let express = require('express');
let logger = require('morgan');
let logsRouter = require('./routes/logs');

let app = express();

// Setup dependencies
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup route(s)
app.use('/logs', logsRouter);

// Listen for connections
app.listen(PORT, function() {
    console.debug('Node server started');
});

module.exports = app;
