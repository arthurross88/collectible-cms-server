// Import packages.
var compression = require('compression');
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken');
var busboy      = require('connect-busboy');
var config      = require('./config');

// Should we put these into app.set for a poor man's dependency injection?
var User                = require('./server/models/user');
var Collectible         = require('./server/models/collectible');
var StampistCatalogue   = require('./server/models/stamps/stampistCatalogue');
var StampistCollectible = require('./server/models/stamps/stampistCollectible');
var ScottCatalogue      = require('./server/models/stamps/scottCatalogue');

// Configuration.
var port = config.port;
mongoose.connect(config.database);
app.set('tokenSignature', config.tokenSignature);

// Compress (gzip) http responses.
app.use(compression());

// Use body parser so we can get info from POST and/or URL parameters
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use morgan to log requests to the console
app.use(morgan('dev'));

// Api Routes
var router = express.Router();
require('./server/routes/')(app, router);
app.use('/api/v1', router);
// Static Routes.
app.use('/apidoc', express.static('apidoc'));
app.use('/uploads', express.static('uploads'));
app.use('/client', express.static('client'));
app.use('/', express.static('client'));
app.use('*', express.static('client'));

// Start the server
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
