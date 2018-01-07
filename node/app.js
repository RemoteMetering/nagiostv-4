
/*
 * TODO:
 * - Add a settings file and move the username password for Nagios in there.
 *
 */

//=============================================================================
// Requires
//=============================================================================

var express = require('express');
var app = express();
var cors = require('cors');
var fs = require('fs');
var bodyParser = require('body-parser');
var requestProxy = require('express-request-proxy');

//=============================================================================
// Settings
//=============================================================================

let settings;
let settingsJson;

// Load the settings.js file, if it exists
try {
  const stats = fs.lstatSync('settings.js');
  if (stats.isFile()) { console.log('settings.js file found.'); }
  settings = require('./settings');
}
catch (e) {
  console.log('Copy the file settings.dist.js to settings.js and edit settings.js');
  process.exit();
}

loadSettingsJson();

//=============================================================================
// loadSettings and saveSettings
//=============================================================================
function loadSettingsJson() {
  // Load the settings-json.js file, if it exists
  try {
    const stats = fs.lstatSync('settings-json.js');
    if (stats.isFile()) { console.log('settings-json.js file found.'); }
    settingsJson = require('./settings-json');
    console.log(settingsJson.nagiosServerHost);
  } catch (e) {
    console.log('No settings-json.js found');
  }
}

function clearSettings(req, res) {
  let stats;
  try {
    stats = fs.lstatSync('settings-json.js');
  } catch (e) {
    console.log('settings-json.js file not found');
  }
  if (stats && stats.isFile()) {
    // delete the file
    fs.unlink('settings-json.js', (err) => {
      if (err) throw err;
      console.log('successfully deleted settings-json.js');

      res.json({
        status: 'settings-json.js cleared'
      });
    });
  } else {
    res.json({
      status: 'settings-json.js file not found'
    });
  }
}

function sendSettings(req, res) {
  console.log('sendSettings()');
  // Send settings but without password
  const settingsWithoutPassword = Object.assign({}, settingsJson, {
    password: ''
  })
  res.json(settingsWithoutPassword);
}

function saveSettings(req, res) {
  console.log('saveSettings()');

  if (!req.body) {
    console.log('saveSettings() no data so no save');
    return;
  }

  var text = 'module.exports = ' + JSON.stringify(req.body, null, "\t");
  fs.writeFile('settings-json.js', text, (err) => {
    if(err) {
      res.send({
        success: false,
        successMessage: 'Failure writing to file.'
      });
      return console.log(err);
    }
    console.log("The file was saved!");
    res.send({
      success: true,
      successMessage: 'Thanks for the settings.'
    });

    // save the settings locally
    settingsJson = req.body;
    // update the proxy
    decorateProxyOptions();
  });
}

//=============================================================================
// Set up routes
//=============================================================================

app.use(cors());

// to support JSON-encoded bodies
app.use(bodyParser.json());

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', express.static('../dist'));

// GET Clear settings
app.get('/settings-clear', function(req, res) {
   clearSettings(req, res);
});

// GET Load settings
app.get('/settings', function(req, res) {
   sendSettings(req, res);
});

// POST Save settings
app.post('/settings', function(req, res) {
   saveSettings(req, res);
});

function decorateProxyOptions() {
  if (!settingsJson) {
    return;
  }
  proxyOptions.url = settingsJson.nagiosServerHost + settingsJson.nagiosServerCgiPath + '/:resource';
  if (settingsJson.auth) {
    proxyOptions.headers = {
      Authorization: "Basic " + new Buffer(settingsJson.username + ':' + settingsJson.password).toString('base64')
    };
  }
  //console.log('proxyOptions is', proxyOptions);
}

// Proxy to Nagios server
var proxyOptions = {};
decorateProxyOptions();

app.get('/nagios/:resource', requestProxy(proxyOptions));

// Server listen on port
app.listen(settings.serverPort);

console.log('Listening on port ' + settings.serverPort + '...');
